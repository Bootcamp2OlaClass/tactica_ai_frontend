import { Badge } from "@/components/ui/Badge";
import { humanizeEnum } from "@/lib/format";
import type { DocumentType, ProcessingStatus } from "@/types/document";

const STATUS_TONE: Record<ProcessingStatus, "neutral" | "blue" | "green" | "red"> = {
  UPLOADED: "neutral",
  QUEUED: "blue",
  PROCESSING: "blue",
  COMPLETED: "green",
  FAILED: "red",
};

export function ProcessingStatusBadge({ status }: { status: ProcessingStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{humanizeEnum(status)}</Badge>;
}

export function DocumentTypeBadge({ type }: { type: DocumentType }) {
  return <Badge tone="purple">{humanizeEnum(type)}</Badge>;
}
