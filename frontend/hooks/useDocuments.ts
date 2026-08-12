"use client";

import { listCourseDocuments } from "@/services/document.service";

import { useAsyncData } from "./useAsyncData";

export function useCourseDocuments(courseId: number | null) {
  return useAsyncData(
    () => (courseId === null ? Promise.resolve({ items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 }) : listCourseDocuments(courseId)),
    [courseId],
  );
}
