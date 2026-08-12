import type {
  Task,
  TaskFormValues,
  TaskListResult,
  TaskPriority,
  TaskSource,
  TaskStatus,
  TaskType,
} from "@/types/task";

export interface RawTask {
  id: number;
  course_id: number;
  title: string;
  description: string | null;
  task_type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  due_at: string | null;
  estimated_minutes: number | null;
  completed_at: string | null;
  source: TaskSource;
  source_document_id: number | null;
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_overdue: boolean;
}

export interface RawTaskListResponse {
  items: RawTask[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export function mapTask(raw: RawTask): Task {
  return {
    id: raw.id,
    courseId: raw.course_id,
    title: raw.title,
    description: raw.description,
    taskType: raw.task_type,
    status: raw.status,
    priority: raw.priority,
    dueAt: raw.due_at,
    estimatedMinutes: raw.estimated_minutes,
    completedAt: raw.completed_at,
    source: raw.source,
    sourceDocumentId: raw.source_document_id,
    isDeleted: raw.is_deleted,
    deletedAt: raw.deleted_at,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    isOverdue: raw.is_overdue,
  };
}

export function mapTaskList(raw: RawTaskListResponse): TaskListResult {
  return {
    items: raw.items.map(mapTask),
    page: raw.page,
    pageSize: raw.page_size,
    total: raw.total,
    totalPages: raw.total_pages,
  };
}

export function toTaskWritePayload(values: TaskFormValues) {
  return {
    title: values.title,
    description: values.description.trim() ? values.description : null,
    task_type: values.taskType,
    status: values.status,
    priority: values.priority,
    due_at: values.dueAt ? new Date(values.dueAt).toISOString() : null,
    estimated_minutes: values.estimatedMinutes.trim() ? Number(values.estimatedMinutes) : null,
  };
}
