import Link from "next/link";

import type { DashboardSemester } from "@/types/dashboard";
import { formatDate } from "./dashboard-formatters";

export function CurrentSemesterCard({ semester }: { semester: DashboardSemester | null }) {
  if (!semester) {
    return (
      <section className="rounded-2xl border border-dashed border-[#b9bdd1] bg-white p-6 lg:col-span-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#696977]">Current semester</p>
        <h2 className="mt-5 text-xl font-semibold">No current semester found.</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-[#696977]">Create or activate a semester to begin planning your academic work.</p>
        <Link
          href="/semesters"
          className="mt-4 inline-block rounded-xl bg-[#315bd8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#284fc4]"
        >
          + New semester
        </Link>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#dedee9] bg-white p-6 lg:col-span-7">
      <div className="absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#dce4ff]" aria-hidden="true" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#315bd8]">Current semester</p>
          <span className="rounded-full bg-[#e9f7ee] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#217044]">{semester.status}</span>
        </div>
        <Link href={`/semesters/${semester.id}`} className="mt-5 block w-fit rounded text-3xl font-semibold tracking-[-0.04em] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]">
          {semester.name}
        </Link>
        <p className="mt-2 text-sm text-[#696977]">{formatDate(semester.startDate)} – {formatDate(semester.endDate)}</p>
      </div>
    </section>
  );
}
