import type { Metadata } from "next";
import Link from "next/link";
import { getStatsSnapshot } from "@/lib/analysis-stats";

export const dynamic = "force-dynamic";

const PAGE_URL = "https://medicalbillreader.com/stats";
const TODAY = new Date().toISOString().substring(0, 10);

const FILE_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "JPEG image",
  "image/jpg": "JPEG image",
  "image/png": "PNG image",
  "image/webp": "WebP image",
  unknown: "Unknown",
};

export const metadata: Metadata = {
  title: "Analysis Stats: What We've Seen on Real Medical Bills",
  description:
    "Aggregate counts from real bill analyses on Medical Bill Reader: file type mix, which code systems show up most often, and how often issues are flagged. No bill content is stored.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Analysis Stats: What We've Seen on Real Medical Bills",
    description:
      "First-party aggregate counts from medical bill analyses. No bill content stored.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function StatsPage() {
  const snapshot = getStatsSnapshot();
  const hasData = snapshot.totalAnalyses > 0;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Analysis Stats: What We've Seen on Real Medical Bills",
    description:
      "Aggregate counts from real medical bill analyses, including file type mix, code system mention rates, and how often the model flags issues to review.",
    datePublished: "2026-04-26",
    dateModified: TODAY,
    author: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: "https://medicalbillreader.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: "https://medicalbillreader.com",
    },
    mainEntityOfPage: PAGE_URL,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
      { "@type": "ListItem", position: 2, name: "Stats", item: PAGE_URL },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6"
      >
        <Link href="/" className="hover:text-teal-800 dark:hover:text-teal-400">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-600 dark:text-gray-300">Stats</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
        What We&apos;ve Seen on Real Medical Bills
      </h1>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Last updated: {TODAY}
      </p>

      <div
        role="note"
        className="mb-8 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 text-sm text-amber-800 dark:text-amber-300"
      >
        <strong>Disclaimer:</strong> The numbers below describe what the
        analyzer&apos;s output looks like in aggregate. They are not medical or
        financial advice and do not characterize the legal or clinical accuracy
        of any specific bill.
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
          How these numbers are produced
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          When a bill is analyzed, the file type and a few aggregate signals
          from the response text are incremented in process memory. The bill
          file, the response text, and any identifying detail are never
          stored. Code system mentions are detected by simple regex over the
          response (counting whether the AI named CPT, HCPCS, ICD-10, NDC, DRG,
          a modifier, or a revenue code), so these are heuristic counts, not a
          certified audit. Counts reset to zero on each deployment of the
          application, so totals below cover the period since the most recent
          deploy.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Total analyses
        </h2>
        {hasData ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <p className="text-4xl font-bold text-teal-800 dark:text-teal-300 mb-1">
              {snapshot.totalAnalyses.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Bills analyzed since{" "}
              {new Date(snapshot.startedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              .
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Awaiting first analyses since the most recent deploy. Stats will
              populate as the tool is used.
            </p>
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          File type mix
        </h2>
        {hasData && snapshot.byFileType.length > 0 ? (
          <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">File type</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Count</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Share</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.byFileType.map((row) => (
                  <tr key={row.fileType} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {FILE_TYPE_LABELS[row.fileType] || row.fileType}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.count}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-600">
            No file type data yet for the current deploy window.
          </p>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Code systems mentioned in analyses
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          The percentage of analyses where the AI response named each coding
          system at least once. Detected by regex over the response text, so
          treat these as approximate. For definitions of each code system, see
          the{" "}
          <Link href="/codes-explained" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
            codes explained
          </Link>{" "}
          page.
        </p>
        {hasData && snapshot.codeMentions.length > 0 ? (
          <div className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Code system</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Mentioned</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">Rate</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.codeMentions.map((row) => (
                  <tr key={row.code} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.code}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.count}</td>
                    <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300 tabular-nums">{row.percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-600">
            No code mention data yet for the current deploy window.
          </p>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          How often issues were flagged
        </h2>
        {hasData ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {snapshot.issuesFlaggedPercent}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Of analyses where the &quot;Potential Issues to Review&quot;
              section contained substantive content rather than a no-issues
              statement. Heuristic, based on text length and a small set of
              negation phrases.
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-600">
            Awaiting first analyses to compute issue flag rate.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-5 py-4 mb-8">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
          What is NOT stored
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          The bill file, the response text, dollar amounts, dates of service,
          provider names, patient identifiers, and IP addresses are never
          written to any store. Only the per-deploy in-memory counters above
          are kept, and they reset on the next deploy. For details on how
          uploads are handled end to end, see{" "}
          <Link href="/methodology" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
            the methodology page
          </Link>
          .
        </p>
      </section>

      <section className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-600">
        <p>
          Related:{" "}
          <Link href="/methodology" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
            Methodology
          </Link>
          {" · "}
          <Link href="/codes-explained" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
            Codes explained
          </Link>
          {" · "}
          <Link href="/" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
            Analyze a bill
          </Link>
        </p>
      </section>
    </main>
  );
}
