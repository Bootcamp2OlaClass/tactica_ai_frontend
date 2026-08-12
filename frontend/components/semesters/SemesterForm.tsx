"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField, formFieldInputClassName } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import type { SemesterFormValues, SemesterStatus } from "@/types/semester";

const STATUS_OPTIONS: { value: SemesterStatus; label: string }[] = [
  { value: "UPCOMING", label: "Upcoming" },
  { value: "ACTIVE", label: "Active" },
  { value: "COMPLETED", label: "Completed" },
  { value: "ARCHIVED", label: "Archived" },
];

const DEFAULT_VALUES: SemesterFormValues = {
  name: "",
  academicYear: new Date().getFullYear(),
  startDate: "",
  endDate: "",
  status: "UPCOMING",
  description: "",
};

type FieldErrors = Partial<Record<keyof SemesterFormValues, string>>;

interface SemesterFormProps {
  initialValues?: SemesterFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  serverError?: string | null;
  serverFieldErrors?: FieldErrors | null;
  onSubmit: (values: SemesterFormValues) => void;
  onCancel: () => void;
}

function validate(values: SemesterFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) errors.name = "Name is required.";
  if (!Number.isInteger(values.academicYear) || values.academicYear < 2000 || values.academicYear > 2100) {
    errors.academicYear = "Enter a year between 2000 and 2100.";
  }
  if (!values.startDate) errors.startDate = "Start date is required.";
  if (!values.endDate) errors.endDate = "End date is required.";
  if (values.startDate && values.endDate && values.startDate >= values.endDate) {
    errors.endDate = "End date must be after the start date.";
  }

  return errors;
}

export function SemesterForm({
  initialValues,
  submitLabel,
  isSubmitting,
  serverError,
  serverFieldErrors,
  onSubmit,
  onCancel,
}: SemesterFormProps) {
  const [values, setValues] = useState<SemesterFormValues>(initialValues ?? DEFAULT_VALUES);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const errors = { ...fieldErrors, ...serverFieldErrors };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validate(values);
    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <FormField id="semester-name" label="Name" required error={errors.name}>
        <input
          id="semester-name"
          value={values.name}
          onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))}
          placeholder="Fall 2026"
          disabled={isSubmitting}
          className={formFieldInputClassName}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="semester-year" label="Academic year" required error={errors.academicYear}>
          <input
            id="semester-year"
            type="number"
            min={2000}
            max={2100}
            value={values.academicYear}
            onChange={(event) => setValues((v) => ({ ...v, academicYear: Number(event.target.value) }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>

        <FormField id="semester-status" label="Status" required>
          <Select
            id="semester-status"
            value={values.status}
            onChange={(event) => setValues((v) => ({ ...v, status: event.target.value as SemesterStatus }))}
            disabled={isSubmitting}
            options={STATUS_OPTIONS}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="semester-start" label="Start date" required error={errors.startDate}>
          <input
            id="semester-start"
            type="date"
            value={values.startDate}
            onChange={(event) => setValues((v) => ({ ...v, startDate: event.target.value }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>

        <FormField id="semester-end" label="End date" required error={errors.endDate}>
          <input
            id="semester-end"
            type="date"
            value={values.endDate}
            onChange={(event) => setValues((v) => ({ ...v, endDate: event.target.value }))}
            disabled={isSubmitting}
            className={formFieldInputClassName}
          />
        </FormField>
      </div>

      <FormField id="semester-description" label="Description" hint="Optional">
        <textarea
          id="semester-description"
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
