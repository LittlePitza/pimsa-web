/**
 * CV upload constraints — single source of truth shared by the public
 * application form (client) and /api/applications (server).
 */

export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const MAX_CV_LABEL = "5 MB";

export const ALLOWED_CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ALLOWED_CV_EXTENSIONS = /\.(pdf|doc|docx)$/i;

/** `accept` attribute for the file input. */
export const CV_ACCEPT = [".pdf", ".doc", ".docx", ...ALLOWED_CV_MIME_TYPES].join(",");
