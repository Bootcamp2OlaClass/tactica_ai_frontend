import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#17171c] dark:text-[#f2f2f5] sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 text-sm leading-6 text-[#696977] dark:text-[#9797a6]">{description}</p>}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
