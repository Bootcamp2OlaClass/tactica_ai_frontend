import { authenticatedApiRequest, hasConfiguredApi } from "@/lib/api/client";
import { dashboardFixture } from "@/lib/fixtures/dashboard";
import { mapDashboardSummary, type RawDashboardSummary } from "@/lib/mappers/dashboard";
import type { DashboardSummary } from "@/types/dashboard";

// Matches the router prefix + route in app/routers/dashboard.py exactly:
// router = APIRouter(prefix="/api/v1/dashboard"); @router.get("")
const DASHBOARD_SUMMARY_PATH = "/api/v1/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (!hasConfiguredApi()) {
    // TODO(TA-48/TA-49): Remove once every environment configures a real API.
    return Promise.resolve(dashboardFixture);
  }

  const raw = await authenticatedApiRequest<RawDashboardSummary>(
    DASHBOARD_SUMMARY_PATH,
  );

  return mapDashboardSummary(raw);
}
