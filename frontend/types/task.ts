export type TaskType = "assignment" | "exam" | "quiz" | "reading" | "project" | "presentation" | "other";
export type TaskStatus = "todo" | "in_progress" | "completed" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskSource = "manual" | "document_extraction" | "ai_generated";

// Matches app/schemas/task.py's TaskResponse exactly.
export interface Task {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  taskType: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string | null;
  estimatedMinutes: number | null;
  completedAt: string | null;
  source: TaskSource;
  sourceDocumentId: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export interface TaskListResult {
  items: Task[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface TaskFormValues {
  title: string;
  description: string;
  taskType: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueAt: string;
  estimatedMinutes: string;
}

export interface TaskListFilters {
  page?: number;
  pageSize?: number;
  courseId?: number;
  semesterId?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  taskType?: TaskType;
  overdue?: boolean;
  search?: string;
  sortBy?: "title" | "status" | "priority" | "task_type" | "due_at" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}
