import { authenticatedApiRequest, hasConfiguredApi } from "@/lib/api/client";
import { dashboardFixture } from "@/lib/fixtures/dashboard";
import type { DashboardSummary } from "@/types/dashboard";

const DASHBOARD_SUMMARY_PATH = "/api/v1/dashboard/summary";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (!hasConfiguredApi()) {
    // TODO(TA-48/TA-49): Always call the API after the dashboard endpoint ships.
    return Promise.resolve(dashboardFixture);
  }

  return authenticatedApiRequest<DashboardSummary>(DASHBOARD_SUMMARY_PATH);
}
