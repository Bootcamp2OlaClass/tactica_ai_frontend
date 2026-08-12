import { describe, expect, it } from "vitest";

import { ApiError, getApiErrorMessage, getApiFieldErrors } from "./client";

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
