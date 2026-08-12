import type { DashboardStats } from "@/types/dashboard";
import { SummaryCard } from "./SummaryCard";

export function DashboardSummaryGrid({ stats }: { stats: DashboardStats }) {
  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">Academic summary</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Active courses" value={stats.activeCourses} description="This semester" icon="▤" />
        <SummaryCard label="Upcoming deadlines" value={stats.upcomingDeadlines} description="Next 14 days" icon="◷" />
        <SummaryCard label="Overdue tasks" value={stats.overdueTasks} description={stats.overdueTasks ? "Needs attention" : "All caught up"} icon="!" />
        <SummaryCard label="Completed tasks" value={stats.completedTasks} description="This semester" icon="✓" />
        <SummaryCard label="Upcoming exams" value={stats.upcomingExams} description="Next 30 days" icon="◇" />
      </div>
    </section>
  );
}
