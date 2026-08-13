"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { CourseForm } from "@/components/courses/CourseForm";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { SemesterForm } from "@/components/semesters/SemesterForm";
import { SemesterStatusBadge } from "@/components/semesters/SemesterStatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Modal } from "@/components/ui/Modal";
import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/ToastProvider";
import { useSemester } from "@/hooks/useSemesters";
import { useSemesterCourses } from "@/hooks/useCourses";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { createCourse, deleteCourse } from "@/services/course.service";
import { deleteSemester, updateSemester } from "@/services/semester.service";
import type { Course, CourseFormValues } from "@/types/course";
import type { SemesterFormValues } from "@/types/semester";

export default function SemesterDetailPage() {
  const params = useParams<{ semesterId: string }>();
  const semesterId = Number(params.semesterId);
  const router = useRouter();
  const { showToast } = useToast();

  const semester = useSemester(semesterId);
  const courses = useSemesterCourses(semesterId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string> | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [isCourseSubmitting, setIsCourseSubmitting] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);
  const [courseFieldErrors, setCourseFieldErrors] = useState<Record<string, string> | null>(null);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState<Course | null>(null);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);

  async function handleEditSubmit(values: SemesterFormValues) {
    setIsEditSubmitting(true);
    setEditError(null);
    setEditFieldErrors(null);

    try {
      await updateSemester(semesterId, values);
      setIsEditOpen(false);
      showToast("Semester updated.", "success");
      semester.reload();
    } catch (error) {
      setEditError(getApiErrorMessage(error, "Unable to update the semester."));
      setEditFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function handleDeleteSemester() {
    setIsDeleting(true);
    try {
      await deleteSemester(semesterId);
      showToast("Semester deleted.", "success");
      router.push("/semesters");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the semester."), "error");
      setIsDeleting(false);
    }
  }

  async function handleAddCourse(_selectedSemesterId: number, values: CourseFormValues) {
    setIsCourseSubmitting(true);
    setCourseError(null);
    setCourseFieldErrors(null);

    try {
      await createCourse(semesterId, values);
      setIsAddCourseOpen(false);
      showToast("Course added.", "success");
      courses.reload();
    } catch (error) {
      setCourseError(getApiErrorMessage(error, "Unable to add the course."));
      setCourseFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsCourseSubmitting(false);
    }
  }

  async function handleConfirmDeleteCourse() {
    if (!pendingDeleteCourse) return;
    setIsDeletingCourse(true);

    try {
      await deleteCourse(pendingDeleteCourse.id);
      showToast("Course deleted.", "success");
      setPendingDeleteCourse(null);
      courses.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the course."), "error");
    } finally {
      setIsDeletingCourse(false);
    }
  }

  if (semester.status === "loading") {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (semester.status === "error") {
    return (
      <div className="mx-auto max-w-4xl">
        <ErrorState message={semester.error ?? "Unable to load this semester."} onRetry={semester.reload} />
      </div>
    );
  }

  const data = semester.data;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/semesters" className="text-sm font-medium text-[#315bd8] hover:underline">
        ← All semesters
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#17171c]">{data.name}</h1>
            <SemesterStatusBadge status={data.status} />
          </div>
          <p className="mt-2 text-sm text-[#696977]">
            {data.academicYear} · {formatDate(data.startDate)} – {formatDate(data.endDate)}
          </p>
          {data.description && <p className="mt-3 max-w-xl text-sm leading-6 text-[#454550]">{data.description}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/semesters/${semesterId}/roadmap`}
            className="inline-flex items-center rounded-xl border border-[#cfd2e3] bg-white px-4 py-2.5 text-sm font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]"
          >
            Roadmap
          </Link>
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#17171c]">Courses</h2>
        <Button onClick={() => setIsAddCourseOpen(true)}>+ Add course</Button>
      </div>

      <div className="mt-4">
        {courses.status === "loading" && <ListSkeleton rows={2} />}
        {courses.status === "error" && <ErrorState message={courses.error ?? "Unable to load courses."} onRetry={courses.reload} />}
        {courses.status === "success" && courses.data.items.length === 0 && (
          <EmptyState
            title="No courses in this semester yet"
            description="Add a course to start tracking its tasks and documents."
            action={<Button onClick={() => setIsAddCourseOpen(true)}>+ Add course</Button>}
          />
        )}
        {courses.status === "success" && courses.data.items.length > 0 && (
          <ul className="space-y-3">
            {courses.data.items.map((course) => (
              <li key={course.id}>
                <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                  <Link href={`/courses/${course.id}`} className="min-w-0 flex-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-[#17171c]">
                        {course.courseCode} — {course.name}
                      </h3>
                      <CourseStatusBadge status={course.status} />
                    </div>
                    <p className="mt-1 text-sm text-[#696977]">
                      {course.instructorName ?? "No instructor listed"} · {course.credits} credits
                    </p>
                  </Link>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/courses/${course.id}`}
                      className="rounded-xl border border-[#cfd2e3] px-3.5 py-2 text-sm font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]"
                    >
                      View
                    </Link>
                    <Button variant="danger" onClick={() => setPendingDeleteCourse(course)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isEditOpen && (
        <Modal title="Edit semester" onClose={() => setIsEditOpen(false)}>
          <SemesterForm
            initialValues={{
              name: data.name,
              academicYear: data.academicYear,
              startDate: data.startDate,
              endDate: data.endDate,
              status: data.status,
              description: data.description ?? "",
            }}
            submitLabel="Save changes"
            isSubmitting={isEditSubmitting}
            serverError={editError}
            serverFieldErrors={editFieldErrors}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditOpen(false)}
          />
        </Modal>
      )}

      {isDeleteOpen && (
        <ConfirmDialog
          title="Delete semester"
          description={`Delete "${data.name}"? Its courses, tasks, and documents will no longer be reachable from this list.`}
          isConfirming={isDeleting}
          onConfirm={handleDeleteSemester}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}

      {isAddCourseOpen && (
        <Modal title="Add course" onClose={() => setIsAddCourseOpen(false)}>
          <CourseForm
            semesterId={semesterId}
            submitLabel="Add course"
            isSubmitting={isCourseSubmitting}
            serverError={courseError}
            serverFieldErrors={courseFieldErrors}
            onSubmit={handleAddCourse}
            onCancel={() => setIsAddCourseOpen(false)}
          />
        </Modal>
      )}

      {pendingDeleteCourse && (
        <ConfirmDialog
          title="Delete course"
          description={`Delete "${pendingDeleteCourse.name}"? Its tasks and documents will no longer be reachable from this list.`}
          isConfirming={isDeletingCourse}
          onConfirm={handleConfirmDeleteCourse}
          onCancel={() => setPendingDeleteCourse(null)}
        />
      )}
    </div>
  );
}
