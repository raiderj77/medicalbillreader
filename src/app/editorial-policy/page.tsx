import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://medicalbillreader.com/editorial-policy";

export const metadata: Metadata = {
  title: "Editorial Policy and Review Standards",
  description:
    "Who creates Medical Bill Reader content, how primary sources and AI are used, and how corrections are handled.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Editorial Policy and Review Standards",
    description:
      "Who creates Medical Bill Reader content, how primary sources and AI are used, and how corrections are handled.",
    url: PAGE_URL,
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

export default function EditorialPolicyPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950"
    >
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <Link
            href="/"
            className="font-medium text-teal-800 underline dark:text-teal-300"
          >
            Home
          </Link>{" "}
          <span aria-hidden="true">/</span> Editorial Policy
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
          Editorial Policy and Review Standards
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Last reviewed August 2, 2026
        </p>

        <div className="mt-9 space-y-9 leading-7">
          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Who is responsible
            </h2>
            <p className="mt-3">
              Medical Bill Reader was created and is published by Jason Ramirez,
              founder of Your Friendly Developer and an experienced web
              professional. He is not presented as a physician, attorney,
              insurer, financial adviser, or certified medical coder or billing
              specialist. That scope is stated because readers should not mistake
              product or source-review experience for professional health, legal,
              insurance, or billing credentials.
            </p>
            <p className="mt-3">
              Learn more on the{" "}
              <Link
                href="/about"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                About page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Source hierarchy
            </h2>
            <p className="mt-3">
              Guides prioritize current primary sources: CMS, HHS,
              HealthCare.gov, CFPB, IRS, statutes and regulations, and the
              official documentation of the technology providers used by the
              service. A claim about a deadline, eligibility rule, data practice,
              or payment flow should link to the controlling or most authoritative
              source available. When rules vary by plan, state, provider, or date,
              the article says so rather than presenting a universal answer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              How AI is used
            </h2>
            <p className="mt-3">
              The analyzer uses Anthropic&apos;s API to generate a first-pass report
              from the document a user submits. AI output is labeled and must be
              checked against the original bill, EOB, provider, and insurer. The
              tool is instructed not to invent illegible values or determine that
              a charge is fraudulent, legally invalid, clinically improper, or
              correctly coded. It cannot see claim contracts, clinical records,
              payer edits, or facts outside the uploaded document.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Reviews, dates, and corrections
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                Published and modified dates change only when the page receives a
                substantive review or update.
              </li>
              <li>
                Time-sensitive statements are checked against the linked official
                source; readers should still verify current deadlines on their own
                notice or plan documents.
              </li>
              <li>
                Unsupported prevalence, savings, accuracy, and outcome claims are
                not published.
              </li>
              <li>
                Material errors are corrected promptly and the review date is
                updated. Pages that cannot be kept accurate are revised, noindexed,
                redirected, or removed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Commercial independence
            </h2>
            <p className="mt-3">
              Current guides do not contain paid placements or affiliate links.
              Any future sponsorship or affiliate relationship must be labeled
              near the recommendation and may not influence factual conclusions.
              Advertising, if introduced, must remain off the analyzer and other
              sensitive or transactional pages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Report a correction
            </h2>
            <p className="mt-3">
              Email{" "}
              <a
                href="mailto:support@medicalbillreader.com"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                support@medicalbillreader.com
              </a>{" "}
              with the page URL, the statement at issue, and an authoritative
              source. Do not include a medical bill, diagnosis, member ID, or
              other sensitive information in ordinary email.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
