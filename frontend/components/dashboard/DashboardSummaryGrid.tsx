import { AlertTriangle, BookOpen, CalendarClock, ListTodo } from "lucide-react";

import type { DashboardStats } from "@/types/dashboard";
import { SummaryCard } from "./SummaryCard";

export function DashboardSummaryGrid({ stats }: { stats: DashboardStats }) {
  return (
    <section aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="sr-only">Academic summary</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Active courses"
          value={stats.activeCourses}
          description="This semester"
          icon={<BookOpen size={22} strokeWidth={1.8} aria-hidden="true" />}
        />
        <SummaryCard
          label="Open tasks"
          value={stats.incompleteTasks}
          description="Not yet completed"
          icon={<ListTodo size={22} strokeWidth={1.8} aria-hidden="true" />}
        />
        <SummaryCard
          label="Overdue tasks"
          value={stats.overdueTasks}
          description={stats.overdueTasks ? "Needs attention" : "All caught up"}
          icon={<AlertTriangle size={22} strokeWidth={1.8} aria-hidden="true" />}
        />
        <SummaryCard
          label="Due this week"
          value={stats.tasksDueWithinSevenDays}
          description="Next 7 days"
          icon={<CalendarClock size={22} strokeWidth={1.8} aria-hidden="true" />}
        />
      </div>
    </section>
  );
}
