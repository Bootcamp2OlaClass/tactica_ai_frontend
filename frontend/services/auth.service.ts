import { authenticatedApiRequest, clearAuthenticationToken } from "@/lib/api/client";
import type {
  CurrentUser,
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
} from "@/types/auth";

export class AuthenticationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);

    this.name = "AuthenticationError";
    this.status = status;
  }
}

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
}

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/auth/login`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new AuthenticationError(
        "The email or password you entered is incorrect.",
        401,
      );
    }

    if (response.status === 423) {
      throw new AuthenticationError(
        "This account is temporarily locked after repeated failed sign-in attempts. Try again in a few minutes.",
        423,
      );
    }

    if (response.status >= 500) {
      throw new AuthenticationError(
        "Authentication service is temporarily unavailable. Please try again.",
        response.status,
      );
    }

    throw new AuthenticationError(
      "Unable to sign in. Please check your information and try again.",
      response.status,
    );
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
  };
}

export async function register(
  credentials: RegisterCredentials,
): Promise<LoginResponse> {
  const response = await fetch(
    `${getApiBaseUrl()}/auth/register`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
        full_name: credentials.fullName,
      }),
    },
  );

  if (!response.ok) {
    if (response.status === 409) {
      throw new AuthenticationError(
        "An account with this email already exists.",
        409,
      );
    }

    if (response.status >= 500) {
      throw new AuthenticationError(
        "Registration is temporarily unavailable. Please try again.",
        response.status,
      );
    }

    throw new AuthenticationError(
      "Unable to create your account. Please check your information and try again.",
      response.status,
    );
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
  };
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${getApiBaseUrl()}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Best-effort server-side revocation — the client-side session clears
    // regardless, so a network failure here shouldn't trap the user.
  }

  clearAuthenticationToken();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const data = await authenticatedApiRequest<{
    id: number;
    email: string;
    full_name: string;
    role: string;
    email_verified: boolean;
  }>("/auth/me");

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    emailVerified: data.email_verified,
  };
}

export async function updateProfile(fullName: string): Promise<CurrentUser> {
  const data = await authenticatedApiRequest<{
    id: number;
    email: string;
    full_name: string;
    role: string;
    email_verified: boolean;
  }>("/auth/me", { method: "PATCH", json: { full_name: fullName } });

  return {
    id: data.id,
    email: data.email,
    fullName: data.full_name,
    role: data.role,
    emailVerified: data.email_verified,
  };
}

export async function requestPasswordReset(email: string): Promise<void> {
  await fetch(`${getApiBaseUrl()}/auth/password-reset/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  // Always resolves — the backend intentionally never reveals whether the
  // email exists, so there is nothing meaningful to branch on here.
}

export async function confirmPasswordReset(
  token: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/password-reset/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!response.ok) {
    throw new AuthenticationError(
      "This reset link is invalid or has expired. Request a new one.",
      response.status,
    );
  }
}

export async function resendVerificationEmail(): Promise<void> {
  await authenticatedApiRequest("/auth/verify-email/resend", { method: "POST" });
}

export async function confirmEmailVerification(token: string): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/auth/verify-email/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new AuthenticationError(
      "This verification link is invalid or has expired.",
      response.status,
    );
  }
}
