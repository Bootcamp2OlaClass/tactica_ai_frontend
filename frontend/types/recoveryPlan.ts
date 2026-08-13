import type { TaskPriority } from "@/types/task";

export type RecoveryUrgencyLabel = "overdue" | "due_soon" | "due_this_week" | "later";

// Matches app/schemas/recovery_plan.py's RecoveryPlanItemResponse exactly.
export interface RecoveryPlanItem {
  taskId: number;
  title: string;
  courseId: number;
  dueAt: string | null;
  isOverdue: boolean;
  urgencyLabel: RecoveryUrgencyLabel;
  clusterSize: number;
  estimatedEffortMinutes: number;
  priority: TaskPriority;
  score: number;
  explanation: string | null;
}

export interface RecoveryPlan {
  generatedAt: string;
  items: RecoveryPlanItem[];
  recommendationsUnavailableReason: string | null;
}
