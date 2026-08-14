"use client";

import { useEffect, useRef } from "react";

import type { CourseDocument, ProcessingStatus } from "@/types/document";

const NON_TERMINAL_STATUSES: ProcessingStatus[] = ["UPLOADED", "QUEUED", "PROCESSING"];
const POLL_INTERVAL_MS = 4000;

/**
 * Keeps a course's document list fresh while any document is still being
 * processed, so "Queued"/"Processing" advances to "Completed"/"Failed"
 * without the user refreshing the page. No SSE/WebSocket infrastructure
 * exists in this codebase, so polling the same list endpoint the page
 * already fetches (via the passed-in `reload`) is the simplest reliable
 * mechanism -- reused, not reinvented.
 */
export function useDocumentStatusPolling(documents: CourseDocument[] | undefined, reload: () => void) {
  const reloadRef = useRef(reload);
  useEffect(() => {
    reloadRef.current = reload;
  }, [reload]);

  const hasPending = (documents ?? []).some((doc) => NON_TERMINAL_STATUSES.includes(doc.processingStatus));

  useEffect(() => {
    if (!hasPending) return undefined;

    const intervalId = setInterval(() => {
      reloadRef.current();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [hasPending]);
}
