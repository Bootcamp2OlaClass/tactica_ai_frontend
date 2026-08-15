import { expect, test } from "@playwright/test";

// Covers the deterministic core of PROJECT_CONTEXT.md's critical workflow:
// register -> dashboard -> create a semester -> sign out -> log back in
// (exercising the separate login form, not just register's own
// auto-authenticated redirect) -> confirm the semester survived the
// session round trip -> sign out again -> confirm the session is actually
// gone, not just navigated away from.
//
// Deliberately NOT covered here: document upload/processing (needs a live
// Celery worker consuming the "documents" queue alongside the API), and
// the AI features -- chat, roadmap generation (need real LLM credentials,
// absent in this environment; both gracefully degrade rather than error
// when unconfigured, which the backend's own test suite already proves).
// See PHASE_15_TESTING_CI_CD.md "Remaining Limitations" for the reasoning.
test("register -> create semester -> sign out -> log back in -> sign out", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "Sup3rSecret!";

  await page.goto("/register");

  await page.getByLabel("Full name").fill("E2E Test Student");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/semesters");
  await page.getByRole("button", { name: "New semester" }).first().click();

  const semesterName = `E2E Semester ${Date.now()}`;
  await page.getByLabel("Name").fill(semesterName);
  await page.getByLabel("Start date").fill("2026-09-01");
  await page.getByLabel("End date").fill("2026-12-15");
  await page.getByRole("button", { name: "Create semester" }).click();

  await expect(page.getByRole("heading", { name: semesterName })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login/);

  // A signed-out session must not be able to reach an authenticated page --
  // proves sign-out actually cleared the session, not just navigated away.
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);

  // Exercise the login form specifically (register's own auto-login is a
  // different code path) and confirm the semester persisted across it.
  await page.goto("/login");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/semesters");
  await expect(page.getByRole("heading", { name: semesterName })).toBeVisible();

  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login/);
});
