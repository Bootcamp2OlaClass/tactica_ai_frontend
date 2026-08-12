export type SemesterStatus = "ACTIVE" | "UPCOMING" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface DashboardSemester {
  id: string;
  name: string;
  status: SemesterStatus;
  startDate: string;
  endDate: string;
}

// Not populated by the current dashboard API (no per-course aggregation
// exists on the backend yet). Kept so the dormant CourseOverviewGrid /
// CourseOverviewCard components keep compiling for reuse once Phase 01/12
// add real per-course progress data. See .claude/BACKLOG.md.
export interface DashboardCourse {
  id: string;
  code: string;
  name: string;
  instructor: string | null;
  progress: number;
  upcomingTaskCount: number;
  nextDeadline: string | null;
}

export interface DashboardTask {
  id: string;
  courseId: string;
  title: string;
  taskType: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueAt: string;
}

// Not populated by the current dashboard API (no exam collection exists on
// the backend yet). Kept for the dormant UpcomingExams component.
export interface DashboardExam {
  id: string;
  name: string;
  courseCode: string;
  courseName: string;
  startsAt: string;
  location: string | null;
}

export interface DashboardStats {
  activeCourses: number;
  incompleteTasks: number;
  overdueTasks: number;
  tasksDueWithinSevenDays: number;
}

export interface DashboardDocument {
  id: string;
  courseId: string;
  fileName: string;
  status: string;
  createdAt: string;
}

// Matches app/schemas/dashboard.py's DashboardSummaryResponse exactly.
// Do not add fields here that the backend doesn't return — see
// .claude/BUGS.md BUG-005 for why that caused this to break before.
export interface DashboardSummary {
  currentSemester: DashboardSemester | null;
  stats: DashboardStats;
  upcomingDeadlines: DashboardTask[];
  recentDocuments: DashboardDocument[];
}
