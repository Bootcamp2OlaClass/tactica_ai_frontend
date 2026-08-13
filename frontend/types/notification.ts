export type NotificationType =
  | "ASSIGNMENT_DUE"
  | "EXAM_COUNTDOWN"
  | "WEEKLY_PLAN"
  | "OVERDUE_TASK"
  | "RECOVERY_PLAN";

export type NotificationPreferences = Record<NotificationType, boolean>;
