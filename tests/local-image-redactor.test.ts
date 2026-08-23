import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import LocalImageRedactor, {
  LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED,
  isSupportedLocalRedactionFile,
  normalizeRedactionRectangle,
} from "@/components/LocalImageRedactor";
import { productConfig } from "@/config/product";

describe("disabled local image redactor foundation", () => {
  it("is fail-closed by default and makes no PDF claim", () => {
    expect(LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED).toBe(
      productConfig.features.localImageRedaction,
    );
    expect(LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED).toBe(false);
    const html = renderToStaticMarkup(
      createElement(LocalImageRedactor, { file: null }),
    );
    expect(html).toContain("not enabled");
    expect(html).not.toContain("redaction canvas");
    expect(isSupportedLocalRedactionFile({ type: "image/png" })).toBe(true);
    expect(isSupportedLocalRedactionFile({ type: "application/pdf" })).toBe(false);
  });

  it("normalizes reverse drags, clips to the canvas, and ignores tiny marks", () => {
    expect(
      normalizeRedactionRectangle({
        startX: 0.8,
        startY: 0.6,
        endX: 0.2,
        endY: 0.1,
      }),
    ).toEqual({ x: 0.2, y: 0.1, width: 0.6000000000000001, height: 0.5 });
    expect(
      normalizeRedactionRectangle({
        startX: -1,
        startY: -1,
        endX: 2,
        endY: 2,
      }),
    ).toEqual({ x: 0, y: 0, width: 1, height: 1 });
    expect(
      normalizeRedactionRectangle({
        startX: 0.1,
        startY: 0.1,
        endX: 0.1001,
        endY: 0.1001,
      }),
    ).toBeNull();
  });

  it("contains no network or telemetry call and exports an opaque flattened PNG", () => {
    const source = readFileSync("src/components/LocalImageRedactor.tsx", "utf8");
    const analyzer = readFileSync("src/components/BillAnalyzer.tsx", "utf8");
    expect(source).not.toMatch(/\bfetch\s*\(/);
    expect(source).not.toMatch(/XMLHttpRequest|sendBeacon/);
    expect(source).toContain('getContext("2d", { alpha: false })');
    expect(source).toContain('"image/png"');
    expect(source).toContain("does not copy source");
    expect(source).toContain("It does not detect every");
    expect(source).toContain("Reset image");
    expect(source).toContain("Preview final PNG");
    expect(analyzer).toContain("localImageRedactionEnabled");
    expect(analyzer).toContain("setFile(null)");
    expect(analyzer).toContain("handleFile(redactedFile)");
  });
});
