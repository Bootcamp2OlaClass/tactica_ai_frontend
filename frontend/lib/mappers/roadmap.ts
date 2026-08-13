import type {
  Roadmap,
  RoadmapGenerationStatus,
  RoadmapItem,
  RoadmapItemOrigin,
  RoadmapItemType,
  RoadmapWeek,
} from "@/types/roadmap";

export interface RawRoadmapItem {
  id: number;
  week_id: number;
  item_type: RoadmapItemType;
  origin: RoadmapItemOrigin;
  title: string;
  description: string | null;
  task_id: number | null;
  course_id: number | null;
  due_date: string | null;
  is_user_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface RawRoadmapWeek {
  id: number;
  week_number: number;
  start_date: string;
  end_date: string;
  items: RawRoadmapItem[];
}

export interface RawRoadmap {
  id: number;
  semester_id: number;
  status: RoadmapGenerationStatus;
  version: number;
  generated_at: string | null;
  generation_error: string | null;
  recommendations_unavailable_reason: string | null;
  weeks: RawRoadmapWeek[];
}

export function mapRoadmapItem(raw: RawRoadmapItem): RoadmapItem {
  return {
    id: raw.id,
    weekId: raw.week_id,
    itemType: raw.item_type,
    origin: raw.origin,
    title: raw.title,
    description: raw.description,
    taskId: raw.task_id,
    courseId: raw.course_id,
    dueDate: raw.due_date,
    isUserEdited: raw.is_user_edited,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

function mapWeek(raw: RawRoadmapWeek): RoadmapWeek {
  return {
    id: raw.id,
    weekNumber: raw.week_number,
    startDate: raw.start_date,
    endDate: raw.end_date,
    items: raw.items.map(mapRoadmapItem),
  };
}

export function mapRoadmap(raw: RawRoadmap): Roadmap {
  return {
    id: raw.id,
    semesterId: raw.semester_id,
    status: raw.status,
    version: raw.version,
    generatedAt: raw.generated_at,
    generationError: raw.generation_error,
    recommendationsUnavailableReason: raw.recommendations_unavailable_reason,
    weeks: raw.weeks.map(mapWeek),
  };
}
