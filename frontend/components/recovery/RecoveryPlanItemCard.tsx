import { Badge } from "@/components/ui/Badge";
import { TaskPriorityBadge } from "@/components/tasks/TaskBadges";
import { formatDateTime } from "@/lib/format";
import type { RecoveryPlanItem, RecoveryUrgencyLabel } from "@/types/recoveryPlan";

const URGENCY_LABELS: Record<RecoveryUrgencyLabel, string> = {
  overdue: "Overdue",
  due_soon: "Due soon",
  due_this_week: "Due this week",
  later: "Later",
};

const URGENCY_TONE: Record<RecoveryUrgencyLabel, "red" | "amber" | "blue" | "neutral"> = {
  overdue: "red",
  due_soon: "amber",
  due_this_week: "blue",
  later: "neutral",
};

export function RecoveryPlanItemCard({ item, courseLabel }: { item: RecoveryPlanItem; courseLabel: string | null }) {
  return (
    <div className="rounded-xl border border-[#dedee9] bg-white p-4 dark:border-[#2d2d38] dark:bg-[#1b1b23]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={URGENCY_TONE[item.urgencyLabel]}>{URGENCY_LABELS[item.urgencyLabel]}</Badge>
        <TaskPriorityBadge priority={item.priority} />
        {item.clusterSize > 0 && (
          <Badge tone="purple">Clusters with {item.clusterSize} other deadline{item.clusterSize === 1 ? "" : "s"}</Badge>
        )}
      </div>

      <p className="mt-2 text-sm font-medium text-[#17171c] dark:text-[#f2f2f5]">{item.title}</p>
      <p className="mt-1 text-xs text-[#696977] dark:text-[#9797a6]">
        {courseLabel && <span>{courseLabel} · </span>}
        {item.dueAt ? `Due ${formatDateTime(item.dueAt)}` : "No due date"} · ~{item.estimatedEffortMinutes} min
      </p>

      {item.explanation && (
        <div className="mt-3 rounded-lg bg-[#f6f4ff] px-3 py-2 dark:bg-[#18181f]">
          <span className="text-xs font-semibold text-[#315bd8] dark:text-[#8aa4ff]">Coach note: </span>
          <span className="text-sm text-[#454550] dark:text-[#c7c7d1]">{item.explanation}</span>
        </div>
      )}
    </div>
  );
}
