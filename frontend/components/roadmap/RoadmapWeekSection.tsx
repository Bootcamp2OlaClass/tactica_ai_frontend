import { formatDate } from "@/lib/format";
import type { RoadmapWeek } from "@/types/roadmap";

import { RoadmapItemCard } from "./RoadmapItemCard";

export function RoadmapWeekSection({
  week,
  onSaveItem,
}: {
  week: RoadmapWeek;
  onSaveItem: (itemId: number, values: { title?: string; description?: string }) => Promise<void>;
}) {
  return (
    <section aria-label={`Week ${week.weekNumber}`}>
      <h3 className="text-sm font-semibold text-[#17171c]">
        Week {week.weekNumber}
        <span className="ml-2 font-normal text-[#92929e]">
          {formatDate(week.startDate)} – {formatDate(week.endDate)}
        </span>
      </h3>

      {week.items.length === 0 ? (
        <p className="mt-2 text-sm text-[#92929e]">Nothing scheduled this week.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {week.items.map((item) => (
            <RoadmapItemCard key={item.id} item={item} onSave={onSaveItem} />
          ))}
        </div>
      )}
    </section>
  );
}
