export type TaskStatus =
    | "TODO"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";

export type TaskPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH"
    | "URGENT";

export type TaskType =
    | "ASSIGNMENT"
    | "EXAM"
    | "QUIZ"
    | "PROJECT"
    | "STUDY"
    | "OTHER";

export interface DeadlineSummary {
    id: string;
    title: string;
    courseId: string;
    courseName?: string;
    dueDate: string;
    status: TaskStatus;
    priority?: TaskPriority;
    taskType?: TaskType;
}

export interface ExamSummary {
    id: string;
    title: string;
    courseId: string;
    courseName?: string;
    examDate: string;
}