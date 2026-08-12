import type { DashboardSummary } from "@/types/dashboard";

// Dev-only mock used when NEXT_PUBLIC_API_BASE_URL isn't configured
// (see services/dashboard.service.ts). Never substituted for a real,
// failed API request — those surface an actual error state instead.
export const dashboardFixture: DashboardSummary = {
  currentSemester: {
    id: "1",
    name: "Fall 2026",
    status: "ACTIVE",
    startDate: "2026-08-24",
    endDate: "2026-12-18",
  },
  stats: {
    activeCourses: 4,
    incompleteTasks: 9,
    overdueTasks: 1,
    tasksDueWithinSevenDays: 3,
  },
  upcomingDeadlines: [
    { id: "1", courseId: "1", title: "Database project proposal", taskType: "project", priority: "high", status: "in_progress", dueAt: "2026-08-19T23:59:00.000Z" },
    { id: "2", courseId: "2", title: "Problem set 4", taskType: "assignment", priority: "medium", status: "todo", dueAt: "2026-08-20T23:59:00.000Z" },
    { id: "3", courseId: "3", title: "Reading response", taskType: "reading", priority: "low", status: "todo", dueAt: "2026-08-22T17:00:00.000Z" },
  ],
  recentDocuments: [
    { id: "1", courseId: "1", fileName: "syllabus.pdf", status: "COMPLETED", createdAt: "2026-08-08T08:00:00.000Z" },
  ],
};
