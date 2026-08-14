import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[#dedee9] bg-white px-6 py-14 text-center dark:border-[#3a3a48] dark:bg-[#1b1b23]">
      <h3 className="text-base font-semibold text-[#17171c] dark:text-[#f2f2f5]">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#696977] dark:text-[#9797a6]">{description}</p>}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
