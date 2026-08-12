"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { CurrentSemesterCard } from "@/components/dashboard/CurrentSemesterCard";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { DashboardSummaryGrid } from "@/components/dashboard/DashboardSummaryGrid";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { ErrorState } from "@/components/ui/ErrorState";
import { getApiErrorMessage } from "@/lib/api/client";
import { getDashboardSummary } from "@/services/dashboard.service";
import type { DashboardSummary } from "@/types/dashboard";

const todayFormatter = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function AcademicSnapshot({ summary }: { summary: DashboardSummary }) {
  return (
    <aside className="rounded-2xl border border-[#dedee9] bg-white p-6 lg:col-span-5" aria-labelledby="snapshot-heading">
      <div className="flex items-center gap-3"><Image src="/penguin/penguin-advisor.png" alt="" width={48} height={48} className="object-contain" /><div><p className="text-xs font-semibold text-[#315bd8]">Penguin Advisor</p><h2 id="snapshot-heading" className="mt-0.5 font-semibold">Academic snapshot</h2></div></div>
      <p className="mt-5 text-sm leading-6 text-[#454550]">
        You have {summary.stats.incompleteTasks} open task{summary.stats.incompleteTasks === 1 ? "" : "s"},{" "}
        {summary.stats.overdueTasks > 0
          ? `${summary.stats.overdueTasks} overdue`
          : "none overdue"}
        , and {summary.stats.tasksDueWithinSevenDays} due in the next 7 days.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Link href="/semesters" className="rounded-lg border border-[#cfd2e3] px-3 py-1.5 text-xs font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]">Manage semesters</Link>
        <Link href="/courses" className="rounded-lg border border-[#cfd2e3] px-3 py-1.5 text-xs font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]">Manage courses</Link>
        <Link href="/tasks" className="rounded-lg border border-[#cfd2e3] px-3 py-1.5 text-xs font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]">View tasks</Link>
        <Link href="/documents" className="rounded-lg border border-[#cfd2e3] px-3 py-1.5 text-xs font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]">Documents</Link>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setSummary(await getDashboardSummary());
    } catch (requestError) {
      setSummary(null);
      setError(getApiErrorMessage(requestError, "Unable to load your dashboard."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCurrent = true;
    getDashboardSummary().then((data) => { if (isCurrent) setSummary(data); }).catch((requestError: unknown) => {
      if (!isCurrent) return;
      setError(getApiErrorMessage(requestError, "Unable to load your dashboard."));
    }).finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, []);

  const retry = () => { setIsLoading(true); setError(null); void loadDashboard(); };

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-[#315bd8]">Tactica AI</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{summary ? `${greeting()}!` : "Academic dashboard"}</h1><p className="mt-2 text-sm leading-6 text-[#696977]">Here is what is happening in your semester today.</p></div>
        <time className="text-sm font-medium text-[#696977]" dateTime={new Date().toISOString()}>{todayFormatter.format(new Date())}</time>
      </header>

      {isLoading && <DashboardSkeleton />}
      {!isLoading && error && <ErrorState message={error} onRetry={retry} />}
      {!isLoading && !error && summary && (
        <div className="space-y-8">
          <div className="grid gap-5 lg:grid-cols-12"><CurrentSemesterCard semester={summary.currentSemester} /><AcademicSnapshot summary={summary} /></div>
          <DashboardSummaryGrid stats={summary.stats} />
          <UpcomingDeadlines deadlines={summary.upcomingDeadlines} />
        </div>
      )}
    </div>
  );
}
