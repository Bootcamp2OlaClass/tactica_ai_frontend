"use client";

import { FormEvent, useRef, useState } from "react";

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

interface DocumentUploadFormProps {
  isSubmitting: boolean;
  serverError?: string | null;
  onSubmit: (file: File, documentType: DocumentType) => void;
}

export function DocumentUploadForm({ isSubmitting, serverError, onSubmit }: DocumentUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

    if (!file) {
      setFileError("Choose a PDF file to upload.");
      return;
    }

    onSubmit(file, documentType);
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 dark:border-[#2d2d38] dark:bg-[#1b1b23] sm:flex-row sm:items-start">
      {serverError && (
        <div role="alert" className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/60 dark:bg-red-900/30 dark:text-red-300 sm:order-first">
          {serverError}
        </div>
      )}

      <FormField id="document-file" label="File" required hint={`PDF only, up to ${formatFileSize(MAX_DOCUMENT_UPLOAD_SIZE_BYTES)}.`} error={fileError ?? undefined}>
        <input
          ref={fileInputRef}
          id="document-file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={isSubmitting}
          className={`${formFieldInputClassName} file:mr-3 file:rounded-lg file:border-0 file:bg-[#f6f4ff] file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-[#315bd8] dark:file:bg-[#22284a] dark:file:text-[#a9bdff]`}
        />
      </FormField>

      <div className="w-full sm:w-48">
        <FormField id="document-type" label="Type">
          <Select
            id="document-type"
            value={documentType}
            onChange={(event) => setDocumentType(event.target.value as DocumentType)}
            disabled={isSubmitting}
            options={DOCUMENT_TYPE_OPTIONS}
          />
        </FormField>
      </div>

      <FormField id="document-upload-submit" label="">
        <Button type="submit" isLoading={isSubmitting} className="mt-1.5 w-full sm:w-auto">
          Upload
        </Button>
      </FormField>
    </form>
  );
}
