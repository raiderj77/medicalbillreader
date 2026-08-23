"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { productConfig } from "@/config/product";

export const LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED =
  productConfig.features.localImageRedaction;

const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_DIMENSION = 10_000;
const MAX_PIXELS = 25_000_000;

export type RedactionRectangle = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type DraftRectangle = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

export function normalizeRedactionRectangle(
  draft: DraftRectangle,
): RedactionRectangle | null {
  const x = Math.max(0, Math.min(1, Math.min(draft.startX, draft.endX)));
  const y = Math.max(0, Math.min(1, Math.min(draft.startY, draft.endY)));
  const right = Math.max(0, Math.min(1, Math.max(draft.startX, draft.endX)));
  const bottom = Math.max(0, Math.min(1, Math.max(draft.startY, draft.endY)));
  const width = right - x;
  const height = bottom - y;
  return width >= 0.002 && height >= 0.002
    ? { x, y, width, height }
    : null;
}

export function isSupportedLocalRedactionFile(file: Pick<File, "type">): boolean {
  return SUPPORTED_TYPES.has(file.type);
}

function safeOutputName(name: string): string {
  const stem = name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-");
  return `${stem.slice(0, 80) || "image"}-redacted.png`;
}

function percent(value: number): string {
  return String(Math.round(value * 1000) / 10);
}

function drawCanvas(
  canvas: HTMLCanvasElement,
  bitmap: ImageBitmap,
  rectangles: readonly RedactionRectangle[],
  draft: DraftRectangle | null,
): void {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("canvas_unavailable");
  context.globalCompositeOperation = "source-over";
  context.globalAlpha = 1;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000000";
  for (const rectangle of rectangles) {
    context.fillRect(
      rectangle.x * canvas.width,
      rectangle.y * canvas.height,
      rectangle.width * canvas.width,
      rectangle.height * canvas.height,
    );
  }
  const pending = draft ? normalizeRedactionRectangle(draft) : null;
  if (pending) {
    context.fillRect(
      pending.x * canvas.width,
      pending.y * canvas.height,
      pending.width * canvas.width,
      pending.height * canvas.height,
    );
  }
}

type LocalImageRedactorProps = {
  file: File | null;
  enabled?: boolean;
  onUseRedactedFile?: (file: File) => void;
  onCancel?: () => void;
};

export default function LocalImageRedactor({
  file,
  enabled = LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED,
  onUseRedactedFile,
  onCancel,
}: LocalImageRedactorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const draftRef = useRef<DraftRectangle | null>(null);
  const [rectangles, setRectangles] = useState<RedactionRectangle[]>([]);
  const [zoom, setZoom] = useState(100);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [finalPreviewUrl, setFinalPreviewUrl] = useState<string | null>(null);
  const [keyboardRectangle, setKeyboardRectangle] = useState({
    x: "10",
    y: "10",
    width: "20",
    height: "8",
  });
  const unsupportedFileMessage =
    enabled && file && !isSupportedLocalRedactionFile(file)
      ? "Local redaction supports JPEG, PNG, and WebP images only. It does not support PDF files."
      : "";

  const redraw = useCallback(
    (draft: DraftRectangle | null = null) => {
      const canvas = canvasRef.current;
      const bitmap = bitmapRef.current;
      if (canvas && bitmap) drawCanvas(canvas, bitmap, rectangles, draft);
    },
    [rectangles],
  );

  useEffect(() => {
    redraw(draftRef.current);
  }, [redraw]);

  useEffect(() => {
    if (!enabled || !file) return;
    if (!isSupportedLocalRedactionFile(file)) return;
    let active = true;
    createImageBitmap(file)
      .then((bitmap) => {
        if (!active) {
          bitmap.close();
          return;
        }
        if (
          bitmap.width < 1 ||
          bitmap.height < 1 ||
          bitmap.width > MAX_DIMENSION ||
          bitmap.height > MAX_DIMENSION ||
          bitmap.width * bitmap.height > MAX_PIXELS
        ) {
          bitmap.close();
          setError("This image is too large for local redaction.");
          return;
        }
        bitmapRef.current?.close();
        bitmapRef.current = bitmap;
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        drawCanvas(canvas, bitmap, [], null);
        setReady(true);
      })
      .catch(() => setError("This image could not be opened for local redaction."));
    return () => {
      active = false;
      bitmapRef.current?.close();
      bitmapRef.current = null;
    };
  }, [enabled, file]);

  useEffect(
    () => () => {
      if (finalPreviewUrl) URL.revokeObjectURL(finalPreviewUrl);
    },
    [finalPreviewUrl],
  );

  if (!enabled) {
    return (
      <p role="note" className="text-sm text-slate-700 dark:text-slate-300">
        The local image-redaction tool is not enabled. Remove unnecessary
        identifiers before selecting a file.
      </p>
    );
  }

  function point(event: ReactPointerEvent<HTMLCanvasElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
      y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)),
    };
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!ready) return;
    const start = point(event);
    draftRef.current = {
      startX: start.x,
      startY: start.y,
      endX: start.x,
      endY: start.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!draftRef.current) return;
    const end = point(event);
    draftRef.current = { ...draftRef.current, endX: end.x, endY: end.y };
    redraw(draftRef.current);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!draftRef.current) return;
    const rectangle = normalizeRedactionRectangle(draftRef.current);
    draftRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (rectangle) {
      setFinalPreviewUrl(null);
      setRectangles((current) => [...current, rectangle]);
    }
    else redraw(null);
  }

  function addKeyboardRectangle() {
    const values = Object.values(keyboardRectangle).map(Number);
    if (values.some((value) => !Number.isFinite(value))) {
      setError("Enter four valid percentages for the redaction area.");
      return;
    }
    const [x, y, width, height] = values.map((value) => value / 100);
    const rectangle = normalizeRedactionRectangle({
      startX: x,
      startY: y,
      endX: x + width,
      endY: y + height,
    });
    if (!rectangle) {
      setError("The redaction area must have a positive width and height.");
      return;
    }
    setError("");
    setFinalPreviewUrl(null);
    setRectangles((current) => [...current, rectangle]);
  }

  async function createFlattenedFile(): Promise<File> {
    const canvas = canvasRef.current;
    if (!canvas || !ready || !file) throw new Error("image_not_ready");
    redraw(null);
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error("png_export_failed"))),
        "image/png",
      ),
    );
    // Canvas export creates one opaque PNG raster and does not copy source
    // EXIF/XMP metadata or preserve editable overlay objects.
    return new File([blob], safeOutputName(file.name), { type: "image/png" });
  }

  async function useRedactedImage() {
    try {
      onUseRedactedFile?.(await createFlattenedFile());
    } catch {
      setError("The flattened PNG could not be created.");
    }
  }

  async function downloadRedactedImage() {
    try {
      const output = await createFlattenedFile();
      const url = URL.createObjectURL(output);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = output.name;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("The flattened PNG could not be created.");
    }
  }

  async function previewFlattenedImage() {
    try {
      const output = await createFlattenedFile();
      const url = URL.createObjectURL(output);
      setFinalPreviewUrl(url);
    } catch {
      setError("The flattened PNG could not be created.");
    }
  }

  function resetImage() {
    setRectangles([]);
    setZoom(100);
    setKeyboardRectangle({ x: "10", y: "10", width: "20", height: "8" });
    setFinalPreviewUrl(null);
    setError("");
  }

  return (
    <section aria-labelledby="local-redactor-heading" className="space-y-4">
      <div>
        <h3 id="local-redactor-heading" className="font-bold text-slate-900 dark:text-slate-100">
          Redact this image on this device
        </h3>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          Draw solid black boxes over unnecessary identifiers. This tool is for
          JPEG, PNG, and WebP images only—not PDFs. It does not detect every
          identifier; inspect the entire flattened image before using it.
        </p>
      </div>
      {(unsupportedFileMessage || error) && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{unsupportedFileMessage || error}</p>}
      <div className="overflow-auto rounded-lg border border-slate-300 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-900">
        <canvas
          ref={canvasRef}
          aria-label="Image redaction canvas. Drag to add a solid black redaction."
          className="h-auto max-w-none touch-none bg-white"
          style={{ width: `${zoom}%` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
      <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        Zoom: {zoom}%
        <input
          type="range"
          min="50"
          max="200"
          step="10"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="mt-1 block w-full"
        />
      </label>
      <fieldset className="rounded-lg border border-slate-300 p-3 dark:border-slate-700">
        <legend className="px-1 text-sm font-semibold">Keyboard redaction area (percent)</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(["x", "y", "width", "height"] as const).map((key) => (
            <label key={key} className="text-xs capitalize">
              {key}
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={keyboardRectangle[key]}
                onChange={(event) =>
                  setKeyboardRectangle((current) => ({ ...current, [key]: event.target.value }))
                }
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1 dark:border-slate-600 dark:bg-slate-900"
              />
            </label>
          ))}
        </div>
        <button type="button" onClick={addKeyboardRectangle} disabled={!ready} className="mt-3 rounded border px-3 py-2 text-sm font-semibold disabled:opacity-50">
          Add redaction area
        </button>
      </fieldset>
      <p className="text-xs text-slate-600 dark:text-slate-400" aria-live="polite">
        {rectangles.length} redaction {rectangles.length === 1 ? "area" : "areas"}. Last area: {rectangles.length ? `${percent(rectangles.at(-1)!.width)}% wide by ${percent(rectangles.at(-1)!.height)}% high` : "none"}.
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => { setFinalPreviewUrl(null); setRectangles((current) => current.slice(0, -1)); }} disabled={!rectangles.length} className="rounded border px-3 py-2 text-sm disabled:opacity-50">Undo</button>
        <button type="button" onClick={() => { setFinalPreviewUrl(null); setRectangles([]); }} disabled={!rectangles.length} className="rounded border px-3 py-2 text-sm disabled:opacity-50">Clear all</button>
        <button type="button" onClick={resetImage} disabled={!ready} className="rounded border px-3 py-2 text-sm disabled:opacity-50">Reset image</button>
        <button type="button" onClick={previewFlattenedImage} disabled={!ready || !rectangles.length} className="rounded border px-3 py-2 text-sm font-semibold disabled:opacity-50">Preview final PNG</button>
        <button type="button" onClick={downloadRedactedImage} disabled={!ready || !rectangles.length} className="rounded border px-3 py-2 text-sm font-semibold disabled:opacity-50">Download flattened PNG</button>
        <button type="button" onClick={useRedactedImage} disabled={!ready || !rectangles.length || !onUseRedactedFile} className="rounded bg-teal-800 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Use flattened PNG</button>
        {onCancel && <button type="button" onClick={onCancel} className="rounded border px-3 py-2 text-sm">Cancel</button>}
      </div>
      {finalPreviewUrl && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={finalPreviewUrl} alt="Final flattened redacted PNG preview" className="max-h-80 w-auto max-w-full bg-white" />
          <p className="mt-2 text-xs font-medium text-amber-900 dark:text-amber-200">
            Final preview: inspect the whole image. Only covered pixels were
            replaced; any visible information outside the black boxes remains.
          </p>
        </div>
      )}
      <p role="note" className="text-xs font-medium text-amber-800 dark:text-amber-300">
        Black boxes permanently replace covered pixels in the exported PNG, but
        information outside those boxes remains. Review the export before upload.
      </p>
    </section>
  );
}
