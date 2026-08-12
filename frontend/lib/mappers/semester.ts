import type { Semester, SemesterFormValues, SemesterListResult, SemesterStatus } from "@/types/semester";

export interface RawSemester {
  id: number;
  user_id: number;
  name: string;
  academic_year: number;
  start_date: string;
  end_date: string;
  status: SemesterStatus;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RawSemesterListResponse {
  items: RawSemester[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export function mapSemester(raw: RawSemester): Semester {
  return {
    id: raw.id,
    userId: raw.user_id,
    name: raw.name,
    academicYear: raw.academic_year,
    startDate: raw.start_date,
    endDate: raw.end_date,
    status: raw.status,
    description: raw.description,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapSemesterList(raw: RawSemesterListResponse): SemesterListResult {
  return {
    items: raw.items.map(mapSemester),
    page: raw.page,
    pageSize: raw.page_size,
    total: raw.total,
    totalPages: raw.total_pages,
  };
}

export function toSemesterCreatePayload(values: SemesterFormValues) {
  return {
    name: values.name,
    academic_year: values.academicYear,
    start_date: values.startDate,
    end_date: values.endDate,
    status: values.status,
    description: values.description.trim() ? values.description : null,
  };
}

export const toSemesterUpdatePayload = toSemesterCreatePayload;
