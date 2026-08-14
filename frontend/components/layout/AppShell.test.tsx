import { describe, expect, it } from "vitest";

import { isActive } from "./AppShell";

describe("isActive", () => {
  it("exact-matches the dashboard route only", () => {
    expect(isActive("/dashboard", "/dashboard")).toBe(true);
    expect(isActive("/dashboard/anything", "/dashboard")).toBe(false);
  });

  it("matches a top-level route on itself", () => {
    expect(isActive("/courses", "/courses")).toBe(true);
    expect(isActive("/semesters", "/semesters")).toBe(true);
  });

  it("matches a route's own sub-routes (deep link, e.g. semester -> course navigation)", () => {
    expect(isActive("/courses/42", "/courses")).toBe(true);
    expect(isActive("/semesters/7", "/semesters")).toBe(true);
    expect(isActive("/semesters/7/roadmap", "/semesters")).toBe(true);
  });

  it("does not treat a merely-prefixed, unrelated route as a match", () => {
    // Regression guard: a naive `pathname.startsWith(href)` would wrongly
    // light up "/courses" for a route like "/courses-archive".
    expect(isActive("/courses-archive", "/courses")).toBe(false);
  });

  it("does not cross-match sibling top-level routes", () => {
    expect(isActive("/courses/42", "/semesters")).toBe(false);
    expect(isActive("/semesters/7", "/courses")).toBe(false);
  });
});
