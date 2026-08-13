export type RoadmapGenerationStatus = "NOT_REQUESTED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
export type RoadmapItemType = "MILESTONE" | "ASSIGNMENT_PREPARATION" | "EXAM_PREPARATION" | "RECOMMENDATION";
export type RoadmapItemOrigin = "DETERMINISTIC" | "AI_GENERATED";

// Matches app/schemas/roadmap.py's RoadmapItemResponse exactly.
export interface RoadmapItem {
  id: number;
  weekId: number;
  itemType: RoadmapItemType;
  origin: RoadmapItemOrigin;
  title: string;
  description: string | null;
  taskId: number | null;
  courseId: number | null;
  dueDate: string | null;
  isUserEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapWeek {
  id: number;
  weekNumber: number;
  startDate: string;
  endDate: string;
  items: RoadmapItem[];
}

export interface Roadmap {
  id: number;
  semesterId: number;
  status: RoadmapGenerationStatus;
  version: number;
  generatedAt: string | null;
  generationError: string | null;
  recommendationsUnavailableReason: string | null;
  weeks: RoadmapWeek[];
}
