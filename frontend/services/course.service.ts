import { authenticatedApiRequest, buildQueryString } from "@/lib/api/client";
import {
  mapCourse,
  mapCourseList,
  toCourseWritePayload,
  type RawCourse,
  type RawCourseListResponse,
} from "@/lib/mappers/course";
import type { Course, CourseFormValues, CourseListFilters, CourseListResult } from "@/types/course";

const BASE_PATH = "/api/v1/courses";

export async function listCourses(filters: CourseListFilters = {}): Promise<CourseListResult> {
  const query = buildQueryString({
    semester_id: filters.semesterId,
    status: filters.status,
    search: filters.search,
    page: filters.page,
    page_size: filters.pageSize,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
  });

  const raw = await authenticatedApiRequest<RawCourseListResponse>(`${BASE_PATH}${query}`);
  return mapCourseList(raw);
}

export async function listSemesterCourses(
  semesterId: number,
  filters: { page?: number; pageSize?: number } = {},
): Promise<CourseListResult> {
  const query = buildQueryString({ page: filters.page, page_size: filters.pageSize });
  const raw = await authenticatedApiRequest<RawCourseListResponse>(
    `/api/v1/semesters/${semesterId}/courses${query}`,
  );
  return mapCourseList(raw);
}

export async function getCourse(courseId: number): Promise<Course> {
  const raw = await authenticatedApiRequest<RawCourse>(`${BASE_PATH}/${courseId}`);
  return mapCourse(raw);
}

export async function createCourse(semesterId: number, values: CourseFormValues): Promise<Course> {
  const raw = await authenticatedApiRequest<RawCourse>(`/api/v1/semesters/${semesterId}/courses`, {
    method: "POST",
    json: toCourseWritePayload(values),
  });
  return mapCourse(raw);
}

export async function updateCourse(courseId: number, values: CourseFormValues): Promise<Course> {
  const raw = await authenticatedApiRequest<RawCourse>(`${BASE_PATH}/${courseId}`, {
    method: "PATCH",
    json: toCourseWritePayload(values),
  });
  return mapCourse(raw);
}

export async function deleteCourse(courseId: number): Promise<void> {
  await authenticatedApiRequest<void>(`${BASE_PATH}/${courseId}`, { method: "DELETE" });
}
