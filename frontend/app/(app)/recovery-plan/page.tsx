"use client";

import { RecoveryPlanItemCard } from "@/components/recovery/RecoveryPlanItemCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { PageHeader } from "@/components/ui/PageHeader";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { useCourses } from "@/hooks/useCourses";
import { useRecoveryPlan } from "@/hooks/useRecoveryPlan";

export default function RecoveryPlanPage() {
  const plan = useRecoveryPlan();
  const courses = useCourses({ pageSize: 100 });

  const courseLabelById = new Map<number, string>();
  if (courses.status === "success") {
    for (const course of courses.data.items) {
      courseLabelById.set(course.id, `${course.courseCode} — ${course.name}`);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Recovery Plan"
        description="What to tackle first, prioritized from your real overdue tasks and upcoming deadlines."
      />

      {plan.status === "loading" && <ListSkeleton rows={4} />}
      {plan.status === "error" && <ErrorState message={plan.error ?? "Unable to load your recovery plan."} onRetry={plan.reload} />}

      {plan.status === "success" && plan.data.items.length === 0 && (
        <EmptyState
          title="You're all caught up"
          description="No overdue or upcoming tasks need attention right now."
        />
      )}

      {plan.status === "success" && plan.data.items.length > 0 && (
        <div>
          {plan.data.recommendationsUnavailableReason && (
            <div className="mb-6 rounded-xl border border-[#f0e4c8] bg-[#fdf8ec] px-4 py-3 text-sm text-[#7a5f1f]">
              Coach notes aren&apos;t included this time: {plan.data.recommendationsUnavailableReason}
            </div>
          )}

          <div className="space-y-3">
            {plan.data.items.map((item) => (
              <RecoveryPlanItemCard
                key={item.taskId}
                item={item}
                courseLabel={courseLabelById.get(item.courseId) ?? null}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
