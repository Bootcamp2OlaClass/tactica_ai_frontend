import { Badge } from "@/components/ui/Badge";
import type { CourseStatus } from "@/types/course";

const TONE: Record<CourseStatus, "blue" | "neutral" | "amber" | "purple"> = {
  ACTIVE: "blue",
  COMPLETED: "neutral",
  DROPPED: "amber",
  ARCHIVED: "purple",
};

const LABEL: Record<CourseStatus, string> = {
  ACTIVE: "Active",
  COMPLETED: "Completed",
  DROPPED: "Dropped",
  ARCHIVED: "Archived",
};

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return <Badge tone={TONE[status]}>{LABEL[status]}</Badge>;
}
