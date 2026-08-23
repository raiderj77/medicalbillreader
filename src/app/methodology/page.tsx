import type { Metadata } from "next";
import Link from "next/link";
import { METHODOLOGY_REVIEW_STATUS } from "@/config/review-status";

export const metadata: Metadata = {
  title: "Methodology: How Medical Bill Reader Works",
  description:
    "How Medical Bill Reader processes uploaded bills, what the AI is asked to organize, how providers handle data, and what the tool cannot determine.",
  keywords: [
    "medical bill reader methodology",
    "how medical bill AI works",
    "medical bill analysis",
    "CPT ICD-10 HCPCS",
    "Claude API",
  ],
  alternates: { canonical: "https://medicalbillreader.com/methodology" },
  robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
  openGraph: {
    title: "Methodology: How Medical Bill Reader Works",
    description:
      "How the analyzer works, what it identifies, how bill data is handled, and what it cannot do.",
    url: "https://medicalbillreader.com/methodology",
    type: "article",
  },
};

const PAGE_URL = "https://medicalbillreader.com/methodology";
const LAST_REVIEWED = "2026-08-23";

export default function MethodologyPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Methodology: How Medical Bill Reader Works",
    description:
      "How Medical Bill Reader analyzes uploaded medical bills, which AI model powers it, what it identifies, how bill data is handled, and its honest limits.",
    datePublished: "2026-04-26",
    dateModified: LAST_REVIEWED,
    author: {
      "@type": "Person",
      name: "Jason Ramirez",
      jobTitle: "Founder of Your Friendly Developer",
      url: "https://medicalbillreader.com/about",
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
      { "@type": "ListItem", position: 2, name: "Methodology", item: PAGE_URL },
    ],
  };

  return (
    <main id="main-content" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
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
        <span className="text-gray-600 dark:text-gray-300">Methodology</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
        Methodology: How Medical Bill Reader Works
      </h1>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Last reviewed: August 23, 2026. Written by{" "}
        <Link href="/about" className="underline underline-offset-2">
          Jason Ramirez
        </Link>
        , a web professional and product founder, not a medical, legal,
        insurance, coding, or billing professional. See the{" "}
        <Link href="/editorial-policy" className="underline underline-offset-2">
          editorial policy
        </Link>
        .
      </p>
      <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
        Review status: {METHODOLOGY_REVIEW_STATUS.label}. No independent
        medical-billing or coding reviewer is attributed to this methodology.
      </p>

      <div
        role="note"
        className="mb-8 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 text-sm text-amber-800 dark:text-amber-300"
      >
        <strong>Disclaimer:</strong> This page describes how the tool works. The
        tool itself, and everything described below, is for informational
        purposes only. It is not financial or medical advice and does not
        replace consultation with your insurer, provider, or a qualified
        billing professional.
      </div>

      <article className="prose-medical text-gray-700 dark:text-gray-300 leading-relaxed">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          What the analyzer does
        </h2>
        <p>
          Medical Bill Reader accepts an uploaded medical bill or Explanation
          of Benefits document, sends it to an AI model for analysis, and
          returns a validated report rendered in seven fixed sections: document
          type, visible fields, amounts shown, visible codes, items to verify,
          questions and next steps, and limitations. The server rejects output
          that does not match the report schema. The page renders fixed React
          fields rather than model-generated HTML, links, or Markdown. It does
          not determine a final amount due or establish what the user legally
          owes.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          What model powers the analysis
        </h2>
        <p>
          The analyzer calls the Anthropic Claude API. The current model is{" "}
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm">
            claude-sonnet-4-6
          </code>
          , Anthropic&apos;s general-purpose multimodal model. The API request
          is made server-side from a Next.js API route. The Anthropic API key
          is read from a Vercel environment variable and is never embedded in
          client code.
        </p>
        <p>
          The model receives the uploaded file (image or PDF) plus a system
          instruction that treats document text as untrusted data and a strict
          JSON schema for the report fields. It is told to act as a cautious
          document explainer, not as a clinician, insurer, attorney, coder, or
          billing specialist. It does not look up codes against a live
          authoritative database, read your plan documents, or access records
          beyond the file you submit.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          What the analyzer identifies
        </h2>
        <p>The model is asked to surface the items most useful to a patient:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Visible code labels</strong> such as CPT, HCPCS Level II,
            ICD-10-CM, and NDC when legible. The analyzer does not provide an
            official descriptor or an authoritative code lookup. The current
            release reports only the legible code string and system label;
            descriptions remain withheld while reuse rights are unresolved.
          </li>
          <li>
            <strong>Service dates and provider information</strong> as printed
            on the bill.
          </li>
          <li>
            <strong>Charge structure</strong>: total charges, the
            insurer-allowed or negotiated amount, plan payment, and patient
            responsibility (deductible, coinsurance, copay).
          </li>
          <li>
            <strong>Items to verify</strong>: exact-looking duplicates, visible
            mismatches, missing or unclear fields, unfamiliar services, or
            figures that do not reconcile from the document alone. These are
            questions, not findings that a charge, code, coverage decision, or
            party is wrong.
          </li>
        </ul>
        <p>
          For a glossary of the specific code systems and abbreviations the
          analyzer references, see the{" "}
          <Link href="/codes-explained" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
            codes explained
          </Link>{" "}
          page.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          How bill data is handled
        </h2>
        <p>
          Medical bills contain sensitive personal and health information.
          Handling reflects that:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Server-side processing</strong>: the file is sent over
            HTTPS to a Next.js API route on Vercel, which forwards the content
            to the Anthropic API and returns the response.
          </li>
          <li>
            <strong>No persistence</strong>: the bill content is held in memory
            only for the duration of a single request. The application does
            not write the bill to a database, an object store, or a log file.
            The response text is returned to your browser and is not retained
            server-side either.
          </li>
          <li>
            <strong>No application profile</strong>: the free analyzer does not
            require an account. A bill can still contain names, identifiers,
            and health information, so users are asked to redact unnecessary
            identifiers before submitting it.
          </li>
          <li>
            <strong>No advertising or analytics data flow</strong>: the
            analyzer does not load advertising or analytics code and does not
            emit upload, analysis, report, or payment events to those systems.
            The site also uses a no-referrer policy.
          </li>
          <li>
             <strong>Anthropic processing</strong>: the file is processed by
             Anthropic&apos;s API to produce the response. Per Anthropic&apos;s
             published standard commercial API policy, inputs and outputs are
             automatically deleted from Anthropic&apos;s backend within 30 days,
             subject to customer-controlled service, agreed-term, Usage Policy,
             and legal exceptions. Anthropic says inputs
             and outputs flagged by automated trust and safety systems may be
             retained for up to two years and associated classification scores
             for up to seven years; legal, policy-enforcement, customer-controlled
             service, and agreed-term exceptions may also apply. This site does
             not claim a zero-data-retention agreement or Business Associate
             Agreement. Review{" "}
             <a
               href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data"
               target="_blank"
               rel="noopener noreferrer"
               className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
             >
               Anthropic&apos;s retention policy
             </a>{" "}
             and the{" "}
             <Link href="/consumer-health-data-privacy" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
              Consumer Health Data Privacy Notice
            </Link>{" "}
            before uploading.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          Honest limitations
        </h2>
        <p>
          The tool is useful as a first-pass plain-English explanation. It is
          not a substitute for professional review. Specifically:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            The analysis is informational, not medical or financial advice.
          </li>
          <li>
            The model can misread poor-quality scans, low-resolution photos,
            handwriting, or heavily redacted documents.
          </li>
          <li>
            The model cannot determine fraud, upcoding, unbundling, medical
            necessity, coverage, or legal compliance from a bill alone. Those
            questions require the underlying records, payer rules, and a
            qualified professional.
          </li>
          <li>
            The tool does not have access to the contracted reimbursement rate
            that the provider negotiated with your specific insurance plan. It
            cannot tell you what the &quot;right&quot; price should have been.
          </li>
          <li>
            Insurance regulations and patient protections vary by state and by
            plan type (employer, ACA, Medicare, Medicaid, TRICARE). The model
            cannot account for those differences.
          </li>
          <li>
            The model can hallucinate. Verify any specific code or amount it
            references against your itemized bill before acting on it.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          Why this matters
        </h2>
        <p>
          Bills and EOBs can be difficult to compare. Official CMS guidance
          recommends checking that listed services and supplies match what was
          received and comparing the provider bill with the EOB. Separate
          appeal and No Surprises Act protections may apply depending on the
          plan and bill. The tool&apos;s limited goal is to organize visible
          information into questions a user can verify with the provider,
          insurer, or qualified adviser.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          References
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            CMS (Centers for Medicare and Medicaid Services):{" "}
            <a
              href="https://www.cms.gov/"
              className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              cms.gov
            </a>
            .
          </li>
          <li>
            American Medical Association, CPT code overview:{" "}
            <a
              href="https://www.ama-assn.org/practice-management/cpt"
              className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ama-assn.org/practice-management/cpt
            </a>
            .
          </li>
          <li>
            HHS, federal No Surprises Act resources:{" "}
            <a
              href="https://www.cms.gov/nosurprises"
              className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              cms.gov/nosurprises
            </a>
            .
          </li>
          <li>
            Patient Advocate Foundation, Medical Billing Tip Sheet:{" "}
            <a
              href="https://education.patientadvocate.org/wp-content/uploads/2023/11/Medical-Billing-Tip-Sheet.pdf"
              className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              patientadvocate.org
            </a>
            .
          </li>
          <li>
            Anthropic, Claude model and API documentation:{" "}
            <a
              href="https://docs.anthropic.com/"
              className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              docs.anthropic.com
            </a>
            .
          </li>
          <li>
            Related guides on this site:{" "}
            <Link href="/blog" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
              blog
            </Link>
            ,{" "}
            <Link href="/codes-explained" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
              codes explained
            </Link>
            .
          </li>
        </ul>
      </article>
    </main>
  );
}
