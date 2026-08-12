export type DocumentType = "SYLLABUS" | "LECTURE_NOTE" | "ASSIGNMENT" | "SLIDE" | "REFERENCE" | "OTHER";
export type ProcessingStatus = "UPLOADED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

// Matches app/schemas/document.py's DocumentResponse exactly.
export interface CourseDocument {
  id: number;
  courseId: number;
  uploadedBy: number;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  checksum: string | null;
  documentType: DocumentType;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListResult {
  items: CourseDocument[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Backend default (app/services/document_upload.py ALLOWED_MIME_TYPES) — PDF only.
export const ALLOWED_DOCUMENT_MIME_TYPES = ["application/pdf"] as const;

// Backend default (app/core/config.py MAX_UPLOAD_SIZE, 10 * 1024 * 1024) — not
// exposed by any endpoint, so this mirrors the documented server default
// rather than being fetched dynamically.
export const MAX_DOCUMENT_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
