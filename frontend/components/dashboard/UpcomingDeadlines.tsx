import type { DashboardTask } from "@/types/dashboard";
import { DeadlineItem } from "./DeadlineItem";

export function UpcomingDeadlines({ deadlines }: { deadlines: DashboardTask[] }) {
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
  return (
    <section className="rounded-2xl border border-[#dedee9] bg-white p-6 lg:col-span-7" aria-labelledby="deadlines-heading">
      <h2 id="deadlines-heading" className="text-lg font-semibold tracking-[-0.025em]">Upcoming deadlines</h2>
      {sortedDeadlines.length ? <ul className="mt-4 divide-y divide-[#dedee9]">{sortedDeadlines.map((task) => <DeadlineItem key={task.id} task={task} />)}</ul> : <p className="mt-5 text-sm text-[#696977]">You have no upcoming deadlines.</p>}
    </section>
  );
}
