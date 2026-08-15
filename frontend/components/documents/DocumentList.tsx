"use client";

import { useState } from "react";
import { Download, RotateCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api/client";
import { formatDate, formatFileSize } from "@/lib/format";
import { deleteDocument, downloadDocument, reprocessDocument } from "@/services/document.service";
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
  const [retryingId, setRetryingId] = useState<number | null>(null);

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

  async function handleRetry(document: CourseDocument) {
    setRetryingId(document.id);

    try {
      await reprocessDocument(document.id);
      showToast("Reprocessing started.", "success");
      onChanged();
    } catch (error) {
      showToast(getApiErrorMessage(error, "Unable to reprocess the document."), "error");
    } finally {
      setRetryingId(null);
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
            <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 dark:border-[#2d2d38] dark:bg-[#1b1b23] sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-[#17171c] dark:text-[#f2f2f5]">{document.originalFileName}</h3>
                  <DocumentTypeBadge type={document.documentType} />
                  <ProcessingStatusBadge status={document.processingStatus} />
                </div>
                <p className="mt-1 text-xs text-[#696977] dark:text-[#9797a6]">
                  {formatFileSize(document.fileSize)} · Uploaded {formatDate(document.createdAt)}
                </p>
                {document.processingStatus === "FAILED" && document.processingError && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{document.processingError}</p>
                )}
              </div>

              <div className="flex flex-wrap shrink-0 gap-2">
                {document.processingStatus === "FAILED" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleRetry(document)}
                    isLoading={retryingId === document.id}
                  >
                    {retryingId !== document.id && <RotateCw size={16} strokeWidth={1.8} aria-hidden="true" />}
                    Retry
                  </Button>
                )}
                <Button variant="secondary" onClick={() => handleDownload(document)} isLoading={downloadingId === document.id}>
                  {downloadingId !== document.id && <Download size={16} strokeWidth={1.8} aria-hidden="true" />}
                  Download
                </Button>
                <Button variant="danger" onClick={() => setPendingDelete(document)} aria-label={`Delete document "${document.originalFileName}"`}>
                  <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
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
