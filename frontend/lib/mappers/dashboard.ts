import type {
  DashboardDocument,
  DashboardSemester,
  DashboardStats,
  DashboardSummary,
  DashboardTask,
} from "@/types/dashboard";

// Raw shape returned by GET /api/v1/dashboard — matches
// app/schemas/dashboard.py's DashboardSummaryResponse field-for-field.
interface RawDashboardSemester {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
}

interface RawDashboardDeadline {
  id: number;
  course_id: number;
  title: string;
  task_type: string;
  status: string;
  priority: string;
  due_at: string;
}

interface RawDashboardDocument {
  id: number;
  course_id: number;
  file_name: string;
  status: string;
  created_at: string;
}

export interface RawDashboardSummary {
  current_semester: RawDashboardSemester | null;
  active_course_count: number;
  incomplete_task_count: number;
  overdue_task_count: number;
  tasks_due_within_seven_days_count: number;
  upcoming_deadlines: RawDashboardDeadline[];
  recent_documents: RawDashboardDocument[];
}

function mapSemester(
  semester: RawDashboardSemester,
): DashboardSemester {
  return {
    id: String(semester.id),
    name: semester.name,
    status: semester.status as DashboardSemester["status"],
    startDate: semester.start_date,
    endDate: semester.end_date,
  };
}

function mapDeadline(deadline: RawDashboardDeadline): DashboardTask {
  return {
    id: String(deadline.id),
    courseId: String(deadline.course_id),
    title: deadline.title,
    taskType: deadline.task_type,
    priority: deadline.priority as DashboardTask["priority"],
    status: deadline.status as DashboardTask["status"],
    dueAt: deadline.due_at,
  };
}

function mapDocument(document: RawDashboardDocument): DashboardDocument {
  return {
    id: String(document.id),
    courseId: String(document.course_id),
    fileName: document.file_name,
    status: document.status,
    createdAt: document.created_at,
  };
}

function mapStats(summary: RawDashboardSummary): DashboardStats {
  return {
    activeCourses: summary.active_course_count,
    incompleteTasks: summary.incomplete_task_count,
    overdueTasks: summary.overdue_task_count,
    tasksDueWithinSevenDays: summary.tasks_due_within_seven_days_count,
  };
}

export function mapDashboardSummary(
  summary: RawDashboardSummary,
): DashboardSummary {
  return {
    currentSemester: summary.current_semester
      ? mapSemester(summary.current_semester)
      : null,
    stats: mapStats(summary),
    upcomingDeadlines: summary.upcoming_deadlines.map(mapDeadline),
    recentDocuments: summary.recent_documents.map(mapDocument),
  };
}
