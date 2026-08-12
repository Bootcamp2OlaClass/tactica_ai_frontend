export type SemesterStatus =
    | "UPCOMING"
    | "ACTIVE"
    | "COMPLETED"
    | "ARCHIVED";

export interface CurrentSemester {
    id: string;
    name: string;
    status: SemesterStatus;
    startDate: string;
    endDate: string;
    courseCount: number;
    progressPercentage?: number;
}