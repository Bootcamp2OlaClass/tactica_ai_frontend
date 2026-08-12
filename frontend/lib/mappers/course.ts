import type { Course, CourseFormValues, CourseListResult, CourseStatus } from "@/types/course";

export interface RawCourse {
  id: number;
  semester_id: number;
  course_code: string;
  name: string;
  instructor_name: string | null;
  credits: number;
  classroom: string | null;
  color: string | null;
  description: string | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
}

export interface RawCourseListResponse {
  items: RawCourse[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export function mapCourse(raw: RawCourse): Course {
  return {
    id: raw.id,
    semesterId: raw.semester_id,
    courseCode: raw.course_code,
    name: raw.name,
    instructorName: raw.instructor_name,
    credits: raw.credits,
    classroom: raw.classroom,
    color: raw.color,
    description: raw.description,
    status: raw.status,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapCourseList(raw: RawCourseListResponse): CourseListResult {
  return {
    items: raw.items.map(mapCourse),
    page: raw.page,
    pageSize: raw.page_size,
    total: raw.total,
    totalPages: raw.total_pages,
  };
}

export function toCourseWritePayload(values: CourseFormValues) {
  return {
    course_code: values.courseCode,
    name: values.name,
    instructor_name: values.instructorName.trim() ? values.instructorName : null,
    credits: values.credits,
    classroom: values.classroom.trim() ? values.classroom : null,
    color: values.color.trim() ? values.color : null,
    description: values.description.trim() ? values.description : null,
    status: values.status,
  };
}
