import { authenticatedApiRequest, buildQueryString } from "@/lib/api/client";
import { mapTask, mapTaskList, toTaskWritePayload, type RawTask, type RawTaskListResponse } from "@/lib/mappers/task";
import type { Task, TaskFormValues, TaskListFilters, TaskListResult } from "@/types/task";

const BASE_PATH = "/api/v1/tasks";

export async function listTasks(filters: TaskListFilters = {}): Promise<TaskListResult> {
  const query = buildQueryString({
    page: filters.page,
    page_size: filters.pageSize,
    course_id: filters.courseId,
    semester_id: filters.semesterId,
    status: filters.status,
    priority: filters.priority,
    task_type: filters.taskType,
    overdue: filters.overdue,
    search: filters.search,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
  });

  const raw = await authenticatedApiRequest<RawTaskListResponse>(`${BASE_PATH}${query}`);
  return mapTaskList(raw);
}

export async function getTask(taskId: number): Promise<Task> {
  const raw = await authenticatedApiRequest<RawTask>(`${BASE_PATH}/${taskId}`);
  return mapTask(raw);
}

export async function createTask(courseId: number, values: TaskFormValues): Promise<Task> {
  const raw = await authenticatedApiRequest<RawTask>(`/api/v1/courses/${courseId}/tasks`, {
    method: "POST",
    json: toTaskWritePayload(values),
  });
  return mapTask(raw);
}

export async function updateTask(taskId: number, values: TaskFormValues): Promise<Task> {
  const raw = await authenticatedApiRequest<RawTask>(`${BASE_PATH}/${taskId}`, {
    method: "PATCH",
    json: toTaskWritePayload(values),
  });
  return mapTask(raw);
}

export async function completeTask(taskId: number): Promise<Task> {
  const raw = await authenticatedApiRequest<RawTask>(`${BASE_PATH}/${taskId}/complete`, { method: "POST" });
  return mapTask(raw);
}

export async function reopenTask(taskId: number): Promise<Task> {
  const raw = await authenticatedApiRequest<RawTask>(`${BASE_PATH}/${taskId}/reopen`, { method: "POST" });
  return mapTask(raw);
}

export async function deleteTask(taskId: number): Promise<void> {
  await authenticatedApiRequest<void>(`${BASE_PATH}/${taskId}`, { method: "DELETE" });
}
