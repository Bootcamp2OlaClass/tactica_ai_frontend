import type { CourseStatus } from "@/types/course";
import type { SemesterStatus } from "@/types/semester";
import type {
    TaskPriority,
    TaskStatus,
    TaskType,
} from "@/types/task";

export interface CurrentSemesterApiResponse {
    id: string;
    name: string;
    status: SemesterStatus;
    start_date: string;
    end_date: string;
    course_count: number;
    progress_percentage?: number;
}

export interface CourseSummaryApiResponse {
    id: string;
    course_code: string;
    name: string;
    status: CourseStatus;
    instructor_name?: string;
    color?: string;
}

export interface DeadlineSummaryApiResponse {
    id: string;
    title: string;
    course_id: string;
    course_name?: string;
    due_date: string;
    status: TaskStatus;
    priority?: TaskPriority;
    task_type?: TaskType;
}

export interface ExamSummaryApiResponse {
    id: string;
    title: string;
    course_id: string;
    course_name?: string;
    exam_date: string;
}

export interface DashboardSummaryApiResponse {
    current_semester: CurrentSemesterApiResponse | null;
    active_course_count: number;
    upcoming_deadline_count: number;
    overdue_task_count: number;
    completed_task_count: number;
    upcoming_exam_count: number;
    courses: CourseSummaryApiResponse[];
    upcoming_deadlines: DeadlineSummaryApiResponse[];
    overdue_tasks: DeadlineSummaryApiResponse[];
    upcoming_exams: ExamSummaryApiResponse[];
}