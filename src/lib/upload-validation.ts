export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_REQUEST_BODY_BYTES = 14 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;
type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];
export class UploadValidationError extends Error {}
export async function readLimitedJson(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (declared > MAX_REQUEST_BODY_BYTES) throw new UploadValidationError("Upload request is too large.");
  if (!request.body) throw new UploadValidationError("Upload body is missing.");
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_REQUEST_BODY_BYTES) { await reader.cancel(); throw new UploadValidationError("Upload request is too large."); } chunks.push(value); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new UploadValidationError("Upload request is malformed."); }
}
function hasMagic(bytes: Buffer, type: AllowedFileType): boolean {
  if (type === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === "image/png") return bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if (type === "image/webp") return bytes.subarray(0,4).toString() === "RIFF" && bytes.subarray(8,12).toString() === "WEBP";
  return bytes.subarray(0,5).toString() === "%PDF-";
}
export function validateUpload(payload: unknown): { mediaType: AllowedFileType; data: string } {
  if (!payload || typeof payload !== "object") throw new UploadValidationError("Upload request is malformed.");
  const { image, fileType } = payload as Record<string, unknown>;
  if (typeof image !== "string" || typeof fileType !== "string") throw new UploadValidationError("A file and file type are required.");
  if (!ALLOWED_FILE_TYPES.includes(fileType as AllowedFileType)) throw new UploadValidationError("Only JPEG, PNG, WebP, and PDF files are supported.");
  const match = image.match(/^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/);
  if (!match || match[1] !== fileType || !match[2] || match[2].length % 4 !== 0) throw new UploadValidationError("The uploaded file data is malformed.");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_FILE_BYTES) throw new UploadValidationError(bytes.length > MAX_FILE_BYTES ? "The uploaded file exceeds the 10 MB limit." : "The uploaded file is empty.");
  if (bytes.toString("base64") !== match[2] || !hasMagic(bytes, fileType as AllowedFileType)) throw new UploadValidationError("The uploaded file does not match its declared file type.");
  return { mediaType: fileType as AllowedFileType, data: match[2] };
}
