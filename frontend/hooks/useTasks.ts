"use client";

import { listTasks } from "@/services/task.service";
import type { TaskListFilters } from "@/types/task";

import { useAsyncData } from "./useAsyncData";

export function useTasks(filters: TaskListFilters = {}) {
  return useAsyncData(() => listTasks(filters), [JSON.stringify(filters)]);
}
