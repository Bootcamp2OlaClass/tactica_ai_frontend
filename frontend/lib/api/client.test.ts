import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  ApiError,
  clearAuthenticationToken,
  getApiErrorMessage,
  getApiFieldErrors,
  hasAuthenticationToken,
  refreshSession,
  setAuthenticationToken,
} from "./client";

describe("getApiErrorMessage", () => {
  it("gives a friendly message for an expired session", () => {
    const error = new ApiError("Invalid or expired token", 401);
    expect(getApiErrorMessage(error)).toBe("Your session has expired. Please sign in again.");
  });

  it("gives a friendly message for a not-found record", () => {
    const error = new ApiError("Semester not found or inaccessible", 404);
    expect(getApiErrorMessage(error)).toBe("That item couldn't be found — it may have been deleted.");
  });

  it("surfaces the server's own message for a conflict", () => {
    const error = new ApiError("Duplicate active semester", 409);
    expect(getApiErrorMessage(error)).toBe("Duplicate active semester");
  });

  it("gives a friendly message when the network itself failed", () => {
    const error = new ApiError("network down", 0);
    expect(getApiErrorMessage(error)).toBe("Can't reach the server. Check your connection and try again.");
  });

  it("falls back to a generic message for a plain Error", () => {
    expect(getApiErrorMessage(new Error(""), "fallback")).toBe("fallback");
  });
});

describe("getApiFieldErrors", () => {
  it("extracts a field->message map from a 422 validation body", () => {
    const error = new ApiError("Request failed with status 422.", 422, {
      detail: [
        { loc: ["body", "name"], msg: "Field required", type: "missing" },
        { loc: ["body", "academic_year"], msg: "Input should be greater than 2000", type: "greater_than" },
      ],
    });

    expect(getApiFieldErrors(error)).toEqual({
      name: "Field required",
      academic_year: "Input should be greater than 2000",
    });
  });

  it("returns null for a non-422 error", () => {
    const error = new ApiError("not found", 404, { detail: "not found" });
    expect(getApiFieldErrors(error)).toBeNull();
  });

  it("returns null when the 422 body has no field-level detail array", () => {
    const error = new ApiError("bad request", 422, { detail: "just a string" });
    expect(getApiFieldErrors(error)).toBeNull();
  });
});

describe("session token state", () => {
  afterEach(() => {
    clearAuthenticationToken();
  });

  it("tracks whether an access token is currently held in memory", () => {
    expect(hasAuthenticationToken()).toBe(false);
    setAuthenticationToken("abc123");
    expect(hasAuthenticationToken()).toBe(true);
    clearAuthenticationToken();
    expect(hasAuthenticationToken()).toBe(false);
  });
});

describe("refreshSession", () => {
  const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "http://localhost:8000";
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
    clearAuthenticationToken();
    vi.restoreAllMocks();
  });

  it("stores the new access token and resolves true on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "fresh-token" }),
      }),
    );

    const result = await refreshSession();

    expect(result).toBe(true);
    expect(hasAuthenticationToken()).toBe(true);
  });

  it("clears the token and resolves false when the refresh cookie is invalid", async () => {
    setAuthenticationToken("stale-token");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));

    const result = await refreshSession();

    expect(result).toBe(false);
    expect(hasAuthenticationToken()).toBe(false);
  });

  it("coalesces concurrent callers onto a single in-flight request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: "fresh-token" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const [first, second] = await Promise.all([refreshSession(), refreshSession()]);

    expect(first).toBe(true);
    expect(second).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
