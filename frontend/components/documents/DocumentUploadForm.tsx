"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Upload } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField, formFieldInputClassName } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { ALLOWED_DOCUMENT_MIME_TYPES, MAX_DOCUMENT_UPLOAD_SIZE_BYTES, type DocumentType } from "@/types/document";
import { formatFileSize } from "@/lib/format";

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: "SYLLABUS", label: "Syllabus" },
  { value: "LECTURE_NOTE", label: "Lecture note" },
  { value: "ASSIGNMENT", label: "Assignment" },
  { value: "SLIDE", label: "Slide deck" },
  { value: "REFERENCE", label: "Reference" },
  { value: "OTHER", label: "Other" },
];

// Single source of truth for this row's control height -- applied to the
// file trigger, the type Select, and the Upload button so the three never
// drift out of sync again. Not baked into formFieldInputClassName globally:
// that class is also used by multi-line <textarea>s elsewhere (CourseForm,
// TaskForm, RoadmapItemCard), where a fixed height would clip content.
const CONTROL_HEIGHT = "h-11";

interface DocumentUploadFormProps {
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (file: File, documentType: DocumentType) => void;
}

export function DocumentUploadForm({ isSubmitting, serverError, onSubmit }: DocumentUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();
  const [documentType, setDocumentType] = useState<DocumentType>("OTHER");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFileError(null);

    if (!selected) {
      setFile(null);
      return;
    }

    if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(selected.type as (typeof ALLOWED_DOCUMENT_MIME_TYPES)[number])) {
      setFileError("Only PDF files are supported.");
      setFile(null);
      return;
    }

    if (selected.size > MAX_DOCUMENT_UPLOAD_SIZE_BYTES) {
      setFileError(`File is too large. Maximum size is ${formatFileSize(MAX_DOCUMENT_UPLOAD_SIZE_BYTES)}.`);
      setFile(null);
      return;
    }

    setFile(selected);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!file) {
      setFileError("Choose a PDF file to upload.");
      return;
    }

    onSubmit(file, documentType);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 dark:border-[#2d2d38] dark:bg-[#1b1b23] sm:flex-row sm:items-start"
    >
      {serverError && (
        <div role="alert" className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-300 sm:order-first">
          {serverError}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <FormField id={fileInputId} label="File" required hint={`PDF only, up to ${formatFileSize(MAX_DOCUMENT_UPLOAD_SIZE_BYTES)}.`} error={fileError ?? undefined}>
          {/* The native file input is visually hidden (not display:none, so
              it stays focusable/keyboard-operable) and triggered via the
              label below -- styling a real <input type="file"> to match a
              Select/Button pixel-for-pixel isn't reliable cross-browser
              because its "Choose File" segment is an internal
              ::file-selector-button with its own box model stacked on top
              of the input's own padding, which is exactly what produced the
              taller, misaligned control this replaces. */}
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isSubmitting}
            className="peer sr-only"
          />
          <label
            htmlFor={fileInputId}
            className={`${formFieldInputClassName} ${CONTROL_HEIGHT} mt-1.5 flex cursor-pointer items-center gap-2 overflow-hidden peer-focus-visible:border-[#315bd8] peer-focus-visible:ring-4 peer-focus-visible:ring-[#315bd8]/10 dark:peer-focus-visible:border-[#6a8dff] ${
              isSubmitting ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <span className="shrink-0 rounded-lg bg-[#f6f4ff] px-3 py-1 text-sm font-semibold text-[#315bd8] dark:bg-[#22284a] dark:text-[#a9bdff]">
              Choose file
            </span>
            <span className="truncate text-[#454550] dark:text-[#c7c7d1]">{file ? file.name : "No file chosen"}</span>
          </label>
        </FormField>
      </div>

      <div className="w-full sm:w-48">
        <FormField id="document-type" label="Type">
          <Select
            id="document-type"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as DocumentType)}
            disabled={isSubmitting}
            options={DOCUMENT_TYPE_OPTIONS}
            className={CONTROL_HEIGHT}
          />
        </FormField>
      </div>

      <div className="shrink-0">
        <FormField id="document-upload-submit" label="">
          <Button type="submit" isLoading={isSubmitting} className={`${CONTROL_HEIGHT} mt-1.5 w-full sm:w-auto`}>
            {!isSubmitting && <Upload size={16} strokeWidth={1.8} aria-hidden="true" />}
            Upload
          </Button>
        </FormField>
      </div>
    </form>
  );
}
