type ApiErrorDetailItem = { loc?: (string | number)[]; msg?: string; type?: string };
type ApiErrorBody = {
  message?: string;
  detail?: string | ApiErrorDetailItem[] | { message?: string };
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

// Interim storage mechanism for Phase 0 only. Revisit as part of Phase 02
// (Auth Hardening / ADR-001) — httpOnly cookies avoid exposing the token to
// injected scripts, which plain localStorage does not.
const ACCESS_TOKEN_STORAGE_KEY = "tactica_access_token";

export function setAuthenticationToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearAuthenticationToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function hasAuthenticationToken(): boolean {
  return getAuthenticationToken() !== null;
}

function getAuthenticationToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * A 401 mid-session (expired/invalidated token) is handled centrally here
 * rather than in every caller: clear the stale token and bounce to /login
 * with a redirect back to the page the user was on.
 */
function handleUnauthorized(): void {
  clearAuthenticationToken();

  if (typeof window === "undefined") return;

  const current = `${window.location.pathname}${window.location.search}`;
  if (current.startsWith("/login")) return;

  window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
}

function extractFieldErrorMessage(item: ApiErrorDetailItem): string {
  const field = item.loc?.filter((part) => part !== "body").join(".") || "value";
  return `${field}: ${item.msg ?? "is invalid"}`;
}

function getErrorMessage(body: ApiErrorBody | null, status: number): string {
  if (typeof body?.message === "string") return body.message;

  if (typeof body?.detail === "string") return body.detail;

  if (Array.isArray(body?.detail)) {
    const messages = body.detail.map(extractFieldErrorMessage);
    return messages.length > 0 ? messages.join("; ") : `Request failed with status ${status}.`;
  }

  if (body?.detail && typeof body.detail === "object" && typeof body.detail.message === "string") {
    return body.detail.message;
  }

  if (typeof body?.error === "string") return body.error;
  if (body?.error && typeof body.error === "object" && typeof body.error.message === "string") {
    return body.error.message;
  }

  if (body?.errors?.[0]?.message) return body.errors[0].message;

  return `Request failed with status ${status}.`;
}

/**
 * Parses a FastAPI 422 validation body into a field-name -> message map,
 * for surfacing errors next to the relevant form field. Returns null for
 * any other error shape (domain errors, non-422 statuses, etc.).
 */
export function getApiFieldErrors(error: unknown): Record<string, string> | null {
  if (!(error instanceof ApiError) || error.status !== 422) return null;

  const body = error.body as ApiErrorBody | null;
  if (!Array.isArray(body?.detail)) return null;

  const fieldErrors: Record<string, string> = {};
  for (const item of body.detail) {
    const field = item.loc?.filter((part) => part !== "body").join(".");
    if (field) fieldErrors[field] = item.msg ?? "is invalid";
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
}

/** A single, consistent user-facing message for any thrown request error. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error instanceof ApiError) {
    if (error.status === 0) return "Can't reach the server. Check your connection and try again.";
    if (error.status === 401) return "Your session has expired. Please sign in again.";
    if (error.status === 403) return "You don't have permission to do that.";
    if (error.status === 404) return "That item couldn't be found — it may have been deleted.";
    if (error.status === 409) return error.message || "That conflicts with existing data.";
    if (error.status >= 500) return "The server ran into a problem. Please try again shortly.";
    return error.message || fallback;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
}

export function buildQueryString(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}

type ApiRequestInit = RequestInit & { json?: unknown };

async function performRequest(path: string, init: ApiRequestInit): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) throw new ApiError("The backend API is not configured.", 0);

  const token = getAuthenticationToken();
  if (!token) {
    handleUnauthorized();
    throw new ApiError("Please sign in to continue.", 401);
  }

  const { json, headers, ...rest } = init;
  const requestHeaders: Record<string, string> = { Accept: "application/json" };
  let body: BodyInit | undefined;

  if (json !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...rest,
      headers: { ...requestHeaders, ...headers, Authorization: `Bearer ${token}` },
      body: body ?? rest.body,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  if (response.status === 401) {
    handleUnauthorized();
  }

  return response;
}

export async function authenticatedApiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const response = await performRequest(path, init);

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  if (!response.ok) {
    throw new ApiError(getErrorMessage(body as ApiErrorBody | null, response.status), response.status, body);
  }

  if (body === null) {
    throw new ApiError("The server returned an empty response.", response.status);
  }

  return body as T;
}

export async function authenticatedFileUpload<T>(path: string, formData: FormData): Promise<T> {
  const response = await performRequest(path, { method: "POST", body: formData });

  const body = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  if (!response.ok) {
    throw new ApiError(getErrorMessage(body as ApiErrorBody | null, response.status), response.status, body);
  }

  if (body === null) {
    throw new ApiError("The server returned an empty response.", response.status);
  }

  return body as T;
}

function parseFileNameFromContentDisposition(header: string | null, fallback: string): string {
  if (!header) return fallback;
  const match = /filename\*?=(?:UTF-8''|")?([^";]+)"?/i.exec(header);
  return match ? decodeURIComponent(match[1]) : fallback;
}

export async function authenticatedDownload(
  path: string,
  fallbackFileName: string,
): Promise<{ blob: Blob; fileName: string }> {
  const response = await performRequest(path, {});

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(getErrorMessage(body, response.status), response.status, body);
  }

  const blob = await response.blob();
  const fileName = parseFileNameFromContentDisposition(
    response.headers.get("content-disposition"),
    fallbackFileName,
  );

  return { blob, fileName };
}
