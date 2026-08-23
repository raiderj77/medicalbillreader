import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import {
  MAX_FILE_BYTES,
  MAX_PDF_PAGES,
  UploadValidationError,
  assertImageDimensions,
  validateUpload,
} from "@/lib/upload-validation";

function uploadPayload(bytes: Uint8Array, fileType: string) {
  return {
    image: `data:${fileType};base64,${Buffer.from(bytes).toString("base64")}`,
    fileType,
    processingAcknowledged: true,
  };
}

async function syntheticImage(type: "jpeg" | "png" | "webp") {
  return sharp({
    create: {
      width: 2,
      height: 2,
      channels: 4,
      background: { r: 240, g: 248, b: 250, alpha: 1 },
    },
  })
    .toFormat(type)
    .toBuffer();
}

async function syntheticPdf(pages = 1, withAttachment = false) {
  const pdf = await PDFDocument.create();
  for (let index = 0; index < pages; index += 1) pdf.addPage([200, 200]);
  if (withAttachment)
    await pdf.attach(
      Uint8Array.from(Buffer.from("synthetic attachment", "utf8")),
      "synthetic.txt",
      { mimeType: "text/plain" },
    );
  return pdf.save({ useObjectStreams: false });
}

async function syntheticEncryptedPdf() {
  const pdf = await PDFDocument.create();
  pdf.addPage([200, 200]);
  const encrypt = pdf.context.register(
    pdf.context.obj({ Filter: "Standard" }),
  );
  pdf.context.trailerInfo.Encrypt = encrypt;
  return pdf.save({ useObjectStreams: false });
}

describe("strict upload validation", () => {
  it("accepts completely decodable JPEG, PNG, WebP, and standard PDFs", async () => {
    for (const [format, mediaType] of [
      ["jpeg", "image/jpeg"],
      ["png", "image/png"],
      ["webp", "image/webp"],
    ] as const) {
      const result = await validateUpload(
        uploadPayload(await syntheticImage(format), mediaType),
      );
      expect(result.mediaType).toBe(mediaType);
      expect(result.pageCount).toBeNull();
    }

    const pdf = await validateUpload(
      uploadPayload(await syntheticPdf(2), "application/pdf"),
    );
    expect(pdf.pageCount).toBe(2);
  });

  it("rejects unsupported types, malformed base64, and MIME/signature mismatch", async () => {
    await expect(
      validateUpload({
        image: "data:text/plain;base64,SGVsbG8=",
        fileType: "text/plain",
        processingAcknowledged: true,
      }),
    ).rejects.toThrow("Only JPEG, PNG, WebP, and PDF");
    await expect(
      validateUpload({
        image: "data:image/png;base64,not_base64!!",
        fileType: "image/png",
        processingAcknowledged: true,
      }),
    ).rejects.toThrow(UploadValidationError);
    await expect(
      validateUpload({
        ...uploadPayload(await syntheticPdf(), "image/png"),
      }),
    ).rejects.toThrow("declared file type");
  });

  it("rejects oversized decoded files before parsing", async () => {
    const data = Buffer.alloc(MAX_FILE_BYTES + 1);
    await expect(
      validateUpload(uploadPayload(data, "image/png")),
    ).rejects.toThrow("10 MB");
  });

  it("requires affirmative processing acknowledgement", async () => {
    const payload = uploadPayload(await syntheticImage("png"), "image/png");
    await expect(
      validateUpload({ ...payload, processingAcknowledged: false }),
    ).rejects.toThrow("acknowledge the document processing notice");
  });

  it("rejects all request keys outside the three-field upload contract", async () => {
    const payload = uploadPayload(await syntheticImage("png"), "image/png");
    await expect(
      validateUpload({ ...payload, filename: "synthetic.png" }),
    ).rejects.toThrow("unsupported fields");
  });

  it("enforces dimensions and total pixels without allocating oversized fixtures", () => {
    expect(() => assertImageDimensions(10_000, 2_500)).not.toThrow();
    expect(() => assertImageDimensions(10_001, 1)).toThrow("dimensions");
    expect(() => assertImageDimensions(5_001, 5_001)).toThrow("dimensions");
    expect(() => assertImageDimensions(0, 100)).toThrow("dimensions");
  });

  it("rejects PDFs over the 12-page product cap without truncating", async () => {
    await expect(
      validateUpload(
        uploadPayload(
          await syntheticPdf(MAX_PDF_PAGES + 1),
          "application/pdf",
        ),
      ),
    ).rejects.toThrow("at most 12 pages");
  });

  it("rejects malformed or truncated PDFs", async () => {
    const valid = Buffer.from(await syntheticPdf());
    const truncated = valid.subarray(0, valid.length - 20);
    await expect(
      validateUpload(uploadPayload(truncated, "application/pdf")),
    ).rejects.toThrow(/malformed|truncated/);
  });

  it("rejects PDFs with embedded files", async () => {
    await expect(
      validateUpload(
        uploadPayload(await syntheticPdf(1, true), "application/pdf"),
      ),
    ).rejects.toThrow("embedded attachments");
  });

  it("rejects encrypted or password-protected PDFs", async () => {
    await expect(
      validateUpload(
        uploadPayload(await syntheticEncryptedPdf(), "application/pdf"),
      ),
    ).rejects.toThrow(/encrypted|password-protected/i);
  });
});
