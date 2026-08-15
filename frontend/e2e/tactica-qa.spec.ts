import { expect, test } from "@playwright/test";

// Ad-hoc QA pass for this session's changes, run against a live backend
// with LLM_PROVIDER=groq and a Celery worker actually consuming the
// documents/ai queues (unlike critical-path.spec.ts, which deliberately
// skips AI/document-processing since neither is normally available in
// CI). Covers: dashboard loads without a 500, semester -> course sidebar
// active-state, the color-picker course form, task creation, the task
// showing up on the native Calendar, marking it complete, Penguin Coach
// getting a real grounded answer, Recovery Plan using real task data,
// Settings -> Appearance theme toggle + refresh persistence, and Google
// Calendar still being reachable as an optional integration.
test.setTimeout(60000);

test("full workflow: dashboard, sidebar state, color picker, calendar, chat, recovery plan, theme", async ({ page }) => {
  const email = `qa-full-${Date.now()}@example.com`;
  const password = "Sup3rSecret!";

  // --- Register + dashboard loads clean (no 500) ---
  await page.goto("/register");
  await page.getByLabel("Full name").fill("QA Full Flow");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Something went wrong")).not.toBeVisible();
  await expect(page.getByText("Active courses")).toBeVisible();

  // --- Semester ---
  await page.goto("/semesters");
  await page.getByRole("button", { name: "New semester" }).first().click();
  const semesterName = `QA Semester ${Date.now()}`;
  await page.getByLabel("Name").fill(semesterName);
  await page.getByLabel("Start date").fill("2026-08-01");
  await page.getByLabel("End date").fill("2026-12-15");
  await page.getByRole("button", { name: "Create semester" }).click();
  await expect(page.getByRole("heading", { name: semesterName })).toBeVisible();

  await page.getByRole("link", { name: semesterName }).click();
  await expect(page).toHaveURL(/\/semesters\/\d+$/);

  // --- Course, created via the color picker (not a raw hex field) ---
  // Both the page header and the (currently empty) course list's empty
  // state render an "Add course" trigger -- either opens the same modal,
  // whose own submit button shares that exact text, so it's scoped to the
  // dialog once open to stay unambiguous.
  await page.getByRole("button", { name: "Add course" }).first().click();
  const addCourseDialog = page.getByRole("dialog");
  await addCourseDialog.getByLabel("Course code").fill("CS201");
  await addCourseDialog.getByLabel("Course name").fill("Algorithms");
  await addCourseDialog.getByRole("button", { name: "Teal" }).click();
  await expect(addCourseDialog.getByRole("button", { name: "Teal" })).toHaveAttribute("aria-pressed", "true");
  await addCourseDialog.getByRole("button", { name: "Add course", exact: true }).click();
  const courseLink = page.getByRole("link", { name: /CS201 — Algorithms/ });
  await expect(courseLink).toBeVisible();

  // --- Sidebar active-state: Semesters -> Course must switch to "Courses" ---
  await courseLink.click();
  await expect(page).toHaveURL(/\/courses\/\d+$/);
  await expect(page.getByRole("heading", { name: "CS201 — Algorithms" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Courses", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("link", { name: "Semesters", exact: true })).not.toHaveAttribute("aria-current", "page");

  // --- Task, created from the course page ---
  await page.getByRole("button", { name: "Add task" }).first().click();
  const addTaskDialog = page.getByRole("dialog");
  await addTaskDialog.getByLabel("Title").fill("QA Homework 1");
  const today = new Date();
  const dueLocal = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}T23:59`;
  await addTaskDialog.getByLabel("Due").fill(dueLocal);
  await addTaskDialog.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(page.getByText("QA Homework 1")).toBeVisible();

  // --- Calendar: the task appears (checked before completing it below) ---
  await page.goto("/calendar");
  await expect(page.getByRole("tab", { name: "My Calendar" })).toHaveAttribute("aria-selected", "true");
  // exact: true -- a "Delete task \"QA Homework 1\"" aria-label (added for
  // screen-reader clarity on the Upcoming panel's Delete button) otherwise
  // substring-matches this too.
  await expect(page.getByRole("button", { name: "QA Homework 1", exact: true })).toBeVisible();

  // --- Google Calendar remains reachable as an optional integration ---
  await page.getByRole("tab", { name: "Integrations" }).click();
  await expect(page.getByRole("button", { name: "Connect Google Calendar" })).toBeVisible();

  // --- Penguin Coach: real Groq-backed answer, grounded in course data ---
  await page.goto("/chat");
  await expect(page.getByRole("heading", { name: "Penguin Coach", exact: true })).toBeVisible();
  await page.getByLabel("Message the Penguin Coach").fill("What course am I taking? Answer in one short sentence.");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.getByText("Couldn't send")).not.toBeVisible({ timeout: 15000 });
  // Non-deterministic LLM wording -- assert a real, content-bearing answer
  // arrived (mentions the course somehow), not just the loading dots.
  await expect(page.getByText(/CS201|Algorithms/i).first()).toBeVisible({ timeout: 20000 });

  // --- Recovery Plan: real task data (task still incomplete at this
  // point), no raw config-error leakage ---
  await page.goto("/recovery-plan");
  await expect(page.getByText("No LLM provider is configured")).not.toBeVisible();
  await expect(page.getByText("QA Homework 1", { exact: true })).toBeVisible({ timeout: 15000 });

  // --- Back to Calendar: complete the task from the event-details modal ---
  await page.goto("/calendar");
  await page.getByRole("button", { name: "QA Homework 1", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: "QA Homework 1" })).toBeVisible();
  await dialog.getByRole("button", { name: "Complete" }).click();
  await expect(page.getByText("Task marked complete.")).toBeVisible();

  // --- Settings -> Appearance: theme toggle + refresh persistence ---
  await page.goto("/settings");
  await page.getByRole("tab", { name: "Appearance" }).click();
  await page.getByRole("radio", { name: /Dark/ }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect(page.getByRole("radio", { name: /Dark/ })).toHaveAttribute("aria-checked", "true");

  // --- Direct-route refresh (not just client-side nav) still works ---
  await page.goto(`${page.url().split("/settings")[0]}/dashboard`);
  await page.reload();
  await expect(page.getByText("Active courses")).toBeVisible();
});
