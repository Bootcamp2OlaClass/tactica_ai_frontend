type ApiErrorBody = {
  message?: string;
  detail?: string | { message?: string };
  error?: string | { message?: string };
  errors?: Array<{ message?: string }>;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getApiBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
}

export function hasConfiguredApi(): boolean {
  return getApiBaseUrl().length > 0;
}

function getAuthenticationToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("access_token") ??
    window.localStorage.getItem("auth_token") ??
    window.localStorage.getItem("token")
  );
}

function getErrorMessage(body: ApiErrorBody | null, status: number): string {
  if (typeof body?.message === "string") return body.message;
  if (typeof body?.detail === "string") return body.detail;
  if (body?.detail && typeof body.detail.message === "string") {
    return body.detail.message;
  }
  if (typeof body?.error === "string") return body.error;
  if (body?.error && typeof body.error.message === "string") {
    return body.error.message;
  }
  if (body?.errors?.[0]?.message) return body.errors[0].message;
  return `Request failed with status ${status}.`;
}

export async function authenticatedApiRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new ApiError("The backend API is not configured.", 0);

  const token = getAuthenticationToken();
  if (!token) throw new ApiError("Please sign in to view your dashboard.", 401);

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const body = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(body as ApiErrorBody | null, response.status),
      response.status,
      body,
    );
  }

  if (body === null) {
    throw new ApiError("The server returned an empty response.", response.status);
  }

  return body as T;
}
