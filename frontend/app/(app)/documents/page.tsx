"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { DocumentList } from "@/components/documents/DocumentList";
import { DocumentUploadForm } from "@/components/documents/DocumentUploadForm";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/ToastProvider";
import { useCourses } from "@/hooks/useCourses";
import { useCourseDocuments } from "@/hooks/useDocuments";
import { useDocumentStatusPolling } from "@/hooks/useDocumentStatusPolling";
import { getApiErrorMessage } from "@/lib/api/client";
import { uploadCourseDocument } from "@/services/document.service";
import type { DocumentType } from "@/types/document";

function DocumentsPageContent() {
  const searchParams = useSearchParams();
  const [courseId, setCourseId] = useState<string>(searchParams.get("courseId") ?? "");
  const courses = useCourses({ pageSize: 100 });
  const documents = useCourseDocuments(courseId ? Number(courseId) : null);
  const { showToast } = useToast();

  useDocumentStatusPolling(documents.status === "success" ? documents.data.items : undefined, documents.reload);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const hasNoCourses = courses.status === "success" && courses.data.items.length === 0;

  async function handleUpload(file: File, documentType: DocumentType) {
    if (!courseId) return;
    setIsUploading(true);
    setUploadError(null);

    try {
      await uploadCourseDocument(Number(courseId), file, documentType);
      showToast("Document uploaded.", "success");
      documents.reload();
    } catch (error) {
      setUploadError(getApiErrorMessage(error, "Unable to upload the document."));
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Documents" description="Upload and manage PDFs for each course." />

      {hasNoCourses && (
        <div className="rounded-xl border border-[#dedee9] bg-white px-4 py-3 text-sm text-[#696977] dark:border-[#2d2d38] dark:bg-[#1b1b23] dark:text-[#9797a6]">
          Create a course first — documents belong to a course.{" "}
          <Link href="/courses" className="font-semibold text-[#315bd8] hover:underline dark:text-[#8aa4ff]">
            Go to courses →
          </Link>
        </div>
      )}

      {!hasNoCourses && (
        <div className="mb-6 max-w-xs">
          <Select
            aria-label="Choose a course"
            value={courseId}
            onChange={(event) => setCourseId(event.target.value)}
            placeholder="Choose a course"
            options={(courses.data?.items ?? []).map((course) => ({ value: String(course.id), label: `${course.courseCode} — ${course.name}` }))}
          />
        </div>
      )}

      {!hasNoCourses && !courseId && (
        <div className="rounded-2xl border border-dashed border-[#dedee9] bg-white px-6 py-14 text-center text-sm text-[#696977] dark:border-[#3a3a48] dark:bg-[#1b1b23] dark:text-[#9797a6]">
          Choose a course above to see and upload its documents.
        </div>
      )}

      {courseId && (
        <>
          <DocumentUploadForm isSubmitting={isUploading} serverError={uploadError} onSubmit={handleUpload} />

          <div className="mt-4">
            {documents.status === "loading" && <ListSkeleton rows={3} />}
            {documents.status === "error" && <ErrorState message={documents.error ?? "Unable to load documents."} onRetry={documents.reload} />}
            {documents.status === "success" && <DocumentList documents={documents.data.items} onChanged={documents.reload} />}
          </div>
        </>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<ListSkeleton rows={3} />}>
      <DocumentsPageContent />
    </Suspense>
  );
}
