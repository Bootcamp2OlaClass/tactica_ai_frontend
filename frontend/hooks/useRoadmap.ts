"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError, getApiErrorMessage } from "@/lib/api/client";
import { generateSemesterRoadmap, getSemesterRoadmap, updateRoadmapItem } from "@/services/roadmap.service";
import type { Roadmap } from "@/types/roadmap";

const POLL_INTERVAL_MS = 2000;
const IN_FLIGHT_STATUSES = new Set(["QUEUED", "PROCESSING"]);

export type RoadmapLoadStatus = "loading" | "success" | "error" | "not_generated";

export function useRoadmap(semesterId: number | null) {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [status, setStatus] = useState<RoadmapLoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const applyResult = useCallback((data: Roadmap) => {
    setRoadmap(data);
    setStatus("success");
    setError(null);
  }, []);

  const applyError = useCallback((err: unknown) => {
    if (err instanceof ApiError && err.status === 404) {
      setRoadmap(null);
      setStatus("not_generated");
      setError(null);
      return;
    }
    setError(getApiErrorMessage(err, "Unable to load the roadmap."));
    setStatus("error");
  }, []);

  // Initial load -- .then()/.catch() chained inline (not an async
  // function called from the effect) so state updates are always a
  // genuinely deferred reaction to the fetch settling, matching
  // hooks/useAsyncData.ts's own pattern.
  useEffect(() => {
    if (semesterId === null) return;
    let isCurrent = true;

    getSemesterRoadmap(semesterId)
      .then((data) => {
        if (isCurrent) applyResult(data);
      })
      .catch((err: unknown) => {
        if (isCurrent) applyError(err);
      });

    return () => {
      isCurrent = false;
    };
  }, [semesterId, applyResult, applyError]);

  // Roadmap generation runs as a background job (Phase 04 Celery
  // foundation) -- while QUEUED/PROCESSING, poll until it settles into
  // COMPLETED or FAILED rather than making the user manually refresh.
  useEffect(() => {
    if (semesterId === null || !roadmap || !IN_FLIGHT_STATUSES.has(roadmap.status)) return;

    const interval = setInterval(() => {
      getSemesterRoadmap(semesterId).then(applyResult).catch(applyError);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [roadmap, semesterId, applyResult, applyError]);

  const reload = useCallback(() => {
    if (semesterId === null) return;
    getSemesterRoadmap(semesterId).then(applyResult).catch(applyError);
  }, [semesterId, applyResult, applyError]);

  const generate = useCallback(() => {
    if (semesterId === null) return;
    setIsGenerating(true);
    setError(null);
    generateSemesterRoadmap(semesterId)
      .then((data) => {
        setRoadmap(data);
        setStatus("success");
      })
      .catch((err: unknown) => {
        setError(getApiErrorMessage(err, "Unable to start roadmap generation."));
      })
      .finally(() => {
        setIsGenerating(false);
      });
  }, [semesterId]);

  const editItem = useCallback(
    (itemId: number, values: { title?: string; description?: string }) =>
      updateRoadmapItem(itemId, values).then((updated) => {
        setRoadmap((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            weeks: prev.weeks.map((week) =>
              week.id === updated.weekId
                ? { ...week, items: week.items.map((item) => (item.id === updated.id ? updated : item)) }
                : week,
            ),
          };
        });
      }),
    [],
  );

  return { roadmap, status, error, isGenerating, generate, editItem, reload };
}
