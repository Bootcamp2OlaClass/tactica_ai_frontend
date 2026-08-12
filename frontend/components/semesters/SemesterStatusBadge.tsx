import { Badge } from "@/components/ui/Badge";
import type { SemesterStatus } from "@/types/semester";

const TONE: Record<SemesterStatus, "blue" | "neutral" | "green" | "purple"> = {
  ACTIVE: "blue",
  UPCOMING: "green",
  COMPLETED: "neutral",
  ARCHIVED: "purple",
};

const LABEL: Record<SemesterStatus, string> = {
  ACTIVE: "Active",
  UPCOMING: "Upcoming",
  COMPLETED: "Completed",
  ARCHIVED: "Archived",
};

export function SemesterStatusBadge({ status }: { status: SemesterStatus }) {
  return <Badge tone={TONE[status]}>{LABEL[status]}</Badge>;
}
