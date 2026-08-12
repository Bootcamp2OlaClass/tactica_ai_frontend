import type { CourseSummary } from "@/types/course";
import type { CurrentSemester } from "@/types/semester";
import type { DeadlineSummary, ExamSummary } from "@/types/task";

export interface DashboardSummary {
    currentSemester: CurrentSemester | null;
    activeCourseCount: number;
    upcomingDeadlineCount: number;
    overdueTaskCount: number;
    completedTaskCount: number;
    upcomingExamCount: number;
    courses: CourseSummary[];
    upcomingDeadlines: DeadlineSummary[];
    overdueTasks: DeadlineSummary[];
    upcomingExams: ExamSummary[];
}