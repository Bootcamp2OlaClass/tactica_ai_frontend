"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, formFieldInputClassName } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import type { Course } from "@/types/course";
import type { TaskFormValues, TaskPriority, TaskStatus, TaskType } from "@/types/task";

const TASK_TYPE_OPTIONS: { value: TaskType; label: string }[] = [
  { value: "assignment", label: "Assignment" },
  { value: "exam", label: "Exam" },
  { value: "quiz", label: "Quiz" },
  { value: "reading", label: "Reading" },
  { value: "project", label: "Project" },
  { value: "presentation", label: "Presentation" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const DEFAULT_VALUES: TaskFormValues = {
  title: "",
  description: "",
  taskType: "assignment",
  status: "todo",
  priority: "medium",
  dueAt: "",
  estimatedMinutes: "",
};

type FieldErrors = Partial<Record<keyof TaskFormValues, string>>;

interface TaskFormProps {
  initialValues?: TaskFormValues;
  /** Fixed course context (e.g. creating from within a course's detail page) — hides the picker. */
  courseId?: number;
  /** Provided when the course must be chosen (e.g. the flat /tasks page). */
  courseOptions?: Course[];
  submitLabel: string;
  isSubmitting: boolean;
  serverError?: string | null;
  serverFieldErrors?: FieldErrors | null;
  onSubmit: (courseId: number, values: TaskFormValues) => void;
  onCancel: () => void;
}

function validate(values: TaskFormValues, courseId: number | null, requiresCourse: boolean): FieldErrors & { courseId?: string } {
  const errors: FieldErrors & { courseId?: string } = {};

  if (!values.title.trim()) errors.title = "Title is required.";
  if (values.estimatedMinutes.trim() && (!Number.isFinite(Number(values.estimatedMinutes)) || Number(values.estimatedMinutes) < 0)) {
    errors.estimatedMinutes = "Enter a non-negative number of minutes.";
  }
  if (requiresCourse && !courseId) errors.courseId = "Choose a course.";

  return errors;
}

export function TaskForm({ initialValues, courseId: fixedCourseId, courseOptions, submitLabel, isSubmitting, serverError, serverFieldErrors, onSubmit, onCancel }: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues ?? DEFAULT_VALUES);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(fixedCourseId ?? null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors & { courseId?: string }>({});

  const errors = { ...fieldErrors, ...serverFieldErrors };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values, selectedCourseId, Boolean(courseOptions));
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0 && selectedCourseId) {
      onSubmit(selectedCourseId, values);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {courseOptions && (
        <FormField id="task-course" label="Course" required error={errors.courseId}>
          <Select
            id="task-course"
            value={selectedCourseId ?? ""}
            onChange={(event) => setSelectedCourseId(event.target.value ? Number(event.target.value) : null)}
            disabled={isSubmitting}
            placeholder="Choose a course"
            options={courseOptions.map((course) => ({ value: String(course.id), label: `${course.courseCode} — ${course.name}` }))}
          />
        </FormField>
      )}

      <FormField id="task-title" label="Title" required error={errors.title}>
        <input
          id="task-title"
          value={values.title}
          onChange={(event) => setValues((v) => ({ ...v, title: event.target.value }))}
          placeholder="Problem set 3"
          disabled={isSubmitting}
          className={formFieldInputClassName}
        />
      </FormField>

      <FormField id="task-description" label="Description" hint="Optional">
        <textarea
          id="task-description"
          value={values.description}
          onChange={(event) => setValues((v) => ({ ...v, description: event.target.value }))}
          disabled={isSubmitting}
          rows={3}
          className={formFieldInputClassName}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="task-type" label="Type" required>
          <Select
            id="task-type"
            value={values.taskType}
            onChange={(event) => setValues((v) => ({ ...v, taskType: event.target.value as TaskType }))}
            disabled={isSubmitting}
            options={TASK_TYPE_OPTIONS}
          />
        </FormField>

        <FormField id="task-priority" label="Priority" required>
          <Select
            id="task-priority"
            value={values.priority}
            onChange={(event) => setValues((v) => ({ ...v, priority: event.target.value as TaskPriority }))}
            disabled={isSubmitting}
            options={PRIORITY_OPTIONS}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="task-status" label="Status" required>
          <Select
            id="task-status"
            value={values.status}
            onChange={(event) => setValues((v) => ({ ...v, status: event.target.value as TaskStatus }))}
            disabled={isSubmitting}
            options={STATUS_OPTIONS}
          />
        </FormField>

        <FormField id="task-estimated-minutes" label="Estimated minutes" hint="Optional" error={errors.estimatedMinutes}>
          <input
            id="task-estimated-minutes"
            type="number"
            min={0}
            value={values.estimatedMinutes}
            onChange={(event) => setValues((v) => ({ ...v, estimatedMinutes: event.target.value }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>
      </div>

      <FormField id="task-due-at" label="Due" hint="Optional">
        <input
          id="task-due-at"
          type="datetime-local"
          value={values.dueAt}
          onChange={(event) => setValues((v) => ({ ...v, dueAt: event.target.value }))}
          disabled={isSubmitting}
          className={formFieldInputClassName}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
