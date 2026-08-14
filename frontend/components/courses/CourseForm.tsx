"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { FormField, formFieldInputClassName } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import type { CourseFormValues, CourseStatus } from "@/types/course";
import type { Semester } from "@/types/semester";

const STATUS_OPTIONS: { value: CourseStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "DROPPED", label: "Dropped" },
  { value: "ARCHIVED", label: "Archived" },
];

const DEFAULT_VALUES: CourseFormValues = {
  courseCode: "",
  name: "",
  instructorName: "",
  credits: 3,
  classroom: "",
  color: "",
  description: "",
  status: "ACTIVE",
};

type FieldErrors = Partial<Record<keyof CourseFormValues, string>>;

interface CourseFormProps {
  initialValues?: CourseFormValues;
  /** Fixed semester context (e.g. creating from within a semester's detail page) — hides the picker. */
  semesterId?: number;
  /** Provided when the semester must be chosen (e.g. the flat /courses page). */
  semesterOptions?: Semester[];
  submitLabel: string;
  isSubmitting: boolean;
  serverError?: string | null;
  serverFieldErrors?: FieldErrors | null;
  onSubmit: (semesterId: number, values: CourseFormValues) => void;
  onCancel: () => void;
}

function validate(values: CourseFormValues, semesterId: number | null): FieldErrors & { semesterId?: string } {
  const errors: FieldErrors & { semesterId?: string } = {};

  if (!values.courseCode.trim()) errors.courseCode = "Course code is required.";
  if (!values.name.trim()) errors.name = "Course name is required.";
  if (!Number.isInteger(values.credits) || values.credits < 0 || values.credits > 20) {
    errors.credits = "Enter a credit value between 0 and 20.";
  }
  if (values.color && !/^#[0-9A-Fa-f]{6}$/.test(values.color)) {
    errors.color = "Use a hex color like #315BD8.";
  }
  if (!semesterId) errors.semesterId = "Choose a semester.";

  return errors;
}

export function CourseForm({
  initialValues,
  semesterId: fixedSemesterId,
  semesterOptions,
  submitLabel,
  isSubmitting,
  serverError,
  serverFieldErrors,
  onSubmit,
  onCancel,
}: CourseFormProps) {
  const [values, setValues] = useState<CourseFormValues>(initialValues ?? DEFAULT_VALUES);
  const [selectedSemesterId, setSelectedSemesterId] = useState<number | null>(fixedSemesterId ?? null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors & { semesterId?: string }>({});

  const errors = { ...fieldErrors, ...serverFieldErrors };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values, selectedSemesterId);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0 && selectedSemesterId) {
      onSubmit(selectedSemesterId, values);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {semesterOptions && (
        <FormField id="course-semester" label="Semester" required error={errors.semesterId}>
          <Select
            id="course-semester"
            value={selectedSemesterId ?? ""}
            onChange={(event) => setSelectedSemesterId(event.target.value ? Number(event.target.value) : null)}
            disabled={isSubmitting}
            placeholder="Choose a semester"
            options={semesterOptions.map((semester) => ({ value: String(semester.id), label: `${semester.name} (${semester.academicYear})` }))}
          />
        </FormField>
      )}

      <div className="grid grid-cols-2 gap-4">
        <FormField id="course-code" label="Course code" required error={errors.courseCode}>
          <input
            id="course-code"
            value={values.courseCode}
            onChange={(event) => setValues((v) => ({ ...v, courseCode: event.target.value }))}
            placeholder="CS 101"
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>

        <FormField id="course-credits" label="Credits" required error={errors.credits}>
          <input
            id="course-credits"
            type="number"
            min={0}
            max={20}
            value={values.credits}
            onChange={(event) => setValues((v) => ({ ...v, credits: Number(event.target.value) }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>
      </div>

      <FormField id="course-name" label="Course name" required error={errors.name}>
        <input
          id="course-name"
          value={values.name}
          onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))}
          placeholder="Introduction to Computer Science"
          disabled={isSubmitting}
          className={formFieldInputClassName}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="course-instructor" label="Instructor" hint="Optional">
          <input
            id="course-instructor"
            value={values.instructorName}
            onChange={(event) => setValues((v) => ({ ...v, instructorName: event.target.value }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>

        <FormField id="course-classroom" label="Classroom" hint="Optional">
          <input
            id="course-classroom"
            value={values.classroom}
            onChange={(event) => setValues((v) => ({ ...v, classroom: event.target.value }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="course-status" label="Status" required>
          <Select
            id="course-status"
            value={values.status}
            onChange={(event) => setValues((v) => ({ ...v, status: event.target.value as CourseStatus }))}
            disabled={isSubmitting}
            options={STATUS_OPTIONS}
          />
        </FormField>

        <FormField id="course-color" label="Color" hint="Pick a color, or use custom for any hex" error={errors.color}>
          <ColorPicker
            value={values.color}
            onChange={(hex) => setValues((v) => ({ ...v, color: hex }))}
            disabled={isSubmitting}
          />
        </FormField>
      </div>

      <FormField id="course-description" label="Description" hint="Optional">
        <textarea
          id="course-description"
          value={values.description}
          onChange={(event) => setValues((v) => ({ ...v, description: event.target.value }))}
          disabled={isSubmitting}
          rows={3}
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
