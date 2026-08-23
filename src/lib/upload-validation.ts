import sharp from "sharp";
import {
  EncryptedPDFError,
  PDFDict,
  PDFDocument,
  PDFName,
} from "pdf-lib";

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_REQUEST_BODY_BYTES = 14 * 1024 * 1024;
export const MAX_PDF_PAGES = 12;
export const MAX_IMAGE_DIMENSION = 10_000;
export const MAX_TOTAL_IMAGE_PIXELS = 25_000_000;
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

export type ValidatedUpload = Readonly<{
  mediaType: AllowedFileType;
  data: string;
  pageCount: number | null;
}>;

export class UploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadValidationError";
  }
}

export async function readLimitedJson(request: Request): Promise<unknown> {
  const declaredHeader = request.headers.get("content-length");
  if (declaredHeader && !/^\d+$/.test(declaredHeader))
    throw new UploadValidationError("Upload request is malformed.");
  const declared = Number(declaredHeader || 0);
  if (declared > MAX_REQUEST_BODY_BYTES)
    throw new UploadValidationError("Upload request is too large.");
  if (!request.body) throw new UploadValidationError("Upload body is missing.");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BODY_BYTES) {
      await reader.cancel();
      throw new UploadValidationError("Upload request is too large.");
    }
    chunks.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new UploadValidationError("Upload request is malformed.");
  }
}

function hasMagic(bytes: Buffer, type: AllowedFileType): boolean {
  if (type === "image/jpeg")
    return (
      bytes.length >= 4 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff &&
      bytes[bytes.length - 2] === 0xff &&
      bytes[bytes.length - 1] === 0xd9
    );
  if (type === "image/png")
    return bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (type === "image/webp")
    return (
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    );
  return /^%PDF-(?:1\.[0-7]|2\.0)/.test(bytes.subarray(0, 8).toString("ascii"));
}

export function assertImageDimensions(width: number, height: number): void {
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width < 1 ||
    height < 1 ||
    width > MAX_IMAGE_DIMENSION ||
    height > MAX_IMAGE_DIMENSION ||
    width * height > MAX_TOTAL_IMAGE_PIXELS
  ) {
    throw new UploadValidationError(
      "The image dimensions are too large. Use an image no larger than 10,000 pixels per side and 25 million total pixels.",
    );
  }
}

async function validateImage(
  bytes: Buffer,
  mediaType: Exclude<AllowedFileType, "application/pdf">,
): Promise<void> {
  const expectedFormat = {
    "image/jpeg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
  }[mediaType];
  try {
    const image = sharp(bytes, {
      failOn: "warning",
      limitInputPixels: MAX_TOTAL_IMAGE_PIXELS,
      sequentialRead: true,
    });
    const metadata = await image.metadata();
    if (
      metadata.format !== expectedFormat ||
      metadata.width === undefined ||
      metadata.height === undefined ||
      (metadata.pages !== undefined && metadata.pages !== 1)
    ) {
      throw new UploadValidationError(
        "The uploaded image is malformed or does not match its declared file type.",
      );
    }
    assertImageDimensions(metadata.width, metadata.height);
    // Force a complete decode so a valid-looking header cannot hide a corrupt
    // or truncated image. The original bytes are still sent unchanged.
    await image.stats();
  } catch (error) {
    if (error instanceof UploadValidationError) throw error;
    throw new UploadValidationError(
      "The uploaded image is malformed or unsupported.",
    );
  }
}

function hasEmbeddedFile(pdf: PDFDocument): boolean {
  if (
    pdf.catalog.has(PDFName.of("AF")) ||
    pdf.catalog.has(PDFName.of("EmbeddedFiles"))
  ) {
    return true;
  }

  const names = pdf.catalog.lookupMaybe(PDFName.of("Names"), PDFDict);
  if (names?.has(PDFName.of("EmbeddedFiles"))) return true;

  for (const [, object] of pdf.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFDict)) continue;
    const type = object.get(PDFName.of("Type"));
    if (type?.toString() === "/Filespec" || object.has(PDFName.of("EF")))
      return true;
  }
  return false;
}

async function validatePdf(bytes: Buffer): Promise<number> {
  const tail = bytes
    .subarray(Math.max(0, bytes.length - 2_048))
    .toString("latin1");
  if (!/%%EOF[\x00\t\n\f\r ]*$/.test(tail))
    throw new UploadValidationError("The uploaded PDF is malformed or truncated.");

  try {
    const pdf = await PDFDocument.load(bytes, {
      ignoreEncryption: false,
      updateMetadata: false,
      throwOnInvalidObject: true,
      capNumbers: true,
    });
    const pageCount = pdf.getPageCount();
    if (pageCount < 1)
      throw new UploadValidationError("The uploaded PDF has no pages.");
    if (pageCount > MAX_PDF_PAGES)
      throw new UploadValidationError(
        `PDF files may contain at most ${MAX_PDF_PAGES} pages. No pages were processed.`,
      );
    if (hasEmbeddedFile(pdf))
      throw new UploadValidationError(
        "PDF files containing embedded attachments are not supported.",
      );
    return pageCount;
  } catch (error) {
    if (error instanceof UploadValidationError) throw error;
    if (
      error instanceof EncryptedPDFError ||
      (error instanceof Error && /encrypt|password/i.test(error.message))
    ) {
      throw new UploadValidationError(
        "Encrypted or password-protected PDF files are not supported.",
      );
    }
    throw new UploadValidationError(
      "The uploaded PDF is malformed or unsupported.",
    );
  }
}

export async function validateUpload(payload: unknown): Promise<ValidatedUpload> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    throw new UploadValidationError("Upload request is malformed.");
  const allowedKeys = new Set([
    "image",
    "fileType",
    "processingAcknowledged",
  ]);
  if (Object.keys(payload).some((key) => !allowedKeys.has(key)))
    throw new UploadValidationError("Upload request contains unsupported fields.");
  const { image, fileType, processingAcknowledged } = payload as Record<
    string,
    unknown
  >;
  if (processingAcknowledged !== true)
    throw new UploadValidationError(
      "You must acknowledge the document processing notice before analysis.",
    );
  if (typeof image !== "string" || typeof fileType !== "string")
    throw new UploadValidationError("A file and file type are required.");
  if (!ALLOWED_FILE_TYPES.includes(fileType as AllowedFileType))
    throw new UploadValidationError(
      "Only JPEG, PNG, WebP, and PDF files are supported.",
    );

  const match = image.match(
    /^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/,
  );
  if (
    !match ||
    match[1] !== fileType ||
    !match[2] ||
    match[2].length % 4 !== 0
  ) {
    throw new UploadValidationError("The uploaded file data is malformed.");
  }

  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_FILE_BYTES)
    throw new UploadValidationError(
      bytes.length > MAX_FILE_BYTES
        ? "The uploaded file exceeds the 10 MB limit."
        : "The uploaded file is empty.",
    );
  if (
    bytes.toString("base64") !== match[2] ||
    !hasMagic(bytes, fileType as AllowedFileType)
  ) {
    throw new UploadValidationError(
      "The uploaded file does not match its declared file type.",
    );
  }

  const mediaType = fileType as AllowedFileType;
  const pageCount =
    mediaType === "application/pdf"
      ? await validatePdf(bytes)
      : (await validateImage(bytes, mediaType), null);
  return { mediaType, data: match[2], pageCount };
}
