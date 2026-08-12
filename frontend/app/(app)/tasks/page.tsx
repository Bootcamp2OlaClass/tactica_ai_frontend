"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskListItem } from "@/components/tasks/TaskListItem";
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
import { useTasks } from "@/hooks/useTasks";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/client";
import { toDatetimeLocalValue } from "@/lib/format";
import { completeTask, createTask, deleteTask, reopenTask, updateTask } from "@/services/task.service";
import type { Task, TaskFormValues, TaskPriority, TaskStatus, TaskType } from "@/types/task";

const STATUS_FILTER_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_FILTER_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const TYPE_FILTER_OPTIONS: { value: TaskType; label: string }[] = [
  { value: "assignment", label: "Assignment" },
  { value: "exam", label: "Exam" },
  { value: "quiz", label: "Quiz" },
  { value: "reading", label: "Reading" },
  { value: "project", label: "Project" },
  { value: "presentation", label: "Presentation" },
  { value: "other", label: "Other" },
];

function isToday(iso: string): boolean {
  const date = new Date(iso);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate();
}

function groupTasks(items: Task[]) {
  const groups = { overdue: [] as Task[], today: [] as Task[], upcoming: [] as Task[], completed: [] as Task[], cancelled: [] as Task[] };

  for (const task of items) {
    if (task.status === "completed") groups.completed.push(task);
    else if (task.status === "cancelled") groups.cancelled.push(task);
    else if (task.isOverdue) groups.overdue.push(task);
    else if (task.dueAt && isToday(task.dueAt)) groups.today.push(task);
    else groups.upcoming.push(task);
  }

  return groups;
}

export default function TasksPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={4} />}>
      <TasksPageContent />
    </Suspense>
  );
}

function TasksPageContent() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId");

  const [courseFilter, setCourseFilter] = useState(initialCourseId ?? "");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");
  const [typeFilter, setTypeFilter] = useState<TaskType | "">("");

  const courses = useCourses({ pageSize: 100 });
  const tasks = useTasks({
    courseId: courseFilter ? Number(courseFilter) : undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    taskType: typeFilter || undefined,
    pageSize: 100,
    sortBy: "due_at",
    sortOrder: "asc",
  });
  const { showToast } = useToast();

  const courseById = useMemo(() => new Map((courses.data?.items ?? []).map((course) => [course.id, course])), [courses.data]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFieldErrors, setCreateFieldErrors] = useState<Record<string, string> | null>(null);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editFieldErrors, setEditFieldErrors] = useState<Record<string, string> | null>(null);

  const [pendingDelete, setPendingDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState<number | null>(null);

  const hasNoCourses = courses.status === "success" && courses.data.items.length === 0;

  async function handleCreate(courseId: number, values: TaskFormValues) {
    setIsSubmitting(true);
    setCreateError(null);
    setCreateFieldErrors(null);

    try {
      await createTask(courseId, values);
      setIsCreateOpen(false);
      showToast("Task created.", "success");
      tasks.reload();
    } catch (error) {
      setCreateError(getApiErrorMessage(error, "Unable to create the task."));
      setCreateFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleEditSubmit(_courseId: number, values: TaskFormValues) {
    if (!editingTask) return;
    setIsEditSubmitting(true);
    setEditError(null);
    setEditFieldErrors(null);

    try {
      await updateTask(editingTask.id, values);
      setEditingTask(null);
      showToast("Task updated.", "success");
      tasks.reload();
    } catch (error) {
      setEditError(getApiErrorMessage(error, "Unable to update the task."));
      setEditFieldErrors(getApiFieldErrors(error));
    } finally {
      setIsEditSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);

    try {
      await deleteTask(pendingDelete.id);
      showToast("Task deleted.", "success");
      setPendingDelete(null);
      tasks.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the task."), "error");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleComplete(task: Task) {
    setBusyTaskId(task.id);
    try {
      await completeTask(task.id);
      showToast("Task marked complete.", "success");
      tasks.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to complete the task."), "error");
    } finally {
      setBusyTaskId(null);
    }
  }

  async function handleReopen(task: Task) {
    setBusyTaskId(task.id);
    try {
      await reopenTask(task.id);
      showToast("Task reopened.", "success");
      tasks.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to reopen the task."), "error");
    } finally {
      setBusyTaskId(null);
    }
  }

  const groups = tasks.status === "success" ? groupTasks(tasks.data.items) : null;
  const totalCount = tasks.status === "success" ? tasks.data.items.length : 0;

  const sections: { key: keyof NonNullable<typeof groups>; label: string }[] = [
    { key: "overdue", label: "Overdue" },
    { key: "today", label: "Today" },
    { key: "upcoming", label: "Upcoming" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Tasks"
        description="Everything due across your courses."
        action={
          <Button onClick={() => setIsCreateOpen(true)} disabled={hasNoCourses}>
            + New task
          </Button>
        }
      />

      {hasNoCourses && (
        <div className="mb-6 rounded-xl border border-[#dedee9] bg-white px-4 py-3 text-sm text-[#696977]">
          Create a course first — tasks belong to a course.
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <Select
          aria-label="Filter by course"
          value={courseFilter}
          onChange={(event) => setCourseFilter(event.target.value)}
          placeholder="All courses"
          className="w-full sm:w-52"
          options={(courses.data?.items ?? []).map((course) => ({ value: String(course.id), label: `${course.courseCode} — ${course.name}` }))}
        />
        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "")}
          placeholder="All statuses"
          className="w-full sm:w-40"
          options={STATUS_FILTER_OPTIONS}
        />
        <Select
          aria-label="Filter by priority"
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | "")}
          placeholder="All priorities"
          className="w-full sm:w-40"
          options={PRIORITY_FILTER_OPTIONS}
        />
        <Select
          aria-label="Filter by type"
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value as TaskType | "")}
          placeholder="All types"
          className="w-full sm:w-40"
          options={TYPE_FILTER_OPTIONS}
        />
      </div>

      {tasks.status === "loading" && <ListSkeleton rows={4} />}
      {tasks.status === "error" && <ErrorState message={tasks.error ?? "Unable to load tasks."} onRetry={tasks.reload} />}
      {tasks.status === "success" && totalCount === 0 && !hasNoCourses && (
        <EmptyState
          title="No tasks found"
          description="Try clearing filters, or add your first task."
          action={<Button onClick={() => setIsCreateOpen(true)}>+ New task</Button>}
        />
      )}

      {groups && totalCount > 0 && (
        <div className="space-y-8">
          {sections.map(({ key, label }) =>
            groups[key].length > 0 ? (
              <section key={key}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#92929e]">
                  {label} ({groups[key].length})
                </h2>
                <ul className="space-y-3">
                  {groups[key].map((task) => (
                    <li key={task.id}>
                      <TaskListItem
                        task={task}
                        course={courseById.get(task.courseId)}
                        isBusy={busyTaskId === task.id}
                        onEdit={() => setEditingTask(task)}
                        onDelete={() => setPendingDelete(task)}
                        onComplete={() => handleComplete(task)}
                        onReopen={() => handleReopen(task)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null,
          )}
        </div>
      )}

      {isCreateOpen && (
        <Modal title="New task" onClose={() => setIsCreateOpen(false)}>
          <TaskForm
            courseOptions={courses.data?.items ?? []}
            submitLabel="Create task"
            isSubmitting={isSubmitting}
            serverError={createError}
            serverFieldErrors={createFieldErrors}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </Modal>
      )}

      {editingTask && (
        <Modal title="Edit task" onClose={() => setEditingTask(null)}>
          <TaskForm
            courseId={editingTask.courseId}
            initialValues={{
              title: editingTask.title,
              description: editingTask.description ?? "",
              taskType: editingTask.taskType,
              status: editingTask.status,
              priority: editingTask.priority,
              dueAt: editingTask.dueAt ? toDatetimeLocalValue(editingTask.dueAt) : "",
              estimatedMinutes: editingTask.estimatedMinutes !== null ? String(editingTask.estimatedMinutes) : "",
            }}
            submitLabel="Save changes"
            isSubmitting={isEditSubmitting}
            serverError={editError}
            serverFieldErrors={editFieldErrors}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingTask(null)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete task"
          description={`Delete "${pendingDelete.title}"?`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
