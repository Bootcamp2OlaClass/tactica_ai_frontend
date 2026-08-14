import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDateTime } from "@/lib/format";
import { syncTaskToCalendar, unsyncTaskFromCalendar } from "@/services/calendar.service";
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

// Self-contained, like DocumentList's own delete/download actions --
// this component owns its own sync state locally rather than lifting it
// into the tasks page, since no other part of the page needs to know
// about it (Phase 12).
function CalendarSyncAction({ taskId }: { taskId: number }) {
  const { showToast } = useToast();
  const [isSynced, setIsSynced] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  async function handleSync() {
    setIsBusy(true);
    try {
      await syncTaskToCalendar(taskId);
      setIsSynced(true);
      showToast("Added to your Google Calendar.", "success");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to sync to your calendar."), "error");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUnsync() {
    setIsBusy(true);
    try {
      await unsyncTaskFromCalendar(taskId);
      setIsSynced(false);
      showToast("Removed from your Google Calendar.", "success");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to remove from your calendar."), "error");
    } finally {
      setIsBusy(false);
    }
  }

  if (isSynced) {
    return (
      <div className="flex items-center gap-1.5">
        <Badge tone="green">On calendar</Badge>
        <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={handleUnsync} isLoading={isBusy}>
          Remove
        </Button>
      </div>
    );
  }

  return (
    <Button variant="secondary" onClick={handleSync} isLoading={isBusy}>
      Add to calendar
    </Button>
  );
}

export function TaskListItem({ task, course, isBusy, onEdit, onDelete, onComplete, onReopen }: TaskListItemProps) {
  const canComplete = task.status === "todo" || task.status === "in_progress";
  const canReopen = task.status === "completed" || task.status === "cancelled";

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 dark:border-[#2d2d38] dark:bg-[#1b1b23] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-[#17171c] dark:text-[#f2f2f5]">{task.title}</h3>
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
          {task.isOverdue && <OverdueBadge />}
        </div>
        <p className="mt-1 text-xs text-[#696977] dark:text-[#9797a6]">
          {course ? `${course.courseCode} — ${course.name}` : `Course #${task.courseId}`}
          {task.dueAt ? ` · Due ${formatDateTime(task.dueAt)}` : " · No due date"}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {task.dueAt && <CalendarSyncAction taskId={task.id} />}
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
