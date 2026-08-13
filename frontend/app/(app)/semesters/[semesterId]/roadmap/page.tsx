"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { RoadmapWeekSection } from "@/components/roadmap/RoadmapWeekSection";
import { useRoadmap } from "@/hooks/useRoadmap";

export default function SemesterRoadmapPage() {
  const params = useParams<{ semesterId: string }>();
  const semesterId = Number(params.semesterId);
  const { showToast } = useToast();

  const { roadmap, status, error, isGenerating, generate, editItem } = useRoadmap(semesterId);

  const totalItemCount = roadmap?.weeks.reduce((sum, week) => sum + week.items.length, 0) ?? 0;
  const isInFlight = roadmap?.status === "QUEUED" || roadmap?.status === "PROCESSING";

  async function handleSaveItem(itemId: number, values: { title?: string; description?: string }) {
    try {
      await editItem(itemId, values);
      showToast("Saved.", "success");
    } catch {
      showToast("Couldn't save that edit.", "error");
      throw new Error("save failed");
    }
  }

  function handleGenerate() {
    generate();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Semester Roadmap"
        description="A week-by-week plan grounded in your real courses, tasks, and deadlines."
        action={
          <Link href={`/semesters/${semesterId}`} className="text-sm font-semibold text-[#315bd8] hover:underline">
            ← Back to semester
          </Link>
        }
      />

      {status === "loading" && <ListSkeleton rows={4} />}

      {status === "error" && <ErrorState message={error ?? "Unable to load the roadmap."} />}

      {status === "not_generated" && (
        <EmptyState
          title="No roadmap yet"
          description="Generate a roadmap from your courses, tasks, and deadlines for this semester."
          action={
            <Button type="button" onClick={handleGenerate} isLoading={isGenerating}>
              Generate roadmap
            </Button>
          }
        />
      )}

      {status === "success" && roadmap && (
        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dedee9] bg-white px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Badge tone={roadmap.status === "FAILED" ? "red" : isInFlight ? "amber" : "green"}>
                {isInFlight ? "Generating…" : roadmap.status === "FAILED" ? "Generation failed" : `v${roadmap.version}`}
              </Badge>
              {roadmap.generatedAt && !isInFlight && (
                <span className="text-[#92929e]">Last generated {new Date(roadmap.generatedAt).toLocaleString()}</span>
              )}
            </div>
            <Button type="button" variant="secondary" onClick={handleGenerate} isLoading={isGenerating} disabled={isInFlight}>
              Regenerate
            </Button>
          </div>

          {roadmap.status === "FAILED" && roadmap.generationError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {roadmap.generationError}
            </div>
          )}

          {roadmap.recommendationsUnavailableReason && (
            <div className="mb-6 rounded-xl border border-[#f0e4c8] bg-[#fdf8ec] px-4 py-3 text-sm text-[#7a5f1f]">
              AI recommendations aren&apos;t included this time: {roadmap.recommendationsUnavailableReason}
            </div>
          )}

          {isInFlight && <ListSkeleton rows={3} />}

          {!isInFlight && totalItemCount === 0 && (
            <EmptyState
              title="Nothing to plan yet"
              description="This semester has no upcoming deadlines on file, so there's nothing to build a roadmap from. Add courses and tasks, then regenerate."
            />
          )}

          {!isInFlight && totalItemCount > 0 && (
            <div className="space-y-8">
              {roadmap.weeks.map((week) => (
                <RoadmapWeekSection key={week.id} week={week} onSaveItem={handleSaveItem} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
