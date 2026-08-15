"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { SemesterForm } from "@/components/semesters/SemesterForm";
import { SemesterStatusBadge } from "@/components/semesters/SemesterStatusBadge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ListSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/components/ui/ToastProvider";
import { useSemesters } from "@/hooks/useSemesters";
import { formatDate } from "@/lib/format";
import { createSemester, deleteSemester } from "@/services/semester.service";
import { getApiErrorMessage, getApiFieldErrors } from "@/lib/api/client";
import type { Semester, SemesterFormValues } from "@/types/semester";

export default function SemestersPage() {
  const { status, data, error, reload } = useSemesters({ sortBy: "start_date", sortOrder: "desc", pageSize: 100 });
  const { showToast } = useToast();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createFieldErrors, setCreateFieldErrors] = useState<Record<string, string> | null>(null);

  const [pendingDelete, setPendingDelete] = useState<Semester | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(values: SemesterFormValues) {
    setIsSubmitting(true);
    setCreateError(null);
    setCreateFieldErrors(null);

    try {
      await createSemester(values);
      setIsCreateOpen(false);
      showToast("Semester created.", "success");
      reload();
    } catch (submitError) {
      setCreateError(getApiErrorMessage(submitError, "Unable to create the semester."));
      setCreateFieldErrors(getApiFieldErrors(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);

    try {
      await deleteSemester(pendingDelete.id);
      showToast("Semester deleted.", "success");
      setPendingDelete(null);
      reload();
    } catch (deleteError) {
      showToast(getApiErrorMessage(deleteError, "Unable to delete the semester."), "error");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Semesters"
        description="Organize your academic terms and track which one is active."
        action={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
            New semester
          </Button>
        }
      />

      {status === "loading" && <ListSkeleton rows={3} />}
      {status === "error" && <ErrorState message={error ?? "Unable to load semesters."} onRetry={reload} />}
      {status === "success" && data.items.length === 0 && (
        <EmptyState
          title="No semesters yet"
          description="Create your first semester to start organizing courses, tasks, and documents."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus size={16} strokeWidth={1.8} aria-hidden="true" />
              New semester
            </Button>
          }
        />
      )}

      {status === "success" && data.items.length > 0 && (
        <ul className="space-y-3">
          {data.items.map((semester) => (
            <li key={semester.id}>
              <div className="flex flex-col gap-3 rounded-2xl border border-[#dedee9] bg-white p-5 transition hover:border-[#aeb3cf] sm:flex-row sm:items-center sm:justify-between">
                <Link href={`/semesters/${semester.id}`} className="min-w-0 flex-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315bd8]">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-[#17171c]">{semester.name}</h2>
                    <SemesterStatusBadge status={semester.status} />
                  </div>
                  <p className="mt-1 text-sm text-[#696977]">
                    {semester.academicYear} · {formatDate(semester.startDate)} – {formatDate(semester.endDate)}
                  </p>
                </Link>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/semesters/${semester.id}`}
                    className="rounded-xl border border-[#cfd2e3] px-3.5 py-2 text-sm font-semibold text-[#34343c] transition hover:border-[#aeb3cf] hover:bg-[#f6f4ff]"
                  >
                    View
                  </Link>
                  <Button variant="danger" onClick={() => setPendingDelete(semester)} aria-label={`Delete semester "${semester.name}"`}>
                    <Trash2 size={16} strokeWidth={1.8} aria-hidden="true" />
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isCreateOpen && (
        <Modal title="New semester" onClose={() => setIsCreateOpen(false)}>
          <SemesterForm
            submitLabel="Create semester"
            isSubmitting={isSubmitting}
            serverError={createError}
            serverFieldErrors={createFieldErrors}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
          />
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete semester"
          description={`Delete "${pendingDelete.name}"? Its courses, tasks, and documents will no longer be reachable from this list.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
