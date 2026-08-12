export type CourseStatus = "ACTIVE" | "COMPLETED" | "DROPPED" | "ARCHIVED";

// Matches app/schemas/course.py's CourseResponse exactly.
export interface Course {
  id: number;
  semesterId: number;
  courseCode: string;
  name: string;
  instructorName: string | null;
  credits: number;
  classroom: string | null;
  color: string | null;
  description: string | null;
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CourseListResult {
  items: Course[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface CourseFormValues {
  courseCode: string;
  name: string;
  instructorName: string;
  credits: number;
  classroom: string;
  color: string;
  description: string;
  status: CourseStatus;
}

export interface CourseListFilters {
  semesterId?: number;
  status?: CourseStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "course_code" | "name" | "status" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
}
