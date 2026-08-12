import type { DashboardTask } from "@/types/dashboard";
import { formatDate, relativeDueDate } from "./dashboard-formatters";

export function OverdueTasks({ tasks }: { tasks: DashboardTask[] }) {
  return (
    <section className="rounded-2xl border border-[#ead3ce] bg-[#fffaf8] p-6 lg:col-span-5" aria-labelledby="overdue-heading">
      <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#c85a45] text-xs font-bold text-[#a83b29]" aria-hidden="true">!</span><h2 id="overdue-heading" className="text-lg font-semibold tracking-[-0.025em]">Overdue tasks</h2></div>
      {tasks.length ? (
        <ul className="mt-4 space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-xl border border-[#ead3ce] bg-white p-4">
              <div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{task.title}</p><p className="mt-1 text-xs text-[#696977]">Course #{task.courseId} · Due {formatDate(task.dueAt)}</p></div><span className="shrink-0 rounded-full bg-[#fff0ed] px-2 py-1 text-[10px] font-semibold text-[#a83b29]">{task.priority}</span></div>
              <p className="mt-3 text-xs font-semibold text-[#a83b29]">Past due · {relativeDueDate(task.dueAt)}</p>
            </li>
          ))}
        </ul>
      ) : <p className="mt-5 text-sm text-[#696977]">You are all caught up.</p>}
    </section>
  );
}
