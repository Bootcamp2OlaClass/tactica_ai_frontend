import type { Task } from "@/types/task";

export type TaskGroups = {
  overdue: Task[];
  today: Task[];
  upcoming: Task[];
  completed: Task[];
  cancelled: Task[];
};

export function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

/** Shared by /tasks and the Calendar agenda panel so "overdue" / "today" /
 * "upcoming" mean exactly the same thing in both places. */
export function groupTasks(items: Task[]): TaskGroups {
  const groups: TaskGroups = { overdue: [], today: [], upcoming: [], completed: [], cancelled: [] };

  for (const task of items) {
    if (task.status === "completed") groups.completed.push(task);
    else if (task.status === "cancelled") groups.cancelled.push(task);
    else if (task.isOverdue) groups.overdue.push(task);
    else if (task.dueAt && isToday(task.dueAt)) groups.today.push(task);
    else groups.upcoming.push(task);
  }

  return groups;
}
