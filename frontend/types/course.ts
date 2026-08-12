export type CourseStatus =
    | "ACTIVE"
    | "COMPLETED"
    | "DROPPED"
    | "ARCHIVED";

export interface CourseSummary {
    id: string;
    courseCode: string;
    name: string;
    status: CourseStatus;
    instructorName?: string;
    color?: string;
}