import type { Course } from "@/types/course";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types/task";

/**
 * Unified academic-event shape for the Calendar UI. Tasks are the only
 * academic-event source in this codebase today (no separate Event/Exam
 * model -- an "exam" is a Task with taskType "exam"), so this is a thin
 * rendering-oriented adapter over Task, not a second data store: `task`
 * always points back at the real record so calendar actions (edit/
 * complete/delete) reuse the exact same task.service.ts calls the /tasks
 * page uses, instead of duplicating task logic.
 */
export interface CalendarItem {
  id: number;
  type: TaskType;
  title: string;
  start: string;
  courseId: number;
  courseName: string;
  courseColor: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  task: Task;
}

export function toCalendarItems(tasks: Task[], courseById: Map<number, Course>): CalendarItem[] {
  return tasks
    .filter((task): task is Task & { dueAt: string } => Boolean(task.dueAt))
    .map((task) => {
      const course = courseById.get(task.courseId);
      return {
        id: task.id,
        type: task.taskType,
        title: task.title,
        start: task.dueAt,
        courseId: task.courseId,
        courseName: course ? `${course.courseCode} — ${course.name}` : `Course #${task.courseId}`,
        courseColor: course?.color ?? null,
        status: task.status,
        priority: task.priority,
        task,
      };
    });
}

/** Local (not UTC) yyyy-mm-dd key so items land on the day a student sees
 * them on their own calendar, not the day the same instant falls on UTC. */
export function dateKey(iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function groupItemsByDate(items: CalendarItem[]): Map<string, CalendarItem[]> {
  const map = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const key = dateKey(item.start);
    const existing = map.get(key);
    if (existing) existing.push(item);
    else map.set(key, [item]);
  }
  return map;
}
