import { authenticatedApiRequest, authenticatedDownload, authenticatedFileUpload, buildQueryString } from "@/lib/api/client";
import { mapDocument, mapDocumentList, type RawDocument, type RawDocumentListResponse } from "@/lib/mappers/document";
import type { CourseDocument, DocumentListResult, DocumentType } from "@/types/document";

const BASE_PATH = "/api/v1/documents";

export async function listCourseDocuments(
  courseId: number,
  filters: { page?: number; pageSize?: number } = {},
): Promise<DocumentListResult> {
  const query = buildQueryString({ page: filters.page, page_size: filters.pageSize });
  const raw = await authenticatedApiRequest<RawDocumentListResponse>(
    `/api/v1/courses/${courseId}/documents${query}`,
  );
  return mapDocumentList(raw);
}

export async function uploadCourseDocument(
  courseId: number,
  file: File,
  documentType: DocumentType,
): Promise<CourseDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", documentType);

  const raw = await authenticatedFileUpload<RawDocument>(`/api/v1/courses/${courseId}/documents`, formData);
  return mapDocument(raw);
}

export async function downloadDocument(documentId: number, fallbackFileName: string): Promise<{ blob: Blob; fileName: string }> {
  return authenticatedDownload(`${BASE_PATH}/${documentId}/download`, fallbackFileName);
}

export async function deleteDocument(documentId: number): Promise<void> {
  await authenticatedApiRequest<void>(`${BASE_PATH}/${documentId}`, { method: "DELETE" });
}
