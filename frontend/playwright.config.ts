import { defineConfig, devices } from "@playwright/test";

// E2E config for the app's *deterministic* critical path only (auth,
// semester/course CRUD, dashboard) -- register -> login -> create semester
// -> create course -> dashboard -> logout. Document upload/processing and
// the AI features (chat, roadmap generation) are deliberately NOT covered
// here: the former needs a live Celery worker alongside the backend, the
// latter needs real LLM credentials neither of which this test run can
// assume are present. See PHASE_15_TESTING_CI_CD.md for the reasoning.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
