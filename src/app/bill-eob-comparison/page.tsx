import type { Metadata } from "next";
import Link from "next/link";
import {
  COMPARISON_CONSENT_STATEMENTS,
  COMPARISON_LIMITS,
  COMPARISON_RELEASE_GATES,
  comparisonAvailability,
} from "@/config/comparison-readiness";

export const metadata: Metadata = {
  title: "Bill and EOB AI Comparison — Not Yet Available",
  description:
    "Release status and privacy gates for the planned two-document bill and EOB comparison.",
  alternates: { canonical: "https://medicalbillreader.com/bill-eob-comparison" },
  robots: { index: false, follow: true },
};

export default function BillEobComparisonPage() {
  const availability = comparisonAvailability();
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
        <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link href="/" className="font-medium text-teal-800 underline dark:text-teal-300">Home</Link>{" "}
            <span aria-hidden="true">/</span> Planned bill and EOB comparison
          </nav>
          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">Not available for purchase or upload</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Two-document AI comparison is gated off</h1>
          <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
            Medical Bill Reader will not accept two documents or sell the planned $9.99 comparison until its technical, privacy, professional-review, evaluation, and payment gates are complete. The current status is <code>{availability.reason}</code>.
          </p>
          <Link href="/bill-eob-comparison-worksheet" className="mt-6 inline-flex rounded-lg bg-teal-800 px-5 py-3 font-semibold text-white">
            Use the free local worksheet instead
          </Link>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Required release gates</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              {Object.entries(COMPARISON_RELEASE_GATES).map(([gate, passed]) => (
                <li key={gate}>{gate.replace(/([A-Z])/g, " $1")}: {passed ? "complete" : "not complete"}</li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Consent that would be required</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              {COMPARISON_CONSENT_STATEMENTS.map((statement) => <li key={statement}>{statement}</li>)}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Planned technical limits</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Exactly {COMPARISON_LIMITS.requiredDocumentSlots} document slots; no third document.</li>
              <li>JPEG, PNG, WebP, or unencrypted PDF only.</li>
              <li>10 MB per file and 18 MB combined decoded-file limit.</li>
              <li>12 pages per PDF and 20 PDF pages combined; no silent truncation.</li>
              <li>A single-analysis credit cannot authorize this comparison.</li>
            </ul>
          </section>
        </article>
    </main>
  );
}
