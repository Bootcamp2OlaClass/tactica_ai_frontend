import type { DashboardSummary } from "@/types/dashboard";

// TODO(TA-48/TA-49): Remove this fixture once the Academic Dashboard API is available.
export const dashboardFixture: DashboardSummary = {
  studentName: "Alex",
  academicSummary: "You have three deadlines and one exam coming up in the next two weeks.",
  currentSemester: {
    id: "fall-2026",
    name: "Fall 2026",
    status: "ACTIVE",
    startDate: "2026-08-24T00:00:00.000Z",
    endDate: "2026-12-18T00:00:00.000Z",
    courseCount: 4,
    progress: 42,
  },
  stats: { activeCourses: 4, upcomingDeadlines: 3, overdueTasks: 1, completedTasks: 18, upcomingExams: 2 },
  upcomingDeadlines: [
    { id: "task-1", title: "Database project proposal", courseCode: "CS 340", courseName: "Database Systems", dueAt: "2026-08-10T23:59:00.000Z", type: "Project", priority: "HIGH", status: "IN_PROGRESS" },
    { id: "task-2", title: "Problem set 4", courseCode: "MATH 221", courseName: "Linear Algebra", dueAt: "2026-08-12T23:59:00.000Z", type: "Assignment", priority: "MEDIUM", status: "TODO" },
    { id: "task-3", title: "Reading response", courseCode: "ENG 210", courseName: "Technical Writing", dueAt: "2026-08-16T17:00:00.000Z", type: "Reading", priority: "LOW", status: "TODO" },
  ],
  overdueTasks: [
    { id: "task-4", title: "Algorithm analysis worksheet", courseCode: "CS 301", courseName: "Algorithms", dueAt: "2026-08-06T23:59:00.000Z", type: "Assignment", priority: "HIGH", status: "IN_PROGRESS" },
  ],
  courses: [
    { id: "cs-301", code: "CS 301", name: "Algorithms", instructor: "Dr. Maya Chen", progress: 58, upcomingTaskCount: 2, nextDeadline: "2026-08-18T23:59:00.000Z" },
    { id: "cs-340", code: "CS 340", name: "Database Systems", instructor: "Prof. Daniel Park", progress: 46, upcomingTaskCount: 3, nextDeadline: "2026-08-10T23:59:00.000Z" },
    { id: "math-221", code: "MATH 221", name: "Linear Algebra", instructor: "Dr. Sofia Patel", progress: 39, upcomingTaskCount: 1, nextDeadline: "2026-08-12T23:59:00.000Z" },
    { id: "eng-210", code: "ENG 210", name: "Technical Writing", instructor: "Jordan Lee", progress: 62, upcomingTaskCount: 1, nextDeadline: "2026-08-16T17:00:00.000Z" },
  ],
  // TODO(TA-49): Replace exam fixture data with the dashboard API exam collection.
  upcomingExams: [
    { id: "exam-1", name: "Normalization quiz", courseCode: "CS 340", courseName: "Database Systems", startsAt: "2026-08-15T09:00:00.000Z", location: "Engineering 204" },
    { id: "exam-2", name: "Matrix methods midterm", courseCode: "MATH 221", courseName: "Linear Algebra", startsAt: "2026-08-22T13:30:00.000Z", location: null },
  ],
};
