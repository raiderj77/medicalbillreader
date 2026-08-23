import type { Metadata } from "next";
import Link from "next/link";
import BillEobWorksheet from "@/components/BillEobWorksheet";

const PAGE_URL = "https://medicalbillreader.com/bill-eob-comparison-worksheet";

export const metadata: Metadata = {
  title: "Private Bill and EOB Comparison Worksheet",
  description:
    "Compare figures shown on a provider bill and Explanation of Benefits in a local-only worksheet that does not upload or save entries.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Private Bill and EOB Comparison Worksheet",
    description: "Compare bill and EOB figures locally in your browser without uploading a document.",
    url: PAGE_URL,
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

export default function BillEobComparisonWorksheetPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <article className="mx-auto max-w-6xl">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link href="/" className="font-medium text-teal-800 underline dark:text-teal-300">Home</Link>{" "}
            <span aria-hidden="true">/</span> Bill and EOB comparison worksheet
          </nav>
          <header className="mt-6 max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">No upload · no account · no payment</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">Compare a provider bill with an EOB privately</h1>
            <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
              Type only the labeled dollar figures you want to compare. Calculations happen in your browser and disappear when you leave. You do not need to enter a name, diagnosis, provider, member ID, account number, or claim number.
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Last source review: August 23, 2026</p>
          </header>

          <BillEobWorksheet />

          <section className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <h2 className="text-xl font-bold">What this worksheet cannot decide</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>It does not determine legal responsibility, coverage, coding accuracy, or whether an amount is correct.</li>
              <li>Different documents may use the same label in different calculations, and positive or negative adjustments can vary by document.</li>
              <li>A provider bill and EOB may update at different times or may not represent the same claim.</li>
              <li>Check every entered value against the source documents. A difference is a question to verify, not proof of an error.</li>
            </ul>
          </section>

          <section className="mt-8 max-w-4xl text-slate-700 dark:text-slate-300">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">What to do with a difference</h2>
            <p className="mt-3 leading-7">
              CMS advises comparing the bill and EOB, checking the dates, services, amounts, and patient-responsibility figures shown, and asking the provider, facility, or health plan about questions. Keep the original documents as the authority for your conversation.
            </p>
            <p className="mt-3">
              <a href="https://www.cms.gov/medical-bill-rights/help/guides/how-to-read-bill" rel="noreferrer" className="font-medium text-teal-800 underline dark:text-teal-300">Read CMS: How to read your medical bill</a>
            </p>
          </section>
        </article>
    </main>
  );
}
