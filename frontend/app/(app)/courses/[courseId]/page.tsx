"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { CourseForm } from "@/components/courses/CourseForm";
import { CourseStatusBadge } from "@/components/courses/CourseStatusBadge";
import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { TaskForm } from "@/components/tasks/TaskForm";
import { OverdueBadge, TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/TaskBadges";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/ToastProvider";
import { useCourse } from "@/hooks/useCourses";
import { useCourseDocuments } from "@/hooks/useDocuments";
import { useTasks } from "@/hooks/useTasks";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { deleteCourse, updateCourse } from "@/services/course.service";
import { uploadCourseDocument } from "@/services/document.service";
import { createTask, deleteTask } from "@/services/task.service";
import type { CourseFormValues } from "@/types/course";
import type { DocumentType } from "@/types/document";
import type { Task, TaskFormValues } from "@/types/task";

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const router = useRouter();
  const { showToast } = useToast();

  const course = useCourse(courseId);
  const tasks = useTasks({ courseId, pageSize: 50, sortBy: "due_at", sortOrder: "asc" });
  const documents = useCourseDocuments(courseId);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string> | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isTaskSubmitting, setIsTaskSubmitting] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);
  const [taskFieldErrors, setTaskFieldErrors] = useState<Record<string, string> | null>(null);
  const [pendingDeleteTask, setPendingDeleteTask] = useState<Task | null>(null);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleEditSubmit(_semesterId: number, values: CourseFormValues) {
    setIsEditSubmitting(true);
    setEditError(null);
    setEditFieldErrors(null);

    try {
      await updateCourse(courseId, values);
      setIsEditOpen(false);
      showToast("Course updated.", "success");
      course.reload();
    } catch (error) {
      setEditError(getApiErrorMessage(error, "Unable to update the course."));
      setEditFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function handleDeleteCourse() {
    setIsDeleting(true);
    try {
      await deleteCourse(courseId);
      showToast("Course deleted.", "success");
      router.push("/courses");
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the course."), "error");
      setIsDeleting(false);
    }
  }

  async function handleAddTask(_selectedCourseId: number, values: TaskFormValues) {
    setIsTaskSubmitting(true);
    setTaskError(null);
    setTaskFieldErrors(null);

    try {
      await createTask(courseId, values);
      setIsAddTaskOpen(false);
      showToast("Task created.", "success");
      tasks.reload();
    } catch (error) {
      setTaskError(getApiErrorMessage(error, "Unable to create the task."));
      setTaskFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsTaskSubmitting(false);
    }
  }

  async function handleConfirmDeleteTask() {
    if (!pendingDeleteTask) return;
    setIsDeletingTask(true);

    try {
      await deleteTask(pendingDeleteTask.id);
      showToast("Task deleted.", "success");
      setPendingDeleteTask(null);
      tasks.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the task."), "error");
    } finally {
      setIsDeletingTask(false);
    }
  }

  async function handleUpload(file: File, documentType: DocumentType) {
    setIsUploading(true);
    setUploadError(null);

    try {
      await uploadCourseDocument(courseId, file, documentType);
      showToast("Document uploaded.", "success");
      documents.reload();
    } catch (error) {
      setUploadError(getApiErrorMessage(error, "Unable to upload the document."));
    } finally {
      setIsUploading(false);
    }
  }

  if (course.status === "loading") {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (course.status === "error") {
    return (
      <div className="mx-auto max-w-4xl">
        <ErrorState message={course.error ?? "Unable to load this course."} onRetry={course.reload} />
      </div>
    );
  }

  const data = course.data;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/courses" className="text-sm font-medium text-[#315bd8] hover:underline">
        ← All courses
      </Link>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[#17171c]">
              {data.courseCode} — {data.name}
            </h1>
            <CourseStatusBadge status={data.status} />
          </div>
          <p className="mt-2 text-sm text-[#696977]">
            <Link href={`/semesters/${data.semesterId}`} className="font-medium text-[#315bd8] hover:underline">
              Semester #{data.semesterId}
            </Link>
            {" · "}
            {data.instructorName ?? "No instructor listed"} · {data.credits} credits
            {data.classroom ? ` · ${data.classroom}` : ""}
          </p>
          {data.description && <p className="mt-3 max-w-xl text-sm leading-6 text-[#454550]">{data.description}</p>}
        </div>

        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#17171c]">Tasks</h2>
        <div className="flex items-center gap-3">
          <Link href={`/tasks?courseId=${courseId}`} className="text-sm font-medium text-[#315bd8] hover:underline">
            View all
          </Link>
          <Button onClick={() => setIsAddTaskOpen(true)}>+ Add task</Button>
        </div>
      </div>

      <div className="mt-4">
        {tasks.status === "loading" && <ListSkeleton rows={2} />}
        {tasks.status === "error" && <ErrorState message={tasks.error ?? "Unable to load tasks."} onRetry={tasks.reload} />}
        {tasks.status === "success" && tasks.data.items.length === 0 && (
          <EmptyState title="No tasks for this course yet" action={<Button onClick={() => setIsAddTaskOpen(true)}>+ Add task</Button>} />
        )}
        {tasks.status === "success" && tasks.data.items.length > 0 && (
          <ul className="space-y-3">
            {tasks.data.items.map((task) => (
              <li key={task.id} className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#17171c]">{task.title}</h3>
                    <TaskStatusBadge status={task.status} />
                    <TaskPriorityBadge priority={task.priority} />
                    {task.isOverdue && <OverdueBadge />}
                  </div>
                  <p className="mt-1 text-xs text-[#696977]">{task.dueAt ? `Due ${formatDate(task.dueAt)}` : "No due date"}</p>
                </div>

                <Button variant="danger" onClick={() => setPendingDeleteTask(task)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-[#17171c]">Documents</h2>

        <div className="mt-4">
          <DocumentUploadForm isSubmitting={isUploading} serverError={uploadError} onSubmit={handleUpload} />
        </div>

        <div className="mt-4">
          {documents.status === "loading" && <ListSkeleton rows={2} />}
          {documents.status === "error" && <ErrorState message={documents.error ?? "Unable to load documents."} onRetry={documents.reload} />}
          {documents.status === "success" && <DocumentList documents={documents.data.items} onChanged={documents.reload} />}
        </div>
      </div>

      {isEditOpen && (
        <Modal title="Edit course" onClose={() => setIsEditOpen(false)}>
          <CourseForm
            semesterId={data.semesterId}
            initialValues={{
              courseCode: data.courseCode,
              name: data.name,
              instructorName: data.instructorName ?? "",
              credits: data.credits,
              classroom: data.classroom ?? "",
              color: data.color ?? "",
              description: data.description ?? "",
              status: data.status,
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
          title="Delete course"
          description={`Delete "${data.name}"? Its tasks and documents will no longer be reachable from this list.`}
          isConfirming={isDeleting}
          onConfirm={handleDeleteCourse}
          onCancel={() => setIsDeleteOpen(false)}
        />
      )}

      {isAddTaskOpen && (
        <Modal title="Add task" onClose={() => setIsAddTaskOpen(false)}>
          <TaskForm
            courseId={courseId}
            submitLabel="Add task"
            isSubmitting={isTaskSubmitting}
            serverError={taskError}
            serverFieldErrors={taskFieldErrors}
            onSubmit={handleAddTask}
            onCancel={() => setIsAddTaskOpen(false)}
          />
        </Modal>
      )}

      {pendingDeleteTask && (
        <ConfirmDialog
          title="Delete task"
          description={`Delete "${pendingDeleteTask.title}"?`}
          isConfirming={isDeletingTask}
          onConfirm={handleConfirmDeleteTask}
          onCancel={() => setPendingDeleteTask(null)}
        />
      )}
    </div>
  );
}
