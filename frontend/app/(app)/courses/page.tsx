"use client";

import Link from "next/link";
import { useState } from "react";

import { CourseForm } from "@/components/courses/CourseForm";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { useCourses } from "@/hooks/useCourses";
import { useSemesters } from "@/hooks/useSemesters";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/client";
import { createCourse, deleteCourse } from "@/services/course.service";
import type { Course, CourseFormValues } from "@/types/course";

export default function CoursesPage() {
  const [semesterFilter, setSemesterFilter] = useState<string>("");
  const semesters = useSemesters({ pageSize: 100, sortBy: "start_date", sortOrder: "desc" });
  const courses = useCourses({
    semesterId: semesterFilter ? Number(semesterFilter) : undefined,
    pageSize: 100,
    sortBy: "created_at",
    sortOrder: "desc",
  });
  const { showToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFieldErrors, setCreateFieldErrors] = useState<Record<string, string> | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const semesterById = new Map((semesters.data?.items ?? []).map((semester) => [semester.id, semester]));

  async function handleCreate(semesterId: number, values: CourseFormValues) {
    setIsSubmitting(true);
    setCreateError(null);
    setCreateFieldErrors(null);

    try {
      await createCourse(semesterId, values);
      setIsCreateOpen(false);
      showToast("Course created.", "success");
      courses.reload();
    } catch (error) {
      setCreateError(getApiErrorMessage(error, "Unable to create the course."));
      setCreateFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);

    try {
      await deleteCourse(pendingDelete.id);
      showToast("Course deleted.", "success");
      setPendingDelete(null);
      courses.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the course."), "error");
    } finally {
      setIsDeleting(false);
    }
  }

  const hasNoSemesters = semesters.status === "success" && semesters.data.items.length === 0;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Courses"
        description="Every course across your semesters."
        action={
          <Button onClick={() => setIsCreateOpen(true)} disabled={hasNoSemesters}>
            + New course
          </Button>
        }
      />

      {hasNoSemesters && (
        <div className="mb-6 rounded-xl border border-[#dedee9] bg-white px-4 py-3 text-sm text-[#696977]">
          Create a semester first — courses belong to a semester.{" "}
          <Link href="/semesters" className="font-semibold text-[#315bd8] hover:underline">
            Go to semesters →
          </Link>
        </div>
      )}

      {!hasNoSemesters && (
        <div className="mb-6 max-w-xs">
          <Select
            aria-label="Filter by semester"
            value={semesterFilter}
            onChange={(event) => setSemesterFilter(event.target.value)}
            placeholder="All semesters"
            options={(semesters.data?.items ?? []).map((semester) => ({
              value: String(semester.id),
              label: `${semester.name} (${semester.academicYear})`,
            }))}
          />
        </div>
      )}

      {courses.status === "loading" && <ListSkeleton rows={4} />}
      {courses.status === "error" && <ErrorState message={courses.error ?? "Unable to load courses."} onRetry={courses.reload} />}
      {courses.status === "success" && courses.data.items.length === 0 && !hasNoSemesters && (
        <EmptyState
          title="No courses found"
          description={semesterFilter ? "No courses in this semester yet." : "Add your first course to start tracking tasks and documents."}
          action={<Button onClick={() => setIsCreateOpen(true)}>+ New course</Button>}
        />
      )}

      {courses.status === "success" && courses.data.items.length > 0 && (
        <ul className="space-y-3">
          {courses.data.items.map((course) => (
            <li key={course.id}>
              <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/courses/${course.id}`} className="min-w-0 flex-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]">
                  <div className="flex flex-wrap items-center gap-2">
                    {course.color && (
                      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: course.color }} />
                    )}
                    <h2 className="text-base font-semibold text-[#17171c]">
                      {course.courseCode} — {course.name}
                    </h2>
                    <CourseStatusBadge status={course.status} />
                  </div>
                  <p className="mt-1 text-sm text-[#696977]">
                    {semesterById.get(course.semesterId)?.name ?? `Semester #${course.semesterId}`} · {course.instructorName ?? "No instructor listed"}
                  </p>
                </Link>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/courses/${course.id}`}
                    className="rounded-xl border border-[#cfd2e3] px-3.5 py-2 text-sm font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]"
                  >
                    View
                  </Link>
                  <Button variant="danger" onClick={() => setPendingDelete(course)}>
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isCreateOpen && (
        <Modal title="New course" onClose={() => setIsCreateOpen(false)}>
          <CourseForm
            semesterOptions={semesters.data?.items ?? []}
            submitLabel="Create course"
            isSubmitting={isSubmitting}
            serverError={createError}
            serverFieldErrors={createFieldErrors}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete course"
          description={`Delete "${pendingDelete.name}"? Its tasks and documents will no longer be reachable from this list.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
