"use client";

import { getCourse, listCourses, listSemesterCourses } from "@/services/course.service";
import type { CourseListFilters } from "@/types/course";

import { useAsyncData } from "./useAsyncData";

export function useCourses(filters: CourseListFilters = {}) {
  return useAsyncData(() => listCourses(filters), [JSON.stringify(filters)]);
}

export function useSemesterCourses(semesterId: number) {
  return useAsyncData(() => listSemesterCourses(semesterId), [semesterId]);
}

export function useCourse(courseId: number) {
  return useAsyncData(() => getCourse(courseId), [courseId]);
}
