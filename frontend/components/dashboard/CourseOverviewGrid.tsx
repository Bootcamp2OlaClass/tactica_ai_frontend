import type { DashboardCourse } from "@/types/dashboard";
import { CourseOverviewCard } from "./CourseOverviewCard";

export function CourseOverviewGrid({ courses }: { courses: DashboardCourse[] }) {
  return (
    <section aria-labelledby="courses-heading">
      <div className="mb-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#315bd8]">This semester</p><h2 id="courses-heading" className="mt-1 text-2xl font-semibold tracking-[-0.035em]">Current courses</h2></div>
      {courses.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{courses.map((course) => <CourseOverviewCard key={course.id} course={course} />)}</div> : <div className="rounded-2xl border border-dashed border-[#b9bdd1] bg-white p-8 text-center text-sm text-[#696977]">No courses have been added to this semester.</div>}
    </section>
  );
}
