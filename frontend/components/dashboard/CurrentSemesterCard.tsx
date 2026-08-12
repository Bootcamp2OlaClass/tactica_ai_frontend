import type { DashboardSemester } from "@/types/dashboard";
import { formatDate } from "./dashboard-formatters";

export function CurrentSemesterCard({ semester }: { semester: DashboardSemester | null }) {
  if (!semester) {
    return (
      <section className="rounded-2xl border border-dashed border-[#b9bdd1] bg-white p-6 lg:col-span-7">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#696977]">Current semester</p>
        <h2 className="mt-5 text-xl font-semibold">No current semester found.</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-[#696977]">Create or activate a semester to begin planning your academic work.</p>
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
        <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">{semester.name}</h2>
        <p className="mt-2 text-sm text-[#696977]">{formatDate(semester.startDate)} – {formatDate(semester.endDate)} · {semester.courseCount} courses</p>
        <div className="mt-8 flex items-center justify-between text-xs"><span className="font-medium">Semester progress</span><span className="font-semibold text-[#315bd8]">{semester.progress}% completed</span></div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef0f6]" role="progressbar" aria-label="Semester progress" aria-valuenow={semester.progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-[#315bd8]" style={{ width: `${Math.min(100, Math.max(0, semester.progress))}%` }} />
        </div>
      </div>
    </section>
  );
}
