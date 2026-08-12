import { Badge } from "@/components/ui/Badge";
import { humanizeEnum } from "@/lib/format";
import type { TaskPriority, TaskStatus } from "@/types/task";

const STATUS_TONE: Record<TaskStatus, "blue" | "green" | "neutral" | "amber"> = {
  todo: "neutral",
  in_progress: "blue",
  completed: "green",
  cancelled: "amber",
};

const PRIORITY_TONE: Record<TaskPriority, "neutral" | "blue" | "amber" | "red"> = {
  low: "neutral",
  medium: "blue",
  high: "amber",
  urgent: "red",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{humanizeEnum(status)}</Badge>;
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{humanizeEnum(priority)}</Badge>;
}

export function OverdueBadge() {
  return <Badge tone="red">Overdue</Badge>;
}
