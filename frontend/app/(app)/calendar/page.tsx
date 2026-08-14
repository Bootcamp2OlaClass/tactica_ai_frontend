"use client";

import { useMemo, useState } from "react";

import { AgendaSidePanel } from "@/components/calendar/AgendaSidePanel";
import { CalendarEventDetails } from "@/components/calendar/CalendarEventDetails";
import { GoogleCalendarIntegration } from "@/components/calendar/GoogleCalendarIntegration";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";
import { useCourses } from "@/hooks/useCourses";
import { useTasks } from "@/hooks/useTasks";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/client";
import { groupItemsByDate, toCalendarItems, type CalendarItem } from "@/lib/calendar/normalize";
import { toDatetimeLocalValue } from "@/lib/format";
import { completeTask, createTask, deleteTask, reopenTask, updateTask } from "@/services/task.service";
import type { Task, TaskFormValues } from "@/types/task";

const TABS = [
  { key: "calendar" as const, label: "My Calendar" },
  { key: "integrations" as const, label: "Integrations" },
];

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" });

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["key"]>("calendar");
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  const courses = useCourses({ pageSize: 100 });
  const tasks = useTasks({ pageSize: 100 });
  const { showToast } = useToast();

  const courseById = useMemo(() => new Map((courses.data?.items ?? []).map((course) => [course.id, course])), [courses.data]);
  const calendarItems = useMemo(
    () => (tasks.status === "success" ? toCalendarItems(tasks.data.items, courseById) : []),
    [tasks, courseById],
  );
  const itemsByDate = useMemo(() => groupItemsByDate(calendarItems), [calendarItems]);

  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

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
      setSelectedItem(null);
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
      setSelectedItem(null);
      tasks.reload();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to reopen the task."), "error");
    } finally {
      setBusyTaskId(null);
    }
  }

  function startEdit(task: Task) {
    setSelectedItem(null);
    setEditingTask(task);
  }

  function startDelete(task: Task) {
    setSelectedItem(null);
    setPendingDelete(task);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Calendar"
        description="Your academic schedule — tasks, assignments, and exams in one place."
        action={
          activeTab === "calendar" ? (
            <Button onClick={() => setIsCreateOpen(true)} disabled={hasNoCourses}>
              + New task
            </Button>
          ) : undefined
        }
      />

      <Tabs tabs={TABS} activeKey={activeTab} onChange={setActiveTab} />

      {activeTab === "integrations" ? (
        <GoogleCalendarIntegration />
      ) : (
        <>
          {hasNoCourses && (
            <div className="mb-6 rounded-xl border border-[#dedee9] bg-white px-4 py-3 text-sm text-[#696977] dark:border-[#2d2d38] dark:bg-[#1b1b23] dark:text-[#9797a6]">
              Create a course first — tasks belong to a course.
            </div>
          )}

          {tasks.status === "loading" && <ListSkeleton rows={4} />}
          {tasks.status === "error" && <ErrorState message={tasks.error ?? "Unable to load your calendar."} onRetry={tasks.reload} />}

          {tasks.status === "success" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-[#17171c] dark:text-[#f2f2f5]">{MONTH_LABEL_FORMATTER.format(currentMonth)}</h2>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setCurrentMonth(startOfMonth(new Date()))}>
                      Today
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label="Previous month"
                      onClick={() => setCurrentMonth((month) => new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                    >
                      ←
                    </Button>
                    <Button
                      variant="secondary"
                      aria-label="Next month"
                      onClick={() => setCurrentMonth((month) => new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                    >
                      →
                    </Button>
                  </div>
                </div>

                <MonthCalendar currentMonth={currentMonth} itemsByDate={itemsByDate} onSelectItem={setSelectedItem} />
              </div>

              <aside>
                <AgendaSidePanel
                  tasks={tasks.data.items}
                  courseById={courseById}
                  busyTaskId={busyTaskId}
                  onEdit={startEdit}
                  onDelete={startDelete}
                  onComplete={handleComplete}
                  onReopen={handleReopen}
                />
              </aside>
            </div>
          )}
        </>
      )}

      {selectedItem && (
        <CalendarEventDetails
          item={selectedItem}
          isBusy={busyTaskId === selectedItem.task.id}
          onClose={() => setSelectedItem(null)}
          onEdit={() => startEdit(selectedItem.task)}
          onDelete={() => startDelete(selectedItem.task)}
          onComplete={() => handleComplete(selectedItem.task)}
          onReopen={() => handleReopen(selectedItem.task)}
        />
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
