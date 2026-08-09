import type { DashboardExam } from "@/types/dashboard";
import { calendarDayDifference, formatDateTime } from "./dashboard-formatters";

export function UpcomingExams({ exams }: { exams: DashboardExam[] }) {
  return (
    <section className="rounded-2xl border border-[#dedee9] bg-white p-6" aria-labelledby="exams-heading">
      <h2 id="exams-heading" className="text-lg font-semibold tracking-[-0.025em]">Upcoming exams & quizzes</h2>
      {exams.length ? <ul className="mt-4 grid gap-3 sm:grid-cols-2">{exams.map((exam) => { const days = calendarDayDifference(exam.startsAt); return <li key={exam.id} className="rounded-xl bg-[#f6f4ff] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{exam.name}</p><p className="mt-1 text-xs text-[#696977]">{exam.courseCode} · {exam.courseName}</p></div><span className="shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#315bd8]">{days <= 0 ? "Today" : `${days} day${days === 1 ? "" : "s"}`}</span></div><time className="mt-4 block text-xs font-medium" dateTime={exam.startsAt}>{formatDateTime(exam.startsAt)}</time><p className="mt-1 text-xs text-[#696977]">{exam.location ?? "Location to be announced"}</p></li>; })}</ul> : <p className="mt-5 text-sm text-[#696977]">No upcoming exams or quizzes.</p>}
    </section>
  );
}
