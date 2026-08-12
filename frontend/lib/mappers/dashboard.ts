import type {
    CourseSummaryApiResponse,
    CurrentSemesterApiResponse,
    DashboardSummaryApiResponse,
    DeadlineSummaryApiResponse,
    ExamSummaryApiResponse,
} from "@/types/api";

import type { CourseSummary } from "@/types/course";
import type { DashboardSummary } from "@/types/dashboard";
import type { CurrentSemester } from "@/types/semester";
import type { DeadlineSummary, ExamSummary } from "@/types/task";

function mapCurrentSemester(
    semester: CurrentSemesterApiResponse
): CurrentSemester {
    return {
        id: semester.id,
        name: semester.name,
        status: semester.status,
        startDate: semester.start_date,
        endDate: semester.end_date,
        courseCount: semester.course_count,
        progressPercentage: semester.progress_percentage,
    };
}

function mapCourse(course: CourseSummaryApiResponse): CourseSummary {
    return {
        id: course.id,
        courseCode: course.course_code,
        name: course.name,
        status: course.status,
        instructorName: course.instructor_name,
        color: course.color,
    };
}

function mapDeadline(
    deadline: DeadlineSummaryApiResponse
): DeadlineSummary {
    return {
        id: deadline.id,
        title: deadline.title,
        courseId: deadline.course_id,
        courseName: deadline.course_name,
        dueDate: deadline.due_date,
        status: deadline.status,
        priority: deadline.priority,
        taskType: deadline.task_type,
    };
}

function mapExam(exam: ExamSummaryApiResponse): ExamSummary {
    return {
        id: exam.id,
        title: exam.title,
        courseId: exam.course_id,
        courseName: exam.course_name,
        examDate: exam.exam_date,
    };
}

export function mapDashboardSummary(
    response: DashboardSummaryApiResponse
): DashboardSummary {
    return {
        currentSemester: response.current_semester
            ? mapCurrentSemester(response.current_semester)
            : null,
        activeCourseCount: response.active_course_count,
        upcomingDeadlineCount: response.upcoming_deadline_count,
        overdueTaskCount: response.overdue_task_count,
        completedTaskCount: response.completed_task_count,
        upcomingExamCount: response.upcoming_exam_count,
        courses: response.courses.map(mapCourse),
        upcomingDeadlines: response.upcoming_deadlines.map(mapDeadline),
        overdueTasks: response.overdue_tasks.map(mapDeadline),
        upcomingExams: response.upcoming_exams.map(mapExam),
    };
}