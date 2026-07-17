"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trackConversion } from "@/lib/analytics";

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

function hasActiveSubscriptionCookie(): boolean {
  return document.cookie
    .split("; ")
    .some((c) => c.trim() === "mbr_sub_active=1");
}

export default function BillAnalyzer() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  // One-time hint that we just came back from a successful per-use checkout.
  // Consumed by the first analysis attempt and stripped from the URL
  // immediately so it can't be reused by submitting a second bill without
  // paying again. The server independently verifies and consumes the real
  // entitlement via an httpOnly cookie, this is only a UX gate.
  const [justPaid, setJustPaid] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      setJustPaid(true);
      trackConversion("purchase_completed");
      router.replace("/", { scroll: false });
    }
  }, [router]);

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
    setFile(f);
    trackConversion("upload_started", { file_type: f.type });
    setResult(null);
    setError(null);
    setNeedsUpgrade(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      trackConversion("upload_completed", { file_type: f.type });
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
    if (!file || !preview) return;

    const isPaid = justPaid || hasActiveSubscriptionCookie();

    setLoading(true);
    setError(null);
    setNeedsUpgrade(false);
    try {
      if (!isPaid) {
        const accessResponse = await fetch("/api/entitlement/free", {
          method: "POST",
        });
        if (!accessResponse.ok) {
          const accessData = await accessResponse.json();
          throw new Error(
            accessData.error || "Free analysis access is unavailable.",
          );
        }
      }
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview, fileType: file.type }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          setNeedsUpgrade(true);
          throw new Error(
            "Your free analysis has already been used. Choose a paid option to analyze another bill.",
          );
        }
        throw new Error(data.error || "Something went wrong");
      }
      setResult(data.result);
      trackConversion("analysis_delivered");

      if (justPaid) {
        setJustPaid(false);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setNeedsUpgrade(false);
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

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/40 rounded-lg flex items-center justify-center text-xl">
                ✅
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Your Medical Bill Explained Simply
              </h2>
            </div>
            <button
              onClick={reset}
              className="no-print text-sm text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 font-medium border border-teal-200 dark:border-teal-700 px-4 py-2 rounded-lg"
            >
              Analyze Another Bill
            </button>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {result.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-6 mb-2"
                  >
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("**") && line.endsWith("**")) {
                return (
                  <p
                    key={i}
                    className="font-semibold text-slate-700 dark:text-slate-300 mt-4"
                  >
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li
                    key={i}
                    className="text-slate-600 dark:text-slate-600 ml-4 list-disc"
                  >
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.trim() === "") return <br key={i} />;
              return (
                <p
                  key={i}
                  className="text-slate-600 dark:text-slate-600 leading-relaxed"
                >
                  {line}
                </p>
              );
            })}
          </div>

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
              onClick={() => {
                const text = result
                  .split("\n")
                  .map((line) => {
                    if (line.startsWith("## "))
                      return line.replace("## ", "") + ":";
                    if (line.startsWith("**") && line.endsWith("**"))
                      return line.replace(/\*\*/g, "");
                    if (line.startsWith("- "))
                      return "  • " + line.replace("- ", "");
                    return line;
                  })
                  .join("\n");
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
              className="px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-lg transition-colors"
            >
              Copy Summary
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              title="Print your analysis or save it as a PDF"
              className="px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-lg transition-colors"
            >
              Print or Save PDF
            </button>
            <button
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator
                    .share({
                      title: "Medical Bill Analysis",
                      text: "I analyzed my medical bill at MedicalBillReader.com",
                      url: window.location.href,
                    })
                    .catch(() => {});
                } else {
                  navigator.clipboard
                    .writeText(
                      "I analyzed my medical bill at MedicalBillReader.com " +
                        window.location.href,
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
              className="px-4 py-2 text-sm font-medium text-teal-800 dark:text-teal-300 hover:text-teal-800 dark:hover:text-teal-300 border border-teal-200 dark:border-teal-700 rounded-lg transition-colors"
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
      <div className="mb-5">
        <VerificationBadge variant="pre" />
      </div>
      {!file ? (
        <>
        <button
          type="button"
          aria-describedby="upload-formats upload-privacy"
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
              className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
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

          {/* Upload privacy notice */}
          <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
            <p className="text-xs text-slate-700 dark:text-slate-300">
              🔒 Your document will be transmitted securely to Anthropic solely
              to generate this analysis. It is not sold or shared for
              advertising, and Medical Bill Reader does not intentionally store
              the document in its own database. Infrastructure providers may
              process limited request data under their own terms.
            </p>
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
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-teal-400 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
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
