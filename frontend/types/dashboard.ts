export type SemesterStatus = "ACTIVE" | "UPCOMING" | "COMPLETED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface DashboardSemester {
  id: string;
  name: string;
  status: SemesterStatus;
  startDate: string;
  endDate: string;
  courseCount: number;
  progress: number;
}

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
  title: string;
  courseCode: string;
  courseName: string;
  dueAt: string;
  type: string;
  priority: TaskPriority;
  status: TaskStatus;
}

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
  upcomingDeadlines: number;
  overdueTasks: number;
  completedTasks: number;
  upcomingExams: number;
}

export interface DashboardSummary {
  studentName: string;
  academicSummary: string;
  currentSemester: DashboardSemester | null;
  stats: DashboardStats;
  upcomingDeadlines: DashboardTask[];
  overdueTasks: DashboardTask[];
  courses: DashboardCourse[];
  upcomingExams: DashboardExam[];
}
