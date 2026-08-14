"use client";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { OverdueBadge, TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskBadges";
import { formatDateTime, humanizeEnum } from "@/lib/format";
import type { CalendarItem } from "@/lib/calendar/normalize";

export function CalendarEventDetails({
  item,
  isBusy,
  onClose,
  onEdit,
  onDelete,
  onComplete,
  onReopen,
}: {
  item: CalendarItem;
  isBusy: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
  onReopen: () => void;
}) {
  const { task } = item;
  const canComplete = task.status === "todo" || task.status === "in_progress";
  const canReopen = task.status === "completed" || task.status === "cancelled";

  return (
    <Modal title={item.title} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={item.status} />
          <TaskPriorityBadge priority={item.priority} />
          {task.isOverdue && <OverdueBadge />}
        </div>

        <dl className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.courseColor ?? "#92929e" }}
              aria-hidden="true"
            />
            <dt className="sr-only">Course</dt>
            <dd className="text-[#454550] dark:text-[#e5e5eb]">{item.courseName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 font-medium text-[#696977] dark:text-[#9797a6]">Due</dt>
            <dd className="text-[#454550] dark:text-[#e5e5eb]">{formatDateTime(item.start)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-20 shrink-0 font-medium text-[#696977] dark:text-[#9797a6]">Type</dt>
            <dd className="text-[#454550] dark:text-[#e5e5eb]">{humanizeEnum(item.type)}</dd>
          </div>
          {task.description && (
            <div className="flex gap-2">
              <dt className="w-20 shrink-0 font-medium text-[#696977] dark:text-[#9797a6]">Details</dt>
              <dd className="whitespace-pre-wrap text-[#454550] dark:text-[#e5e5eb]">{task.description}</dd>
            </div>
          )}
        </dl>

        <div className="flex flex-wrap justify-end gap-2 border-t border-[#eceaf5] pt-4 dark:border-[#2d2d38]">
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
    </Modal>
  );
}
