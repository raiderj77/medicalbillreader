"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { requestAnalysisWithAccessFallback } from "@/lib/analyze-access";
import BillAnalysisReport from "@/components/BillAnalysisReport";
import LocalImageRedactor, {
  LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED,
} from "@/components/LocalImageRedactor";
import type { BillAnalysisReport as BillAnalysisReportData } from "@/lib/bill-analysis-schema";
import { billAnalysisToPlainText } from "@/lib/bill-analysis-plain-text";
import { ANALYZER_REVIEW_STATUS } from "@/config/review-status";

function VerificationBadge({ variant }: { variant: "pre" | "post" }) {
  const text =
    variant === "pre"
      ? "AI-extracted analysis for informational purposes only. Always verify with your insurance company and provider before disputing any charge or making payment decisions."
      : "This analysis is informational, not medical or financial advice. For disputes or appeals, consult your insurer, your provider's billing office, or a billing advocate.";
  return (
    <div className="rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/30 px-4 py-3 text-sm text-teal-900 dark:text-teal-200 flex items-start gap-2">
      <svg
        className="w-4 h-4 mt-0.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
      <span>
        {text}{" "}
        <Link
          href="/methodology"
          className="underline font-medium hover:text-teal-800 dark:hover:text-teal-100"
        >
          How this works
        </Link>
        .
      </span>
    </div>
  );
}

function hasSubscriptionAccessHint(): boolean {
  return document.cookie
    .split("; ")
    .some((c) => c.trim() === "mbr_sub_active=1");
}

export default function BillAnalyzer({
  localImageRedactionEnabled = LOCAL_IMAGE_REDACTOR_DEFAULT_ENABLED,
}: {
  localImageRedactionEnabled?: boolean;
}) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BillAnalysisReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const [showCheckoutReturn, setShowCheckoutReturn] = useState(false);
  const [privacyAcknowledged, setPrivacyAcknowledged] = useState(false);
  const [showLocalRedactor, setShowLocalRedactor] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const fileReadGenerationRef = useRef(0);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  // One-time hint that we just came back from a successful per-use checkout.
  // Consumed by the first analysis attempt and stripped from the URL
  // immediately so it can't be reused by submitting a second bill without
  // paying again. The server independently verifies and consumes the real
  // entitlement via an httpOnly cookie, this is only a UX gate.
  const justPaidRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      justPaidRef.current = true;
      queueMicrotask(() => setShowCheckoutReturn(true));
      router.replace("/#analyzer", { scroll: false });
    }
  }, [router]);

  useEffect(() => {
    if (!result) return;
    requestAnimationFrame(() => resultHeadingRef.current?.focus());
  }, [result]);

  const handleFile = (f: File) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(f.type) || f.size > 10 * 1024 * 1024) {
      setError(
        f.size > 10 * 1024 * 1024
          ? "Files must be 10 MB or smaller."
          : "Choose a JPEG, PNG, WebP, or PDF file.",
      );
      return;
    }
    const readGeneration = ++fileReadGenerationRef.current;
    setFile(f);
    setPreview(null);
    setShowLocalRedactor(false);
    setPrivacyAcknowledged(false);
    setResult(null);
    setError(null);
    setNeedsUpgrade(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (
        readGeneration === fileReadGenerationRef.current &&
        typeof e.target?.result === "string"
      ) {
        setPreview(e.target.result);
      }
    };
    reader.readAsDataURL(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file || !preview || !privacyAcknowledged || showLocalRedactor) return;

    const hasPaidAccessHint =
      justPaidRef.current || hasSubscriptionAccessHint();

    setLoading(true);
    setError(null);
    setNeedsUpgrade(false);
    try {
      const { response: res, data, freeAccessError } =
        await requestAnalysisWithAccessFallback(
          fetch,
          {
          image: preview,
          fileType: file.type,
          processingAcknowledged: privacyAcknowledged,
          },
          hasPaidAccessHint,
        );
      if (!res.ok) {
        if (res.status === 401) {
          justPaidRef.current = false;
          setShowCheckoutReturn(false);
          if (freeAccessError) {
            throw new Error(freeAccessError);
          }
          setNeedsUpgrade(true);
          throw new Error(
            "No analysis credit is currently available. Choose an analysis option to continue.",
          );
        }
        const fallbackError = hasPaidAccessHint
          ? "The analysis could not be completed. Your paid credit was not used. Please wait two minutes and try again."
          : "The analysis could not be completed. Please wait two minutes and try again.";
        throw new Error(data.error || fallbackError);
      }
      if (!data.report) {
        throw new Error(
          "The analysis service returned an incomplete response. Please try again.",
        );
      }
      setResult(data.report);

      if (justPaidRef.current) {
        justPaidRef.current = false;
      }
      setShowCheckoutReturn(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    fileReadGenerationRef.current += 1;
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setNeedsUpgrade(false);
    setShowCheckoutReturn(false);
    setPrivacyAcknowledged(false);
    setShowLocalRedactor(false);
  };

  if (result) {
    return (
      <div id="printable-results" className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-8 overflow-hidden">
        {/* AI-Generated Analysis Badge */}
        <div className="bg-blue-600 px-6 py-3 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.59.659H9.06a2.25 2.25 0 01-1.59-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5"
            />
          </svg>
          <span className="text-white font-bold text-sm tracking-wide uppercase">
            AI-Generated Analysis
          </span>
        </div>

        <p className="border-b border-amber-300 bg-amber-50 px-6 py-3 text-sm font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          Review status: {ANALYZER_REVIEW_STATUS.label}. No independent
          medical-billing reviewer is attributed to this analyzer.
        </p>

        <div className="p-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center text-xl">
                ✅
              </div>
              <h2
                ref={resultHeadingRef}
                tabIndex={-1}
                className="text-xl font-bold text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-teal-700 dark:text-slate-100"
              >
                Your Medical Bill Explained Simply
              </h2>
            </div>
            <button
              type="button"
              onClick={reset}
              className="no-print min-h-11 text-sm text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 font-medium border border-teal-200 dark:border-teal-700 px-4 py-2 rounded-lg"
            >
              Analyze Another Bill
            </button>
          </div>
          <BillAnalysisReport report={result} />

          {/* Disclaimer */}
          <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl">
            <p className="text-amber-900 dark:text-amber-300 font-semibold text-base mb-2">
              Important Disclaimer
            </p>
            <p className="text-amber-800 dark:text-amber-400 text-sm leading-relaxed">
              This analysis was generated by artificial intelligence and is for
              informational purposes only. It does not constitute medical or
              financial advice. Always verify charges with your healthcare
              provider and insurance company before taking action.
            </p>
          </div>

          <div className="mt-4">
            <VerificationBadge variant="post" />
          </div>

          {/* Action Buttons */}
          <div className="no-print mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const text = billAnalysisToPlainText(result);
                navigator.clipboard.writeText(text).then(() => {
                  const btn = document.getElementById("copy-btn");
                  if (btn) {
                    btn.textContent = "✓ Copied!";
                    setTimeout(() => {
                      btn.textContent = "Copy Summary";
                    }, 2000);
                  }
                });
              }}
              id="copy-btn"
              className="min-h-11 px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-lg transition-colors"
            >
              Copy Summary
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              title="Print your analysis or save it as a PDF"
              className="min-h-11 px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-lg transition-colors"
            >
              Print or Save PDF
            </button>
            <button
              type="button"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator
                    .share({
                      title: "Medical Bill Reader",
                      text: "A privacy-conscious tool for explaining visible medical-bill and EOB fields.",
                      url: "https://medicalbillreader.com/",
                    })
                    .catch(() => {});
                } else {
                  navigator.clipboard
                    .writeText(
                      "Medical Bill Reader: a privacy-conscious tool for explaining visible medical-bill and EOB fields. https://medicalbillreader.com/",
                    )
                    .then(() => {
                      const btn = document.getElementById("share-btn");
                      if (btn) {
                        btn.textContent = "✓ Copied!";
                        setTimeout(() => {
                          btn.textContent = "Share";
                        }, 2000);
                      }
                    });
                }
              }}
              id="share-btn"
              className="min-h-11 px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-lg transition-colors"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="analyzer" className="mb-8 scroll-mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
      {showCheckoutReturn && (
        <div
          className="mb-5 rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-100"
          role="status"
        >
          <p className="font-semibold">Continue in the bill analyzer</p>
          <p className="mt-1">
            Select a bill or EOB to continue. If you selected a document before
            checkout, choose it again. Any paid access is verified securely when
            you submit.
          </p>
        </div>
      )}
      <div className="mb-5">
        <VerificationBadge variant="pre" />
      </div>
      <p className="mb-5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Review status: {ANALYZER_REVIEW_STATUS.label}. No independent
        medical-billing reviewer is attributed to this analyzer.
      </p>
      {!file ? (
        <>
        <button
          type="button"
          aria-describedby="upload-formats upload-redaction upload-privacy"
          className={`w-full rounded-xl border-2 border-dashed p-7 text-center transition-all focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 sm:p-12 ${
            isDragging
              ? "border-teal-400 bg-teal-50 dark:bg-teal-900/20"
              : "border-slate-300 dark:border-slate-600 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <div className="text-5xl mb-4">📄</div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Drop your bill here or click to upload
          </p>
          <p id="upload-formats" className="mb-3 text-sm text-slate-700 dark:text-slate-300">
            JPEG, PNG, WebP, or PDF · 10 MB maximum
          </p>
          <p id="upload-redaction" className="mx-auto mb-3 max-w-md text-xs font-medium text-slate-800 dark:text-slate-200">
            Before choosing a file, remove names, member IDs, account numbers,
            dates of birth, addresses, barcodes, and other identifiers you do
            not need explained.
          </p>
          <p id="upload-privacy" className="mx-auto max-w-md text-xs text-slate-700 dark:text-slate-300">
            Your document is transmitted securely to Anthropic solely to
            generate the analysis. Medical Bill Reader does not intentionally
            save bill documents in its own database or use them for advertising.
          </p>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          className="sr-only"
          aria-label="Upload a medical bill"
          onChange={(e) =>
            e.target.files?.[0] && handleFile(e.target.files[0])
          }
        />
        {error && (
          <div
            className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}
        </>
      ) : (
        <div>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center text-xl">
                📄
              </div>
              <div className="min-w-0">
                <p className="break-words font-medium text-slate-800 dark:text-slate-200">
                  {file.name}
                </p>
                <p className="text-sm text-slate-600">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <button
              onClick={reset}
              className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              Remove
            </button>
          </div>

          {preview && file.type.startsWith("image/") && (
            <div className="mb-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview of uploaded medical bill"
                className="max-h-64 object-contain"
              />
            </div>
          )}

          {localImageRedactionEnabled && file.type.startsWith("image/") && (
            <div className="mb-6">
              {!showLocalRedactor ? (
                <button
                  type="button"
                  onClick={() => {
                    setPrivacyAcknowledged(false);
                    setShowLocalRedactor(true);
                  }}
                  className="min-h-11 rounded-lg border border-teal-300 px-4 py-2 text-sm font-semibold text-teal-900 dark:border-teal-700 dark:text-teal-200"
                >
                  Redact this image locally
                </button>
              ) : (
                <LocalImageRedactor
                  file={file}
                  enabled={localImageRedactionEnabled}
                  onUseRedactedFile={(redactedFile) => {
                    // Remove the original from analyzer state before validating
                    // and selecting the flattened local PNG.
                    fileReadGenerationRef.current += 1;
                    setFile(null);
                    setPreview(null);
                    setShowLocalRedactor(false);
                    handleFile(redactedFile);
                  }}
                  onCancel={() => setShowLocalRedactor(false)}
                />
              )}
            </div>
          )}

          {/* Upload privacy notice */}
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              🔒 Your document will be transmitted securely to Anthropic solely
              to generate this analysis. It is not sold or shared for
               advertising, and Medical Bill Reader does not intentionally store
               the document in its own database. Infrastructure providers may
               process request data under their terms. Anthropic&apos;s published
               policy says standard API inputs and outputs are automatically
               deleted within 30 days, but content flagged by automated trust and
               safety systems may be retained for up to two years and associated
               classification scores for up to seven years. Legal and other
               published exceptions may also apply. Medical Bill Reader does not
               claim a zero-data-retention agreement or Business Associate
               Agreement. Read{" "}
               <a
                 href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="font-semibold text-teal-800 underline dark:text-teal-300"
               >
                 Anthropic&apos;s retention policy
               </a>{" "}
               and our{" "}
               <Link
                href="/consumer-health-data-privacy"
                className="font-semibold text-teal-800 underline dark:text-teal-300"
              >
                Consumer Health Data Privacy Notice
              </Link>
              .
            </p>
          </div>

          <div className="mb-5 rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-950/30">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-800 dark:text-slate-200">
              <input
                type="checkbox"
                checked={privacyAcknowledged}
                onChange={(event) =>
                  setPrivacyAcknowledged(event.currentTarget.checked)
                }
                className="mt-1 h-5 w-5 shrink-0 accent-teal-700"
              />
              <span>
                I consent to this document being sent to Anthropic to generate
                the report I requested. I reviewed the privacy notice and
                removed identifiers I do not want processed. Medical Bill Reader
                is a direct-to-consumer tool, not a HIPAA-covered service.
              </span>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm" role="alert">
              <p>{error}</p>
              {needsUpgrade && (
                <Link
                  href="/pricing"
                  className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
                >
                  See analysis options
                </Link>
              )}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !privacyAcknowledged || showLocalRedactor}
            aria-busy={loading}
            aria-describedby="upload-privacy"
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Analyzing your bill…
              </span>
            ) : (
              "Explain My Bill →"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
