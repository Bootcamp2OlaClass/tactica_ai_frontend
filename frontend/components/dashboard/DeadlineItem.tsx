import Link from "next/link";

import { humanizeEnum } from "@/lib/format";
import type { DashboardTask } from "@/types/dashboard";
import { formatDateTime, relativeDueDate } from "./dashboard-formatters";

const priorityStyles = {
  urgent: "bg-[#fff0ed] text-[#a83b29]",
  high: "bg-[#fff0ed] text-[#a83b29]",
  medium: "bg-[#fff7df] text-[#806019]",
  low: "bg-[#eef2ff] text-[#315bd8]",
};

export function DeadlineItem({ task }: { task: DashboardTask }) {
  return (
    <li className="flex flex-col gap-3 py-4 first:pt-1 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/tasks?courseId=${task.courseId}`} className="truncate rounded text-sm font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]">{task.title}</Link>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityStyles[task.priority]}`}>{humanizeEnum(task.priority)}</span>
          <span className="rounded-full border border-[#dedee9] px-2 py-0.5 text-[10px] font-semibold text-[#696977]">{humanizeEnum(task.status)}</span>
        </div>
        <p className="mt-1 text-xs text-[#696977]">Course #{task.courseId} · {humanizeEnum(task.taskType)}</p>
      </div>
      <div className="shrink-0 sm:text-right"><p className="text-xs font-semibold text-[#315bd8]">{relativeDueDate(task.dueAt)}</p><time className="mt-1 block text-xs text-[#696977]" dateTime={task.dueAt}>{formatDateTime(task.dueAt)}</time></div>
    </li>
  );
}
