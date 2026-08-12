import { authenticatedApiRequest, buildQueryString } from "@/lib/api/client";
import {
  mapSemester,
  mapSemesterList,
  toSemesterCreatePayload,
  toSemesterUpdatePayload,
  type RawSemester,
  type RawSemesterListResponse,
} from "@/lib/mappers/semester";
import type { Semester, SemesterFormValues, SemesterListFilters, SemesterListResult } from "@/types/semester";

const BASE_PATH = "/api/v1/semesters";

export async function listSemesters(filters: SemesterListFilters = {}): Promise<SemesterListResult> {
  const query = buildQueryString({
    page: filters.page,
    page_size: filters.pageSize,
    search: filters.search,
    status: filters.status,
    sort_by: filters.sortBy,
    sort_order: filters.sortOrder,
  });

  const raw = await authenticatedApiRequest<RawSemesterListResponse>(`${BASE_PATH}${query}`);
  return mapSemesterList(raw);
}

export async function getSemester(semesterId: number): Promise<Semester> {
  const raw = await authenticatedApiRequest<RawSemester>(`${BASE_PATH}/${semesterId}`);
  return mapSemester(raw);
}

export async function createSemester(values: SemesterFormValues): Promise<Semester> {
  const raw = await authenticatedApiRequest<RawSemester>(BASE_PATH, {
    method: "POST",
    json: toSemesterCreatePayload(values),
  });
  return mapSemester(raw);
}

export async function updateSemester(semesterId: number, values: SemesterFormValues): Promise<Semester> {
  const raw = await authenticatedApiRequest<RawSemester>(`${BASE_PATH}/${semesterId}`, {
    method: "PATCH",
    json: toSemesterUpdatePayload(values),
  });
  return mapSemester(raw);
}

export async function deleteSemester(semesterId: number): Promise<void> {
  await authenticatedApiRequest<void>(`${BASE_PATH}/${semesterId}`, { method: "DELETE" });
}
