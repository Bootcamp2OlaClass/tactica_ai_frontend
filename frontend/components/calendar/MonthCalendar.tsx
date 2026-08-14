"use client";

import type { CalendarItem } from "@/lib/calendar/normalize";
import { dateKey } from "@/lib/calendar/normalize";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_ITEMS_PER_DAY = 3;

function buildMonthGrid(currentMonth: Date): Date[] {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startOffset = firstOfMonth.getDay();
  const gridStart = new Date(year, month, 1 - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return date;
  });
}

export function MonthCalendar({
  currentMonth,
  itemsByDate,
  onSelectItem,
}: {
  currentMonth: Date;
  itemsByDate: Map<string, CalendarItem[]>;
  onSelectItem: (item: CalendarItem) => void;
}) {
  const days = buildMonthGrid(currentMonth);
  const todayKey = dateKey(new Date().toISOString());

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dedee9] bg-white dark:border-[#2d2d38] dark:bg-[#1b1b23]">
      <div className="grid grid-cols-7 border-b border-[#dedee9] bg-[#f6f4ff] text-xs font-semibold uppercase tracking-wide text-[#696977] dark:border-[#2d2d38] dark:bg-[#18181f] dark:text-[#9797a6]">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="px-2 py-2 text-center">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date) => {
          const key = dateKey(date.toISOString());
          const items = itemsByDate.get(key) ?? [];
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className={`min-h-[6.5rem] border-b border-r border-[#eceaf5] p-1.5 last:border-r-0 dark:border-[#26262f] sm:p-2 ${
                isCurrentMonth ? "bg-white dark:bg-[#1b1b23]" : "bg-[#fafafd] text-[#c3c3cf] dark:bg-[#18181f] dark:text-[#4a4a58]"
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  isToday
                    ? "bg-[#315bd8] text-white dark:bg-[#4d6fe0]"
                    : isCurrentMonth
                      ? "text-[#454550] dark:text-[#c7c7d1]"
                      : "text-[#c3c3cf] dark:text-[#4a4a58]"
                }`}
              >
                {date.getDate()}
              </span>

              <div className="mt-1 space-y-1">
                {items.slice(0, MAX_VISIBLE_ITEMS_PER_DAY).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item)}
                    className="flex w-full items-center gap-1.5 truncate rounded-lg px-1.5 py-1 text-left text-xs font-medium text-[#34343c] transition hover:bg-[#f6f4ff] dark:text-[#e5e5eb] dark:hover:bg-[#22222c]"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: item.courseColor ?? "#92929e" }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
                {items.length > MAX_VISIBLE_ITEMS_PER_DAY && (
                  <p className="px-1.5 text-xs text-[#92929e] dark:text-[#6f6f7d]">+{items.length - MAX_VISIBLE_ITEMS_PER_DAY} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
