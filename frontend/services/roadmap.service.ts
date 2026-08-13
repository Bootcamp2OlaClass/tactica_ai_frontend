import { authenticatedApiRequest } from "@/lib/api/client";
import { mapRoadmap, mapRoadmapItem, type RawRoadmap, type RawRoadmapItem } from "@/lib/mappers/roadmap";
import type { Roadmap, RoadmapItem } from "@/types/roadmap";

export async function getSemesterRoadmap(semesterId: number): Promise<Roadmap> {
  const raw = await authenticatedApiRequest<RawRoadmap>(
    `/api/v1/semesters/${semesterId}/roadmap`,
  );
  return mapRoadmap(raw);
}

export async function generateSemesterRoadmap(semesterId: number): Promise<Roadmap> {
  const raw = await authenticatedApiRequest<RawRoadmap>(
    `/api/v1/semesters/${semesterId}/roadmap/generate`,
    { method: "POST" },
  );
  return mapRoadmap(raw);
}

export async function updateRoadmapItem(
  itemId: number,
  values: { title?: string; description?: string },
): Promise<RoadmapItem> {
  const raw = await authenticatedApiRequest<RawRoadmapItem>(
    `/api/v1/roadmap-items/${itemId}`,
    { method: "PATCH", json: values },
  );
  return mapRoadmapItem(raw);
}
