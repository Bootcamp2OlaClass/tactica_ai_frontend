import type { DashboardStats } from "@/types/dashboard";
import { SummaryCard } from "./SummaryCard";

export function DashboardSummaryGrid({ stats }: { stats: DashboardStats }) {
  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">Academic summary</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Active courses" value={stats.activeCourses} description="This semester" icon="▤" />
        <SummaryCard label="Open tasks" value={stats.incompleteTasks} description="Not yet completed" icon="◷" />
        <SummaryCard label="Overdue tasks" value={stats.overdueTasks} description={stats.overdueTasks ? "Needs attention" : "All caught up"} icon="!" />
        <SummaryCard label="Due this week" value={stats.tasksDueWithinSevenDays} description="Next 7 days" icon="◇" />
      </div>
    </section>
  );
}
