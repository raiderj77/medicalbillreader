import { describe, expect, it } from "vitest";
import { MAX_FILE_BYTES, UploadValidationError, validateUpload } from "@/lib/upload-validation";

describe("strict upload validation", () => {
  it("rejects unsupported file types", () => {
    expect(() => validateUpload({ image: "data:text/plain;base64,SGVsbG8=", fileType: "text/plain" })).toThrow("Only JPEG, PNG, WebP, and PDF");
  });
  it("rejects malformed base64", () => {
    expect(() => validateUpload({ image: "data:image/png;base64,not_base64!!", fileType: "image/png" })).toThrow(UploadValidationError);
  });
  it("rejects oversized decoded files", () => {
    const data = Buffer.alloc(MAX_FILE_BYTES + 1).toString("base64");
    expect(() => validateUpload({ image: `data:image/png;base64,${data}`, fileType: "image/png" })).toThrow("10 MB");
  });
  it("rejects MIME labels that do not match file signatures", () => {
    expect(() => validateUpload({ image: "data:image/png;base64,JVBERi0=", fileType: "image/png" })).toThrow("declared file type");
  });
});
