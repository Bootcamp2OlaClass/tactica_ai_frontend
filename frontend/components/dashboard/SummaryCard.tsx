import type { ReactNode } from "react";

export function SummaryCard({ label, value, description, icon }: { label: string; value: number; description?: string; icon?: ReactNode }) {
  return (
    <article className="rounded-2xl border border-[#dedee9] bg-white p-5">
      <div className="flex items-center justify-between gap-3"><p className="text-xs font-medium text-[#696977]">{label}</p>{icon && <span className="text-[#315bd8]" aria-hidden="true">{icon}</span>}</div>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
      {description && <p className="mt-1 text-xs text-[#696977]">{description}</p>}
    </article>
  );
}
