import type { TaskPriority } from "@/types/task";
import type { RecoveryPlan, RecoveryPlanItem, RecoveryUrgencyLabel } from "@/types/recoveryPlan";

export interface RawRecoveryPlanItem {
  task_id: number;
  title: string;
  course_id: number;
  due_at: string | null;
  is_overdue: boolean;
  urgency_label: RecoveryUrgencyLabel;
  cluster_size: number;
  estimated_effort_minutes: number;
  priority: TaskPriority;
  score: number;
  explanation: string | null;
}

export interface RawRecoveryPlan {
  generated_at: string;
  items: RawRecoveryPlanItem[];
  recommendations_unavailable_reason: string | null;
}

function mapItem(raw: RawRecoveryPlanItem): RecoveryPlanItem {
  return {
    taskId: raw.task_id,
    title: raw.title,
    courseId: raw.course_id,
    dueAt: raw.due_at,
    isOverdue: raw.is_overdue,
    urgencyLabel: raw.urgency_label,
    clusterSize: raw.cluster_size,
    estimatedEffortMinutes: raw.estimated_effort_minutes,
    priority: raw.priority,
    score: raw.score,
    explanation: raw.explanation,
  };
}

export function mapRecoveryPlan(raw: RawRecoveryPlan): RecoveryPlan {
  return {
    generatedAt: raw.generated_at,
    items: raw.items.map(mapItem),
    recommendationsUnavailableReason: raw.recommendations_unavailable_reason,
  };
}
