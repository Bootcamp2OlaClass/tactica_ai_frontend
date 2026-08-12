import type { CourseDocument, DocumentListResult, DocumentType, ProcessingStatus } from "@/types/document";

export interface RawDocument {
  id: number;
  course_id: number;
  uploaded_by: number;
  original_file_name: string;
  mime_type: string;
  file_size: number;
  checksum: string | null;
  document_type: DocumentType;
  processing_status: ProcessingStatus;
  processing_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface RawDocumentListResponse {
  items: RawDocument[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export function mapDocument(raw: RawDocument): CourseDocument {
  return {
    id: raw.id,
    courseId: raw.course_id,
    uploadedBy: raw.uploaded_by,
    originalFileName: raw.original_file_name,
    mimeType: raw.mime_type,
    fileSize: raw.file_size,
    checksum: raw.checksum,
    documentType: raw.document_type,
    processingStatus: raw.processing_status,
    processingError: raw.processing_error,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapDocumentList(raw: RawDocumentListResponse): DocumentListResult {
  return {
    items: raw.items.map(mapDocument),
    page: raw.page,
    pageSize: raw.page_size,
    total: raw.total,
    totalPages: raw.total_pages,
  };
}
