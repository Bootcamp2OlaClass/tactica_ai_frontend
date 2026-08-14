import type { ReactNode } from "react";

export function SummaryCard({ label, value, description, icon }: { label: string; value: number; description?: string; icon?: ReactNode }) {
  return (
    <article className="rounded-2xl border border-[#dedee9] bg-white p-6 dark:border-[#2d2d38] dark:bg-[#1b1b23]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#696977] dark:text-[#9797a6]">{label}</p>
        {icon && <span className="text-2xl leading-none text-[#315bd8] dark:text-[#8aa4ff]" aria-hidden="true">{icon}</span>}
      </div>
      <p className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#17171c] dark:text-[#f2f2f5]">{value}</p>
      {description && <p className="mt-2 text-sm text-[#696977] dark:text-[#9797a6]">{description}</p>}
    </article>
  );
}
