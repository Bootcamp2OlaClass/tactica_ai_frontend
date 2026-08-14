"use client";

import { TaskListItem } from "@/components/tasks/TaskListItem";
import type { Course } from "@/types/course";
import type { Task } from "@/types/task";
import { groupTasks } from "@/lib/tasks/group";

interface AgendaSidePanelProps {
  tasks: Task[];
  courseById: Map<number, Course>;
  busyTaskId: number | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (task: Task) => void;
  onReopen: (task: Task) => void;
}

export function AgendaSidePanel({ tasks, courseById, busyTaskId, onEdit, onDelete, onComplete, onReopen }: AgendaSidePanelProps) {
  const groups = groupTasks(tasks);
  const upcoming = groups.today.concat(groups.upcoming).filter((task) => task.dueAt !== null);
  const todo = groups.upcoming.filter((task) => task.dueAt === null);

  const sections: { key: string; label: string; items: Task[] }[] = [
    { key: "overdue", label: "Overdue", items: groups.overdue },
    { key: "upcoming", label: "Upcoming", items: upcoming },
    { key: "todo", label: "To-do (no due date)", items: todo },
  ];

  const hasAnything = sections.some((section) => section.items.length > 0);

  if (!hasAnything) {
    return <p className="text-sm text-[#696977] dark:text-[#9797a6]">Nothing on your plate right now.</p>;
  }

  return (
    <div className="space-y-6">
      {sections.map(
        (section) =>
          section.items.length > 0 && (
            <section key={section.key}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#92929e] dark:text-[#6f6f7d]">
                {section.label} ({section.items.length})
              </h3>
              <ul className="space-y-2">
                {section.items.map((task) => (
                  <li key={task.id}>
                    <TaskListItem
                      task={task}
                      course={courseById.get(task.courseId)}
                      isBusy={busyTaskId === task.id}
                      onEdit={() => onEdit(task)}
                      onDelete={() => onDelete(task)}
                      onComplete={() => onComplete(task)}
                      onReopen={() => onReopen(task)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ),
      )}
    </div>
  );
}
