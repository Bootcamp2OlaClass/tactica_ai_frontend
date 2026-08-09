import type { DashboardCourse } from "@/types/dashboard";
import { formatDate } from "./dashboard-formatters";

export function CourseOverviewCard({ course }: { course: DashboardCourse }) {
  return (
    <article className="rounded-2xl border border-[#dedee9] bg-white p-5">
      <p className="text-xs font-semibold text-[#315bd8]">{course.code}</p>
      <h3 className="mt-2 text-base font-semibold">{course.name}</h3>
      <p className="mt-1 text-xs text-[#696977]">{course.instructor ?? "Instructor not assigned"}</p>
      <div className="mt-6 flex justify-between text-xs"><span>Progress</span><span className="font-semibold">{course.progress}%</span></div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eef0f6]" role="progressbar" aria-label={`${course.name} progress`} aria-valuenow={course.progress} aria-valuemin={0} aria-valuemax={100}><div className="h-full rounded-full bg-[#315bd8]" style={{ width: `${Math.min(100, Math.max(0, course.progress))}%` }} /></div>
      <div className="mt-5 border-t border-[#dedee9] pt-4 text-xs text-[#696977]"><p>{course.upcomingTaskCount} upcoming task{course.upcomingTaskCount === 1 ? "" : "s"}</p><p className="mt-1">{course.nextDeadline ? `Next deadline ${formatDate(course.nextDeadline)}` : "No upcoming deadline"}</p></div>
    </article>
  );
}
