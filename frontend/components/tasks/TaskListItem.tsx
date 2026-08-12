import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import type { Course } from "@/types/course";
import type { Task } from "@/types/task";

import { OverdueBadge, TaskPriorityBadge, TaskStatusBadge } from "./TaskBadges";

interface TaskListItemProps {
  task: Task;
  course?: Course;
  isBusy: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onReopen: () => void;
}

export function TaskListItem({ task, course, isBusy, onEdit, onDelete, onComplete, onReopen }: TaskListItemProps) {
  const canComplete = task.status === "todo" || task.status === "in_progress";
  const canReopen = task.status === "completed" || task.status === "cancelled";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-[#17171c]">{task.title}</h3>
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          {task.isOverdue && <OverdueBadge />}
        </div>
        <p className="mt-1 text-xs text-[#696977]">
          {course ? `${course.courseCode} — ${course.name}` : `Course #${task.courseId}`}
          {task.dueAt ? ` · Due ${formatDateTime(task.dueAt)}` : " · No due date"}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {canComplete && (
          <Button variant="secondary" onClick={onComplete} isLoading={isBusy}>
            Complete
          </Button>
        )}
        {canReopen && (
          <Button variant="secondary" onClick={onReopen} isLoading={isBusy}>
            Reopen
          </Button>
        )}
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
