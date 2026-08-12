"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDate, formatFileSize } from "@/lib/format";
import { deleteDocument, downloadDocument } from "@/services/document.service";
import type { CourseDocument } from "@/types/document";

import { DocumentTypeBadge, ProcessingStatusBadge } from "./DocumentBadges";

interface DocumentListProps {
  documents: CourseDocument[];
  onChanged: () => void;
}

export function DocumentList({ documents, onChanged }: DocumentListProps) {
  const { showToast } = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CourseDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDownload(document: CourseDocument) {
    setDownloadingId(document.id);

    try {
      const { blob, fileName } = await downloadDocument(document.id, document.originalFileName);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to download the document."), "error");
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);

    try {
      await deleteDocument(pendingDelete.id);
      showToast("Document deleted.", "success");
      setPendingDelete(null);
      onChanged();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to delete the document."), "error");
    } finally {
      setIsDeleting(false);
    }
  }

  if (documents.length === 0) {
    return <EmptyState title="No documents uploaded yet" description="Upload a PDF syllabus or lecture note to keep it with this course." />;
  }

  return (
    <>
      <ul className="space-y-3">
        {documents.map((document) => (
          <li key={document.id}>
            <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-[#17171c]">{document.originalFileName}</h3>
                  <DocumentTypeBadge type={document.documentType} />
                  <ProcessingStatusBadge status={document.processingStatus} />
                </div>
                <p className="mt-1 text-xs text-[#696977]">
                  {formatFileSize(document.fileSize)} · Uploaded {formatDate(document.createdAt)}
                </p>
                {document.processingStatus === "FAILED" && document.processingError && (
                  <p className="mt-1 text-xs text-red-600">{document.processingError}</p>
                )}
              </div>

              <div className="flex shrink-0 gap-2">
                <Button variant="secondary" onClick={() => handleDownload(document)} isLoading={downloadingId === document.id}>
                  Download
                </Button>
                <Button variant="danger" onClick={() => setPendingDelete(document)}>
                  Delete
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {pendingDelete && (
        <ConfirmDialog
          title="Delete document"
          description={`Delete "${pendingDelete.originalFileName}"? This can't be undone.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </>
  );
}
