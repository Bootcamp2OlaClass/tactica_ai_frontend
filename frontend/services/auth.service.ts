import type {
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

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000";

  const response = await fetch(
    `${apiBaseUrl}/auth/login`,
    {
      method: "POST",
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
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8000";

  const response = await fetch(
    `${apiBaseUrl}/auth/register`,
    {
      method: "POST",
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