import sharp from "sharp";
import { getDocumentProxy } from "unpdf";
import { UploadValidationError } from "./upload-validation";
import { MAX_PDF_PAGES, MAX_PDF_TEXT_CHARACTERS, MAX_IMAGE_DIMENSION } from "./analysis-cost";
const TOO_LONG = "This document is too long for automated review. Try splitting it into smaller uploads.";
export async function preflightUpload(upload: { mediaType: string; data: string }): Promise<{ mediaType: string; data: string }> {
  const bytes = Buffer.from(upload.data, "base64");
  if (upload.mediaType === "application/pdf") {
    let pdf: Awaited<ReturnType<typeof getDocumentProxy>> | undefined;
    try {
      pdf = await getDocumentProxy(new Uint8Array(bytes), { isEvalSupported: false, useSystemFonts: false, disableFontFace: true, verbosity: 0 });
      if (pdf.numPages < 1 || pdf.numPages > MAX_PDF_PAGES) throw new UploadValidationError(TOO_LONG);
      let characters = 0;
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n);
        const reader = page.streamTextContent().getReader();
        try {
          while (true) {
            const { value, done } = await reader.read(); if (done) break;
            for (const item of value.items) if ("str" in item) characters += item.str.length;
            // Drain the local page stream before cleanup; cancelling PDF.js mid-chunk
            // can race its controller. No extracted text is retained or sent onward.
          }
        } finally { reader.releaseLock(); page.cleanup(); }
        if (characters > MAX_PDF_TEXT_CHARACTERS) throw new UploadValidationError(TOO_LONG);
      }
      return upload;
    } catch (error) {
      if (error instanceof UploadValidationError) throw error;
      throw new UploadValidationError("This PDF could not be safely inspected. Try a smaller, unlocked PDF or a clear image.");
    } finally { await pdf?.destroy(); }
  }
  try {
    const image = sharp(bytes, { limitInputPixels: 40_000_000, animated: false, failOn: "warning" });
    const metadata = await image.metadata();
    if ((metadata.pages ?? 1) !== 1) throw new Error("MULTIFRAME");
    const resized = await image.rotate().resize({ width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION, fit: "inside", withoutEnlargement: true }).png().toBuffer();
    return { mediaType: "image/png", data: resized.toString("base64") };
  } catch { throw new UploadValidationError("This image could not be safely resized. Try a smaller, clear image."); }
}
