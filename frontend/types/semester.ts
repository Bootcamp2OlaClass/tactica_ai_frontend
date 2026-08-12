export type SemesterStatus = "UPCOMING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";

// Matches app/schemas/semester.py's SemesterResponse exactly.
export interface Semester {
  id: number;
  userId: number;
  name: string;
  academicYear: number;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SemesterListResult {
  items: Semester[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface SemesterFormValues {
  name: string;
  academicYear: number;
  startDate: string;
  endDate: string;
  status: SemesterStatus;
  description: string;
}

export interface SemesterListFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: SemesterStatus;
  sortBy?: "id" | "name" | "academic_year" | "start_date" | "end_date" | "status" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}
