import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDocumentStatusPolling } from "./useDocumentStatusPolling";
import type { CourseDocument } from "@/types/document";

function makeDocument(overrides: Partial<CourseDocument>): CourseDocument {
  return {
    id: 1,
    courseId: 1,
    uploadedBy: 1,
    originalFileName: "syllabus.pdf",
    mimeType: "application/pdf",
    fileSize: 1024,
    checksum: null,
    documentType: "SYLLABUS",
    processingStatus: "QUEUED",
    processingError: null,
    createdAt: "2026-08-14T00:00:00Z",
    updatedAt: "2026-08-14T00:00:00Z",
    ...overrides,
  };
}

describe("useDocumentStatusPolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("polls on an interval while a document is non-terminal", () => {
    const reload = vi.fn();
    renderHook(() => useDocumentStatusPolling([makeDocument({ processingStatus: "PROCESSING" })], reload));

    expect(reload).not.toHaveBeenCalled();

    vi.advanceTimersByTime(4000);
    expect(reload).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(4000);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it("does not poll when every document is already terminal", () => {
    const reload = vi.fn();
    renderHook(() =>
      useDocumentStatusPolling(
        [makeDocument({ processingStatus: "COMPLETED" }), makeDocument({ id: 2, processingStatus: "FAILED" })],
        reload,
      ),
    );

    vi.advanceTimersByTime(20000);
    expect(reload).not.toHaveBeenCalled();
  });

  it("stops polling once the caller's documents transition to all-terminal", () => {
    const reload = vi.fn();
    const { rerender } = renderHook(
      ({ documents }: { documents: CourseDocument[] }) => useDocumentStatusPolling(documents, reload),
      { initialProps: { documents: [makeDocument({ processingStatus: "QUEUED" })] } },
    );

    vi.advanceTimersByTime(4000);
    expect(reload).toHaveBeenCalledTimes(1);

    rerender({ documents: [makeDocument({ processingStatus: "COMPLETED" })] });
    vi.advanceTimersByTime(20000);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("cleans up its interval on unmount", () => {
    const reload = vi.fn();
    const { unmount } = renderHook(() => useDocumentStatusPolling([makeDocument({ processingStatus: "QUEUED" })], reload));

    unmount();
    vi.advanceTimersByTime(20000);

    expect(reload).not.toHaveBeenCalled();
  });
});
