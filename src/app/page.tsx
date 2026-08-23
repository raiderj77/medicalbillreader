import type { Metadata } from "next";
import Link from "next/link";
import BillAnalyzer from "@/components/BillAnalyzer";
import AnswerBlock from "@/components/AnswerBlock";
import Disclaimer from "@/components/Disclaimer";
import HomepageGuideCluster from "@/components/HomepageGuideCluster";
import ThemeToggle from "@/components/ThemeToggle";
import { getProductConfig } from "@/config/product";

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Bill",
  description:
    "Compare labeled bill and EOB amounts in a local-only worksheet, or upload a supported redacted document for an AI-assisted explanation.",
  keywords:
    "medical bill reader, understand medical bill, EOB explanation, medical billing code systems, insurance EOB, bill verification checklist",
  alternates: {
    canonical: "https://medicalbillreader.com",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Medical Bill Reader — Understand Your Bill",
    description:
      "Compare labeled bill and EOB amounts in a local-only worksheet, or upload a supported redacted document for an AI-assisted explanation.",
    url: "https://medicalbillreader.com",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://medicalbillreader.com",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Medical Bill Reader?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Medical Bill Reader generates an AI-assisted report from a supported medical bill or EOB. It attempts to identify billing codes, charges, insurance fields, and patterns that may be worth verifying against the source document.",
      },
    },
    {
      "@type": "Question",
      name: "Is my medical bill data kept private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Uploaded documents are transmitted to Anthropic to generate the requested analysis. They are not sold or shared for advertising, and Medical Bill Reader does not intentionally store bill documents in its own database. Anthropic's standard API policy provides automatic deletion within 30 days, but policy-enforcement, legal, and other published exceptions can be longer. Anthropic says policy-flagged inputs and outputs may be retained for up to two years and associated classification scores for up to seven years. Medical Bill Reader does not claim zero-data-retention terms or a Business Associate Agreement. Redact identifiers you do not need explained before uploading.",
      },
    },
    {
      "@type": "Question",
      name: "How does the tool handle visible billing codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool may transcribe visible code labels when they are legible, but it does not provide official CPT descriptors or an authoritative code lookup. Verify each finding with the source document, provider, insurer, or an appropriately licensed official resource.",
      },
    },
    {
      "@type": "Question",
      name: "Can Medical Bill Reader determine that a bill has an error?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool may identify apparent duplicate lines, mismatches, or unfamiliar fields for review. It cannot determine from a bill alone that coding, coverage, or a charge is wrong. Confirm every concern with the provider or insurer before taking action.",
      },
    },
    {
      "@type": "Question",
      name: "Is Medical Bill Reader a substitute for professional advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Medical Bill Reader provides general explanations of visible medical-billing fields, codes, and charges for informational purposes only. It is not financial or medical advice. For billing disputes, contact your healthcare provider, insurance company, or a qualified medical billing advocate.",
      },
    },
  ],
};

export default function Home() {
  const config = getProductConfig();

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-lg">
              MedicalBillReader
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/blog"
              className="inline-flex min-h-11 items-center px-1 text-sm font-semibold text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
            >
              Guides
            </Link>
            <span className="hidden text-xs text-slate-700 dark:text-slate-300 md:inline md:text-sm">
              1 free analysis/browser/month · No account needed
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Product definition */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-200 dark:border-teal-700">
            Private worksheet + optional AI document explanation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Compare and understand<br />medical billing documents
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-4 text-center">
            Last reviewed: August 23, 2026
          </p>
          <p className="mx-auto max-w-2xl text-lg text-slate-700 dark:text-slate-300 sm:text-xl">
            Medical Bill Reader gives U.S. consumers two informational tools:
            a browser-only worksheet for labeled bill and EOB amounts, and an
            AI-assisted explainer for a supported redacted document.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
            Built by{" "}
            <Link href="/about" className="font-medium underline">
              Jason Ramirez
            </Link>
            , an experienced web professional. See our{" "}
            <Link href="/editorial-policy" className="font-medium underline">
              editorial standards
            </Link>
            .
          </p>
        </div>

        {config.features.localComparisonWorksheet && (
          <section className="mb-6 rounded-2xl border-2 border-teal-700 bg-white p-6 shadow-sm dark:bg-slate-800">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-800 dark:text-teal-300">
              Path 1 · Local-only
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Compare a Bill and EOB Privately
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300">
              Enter the labeled amounts yourself. The worksheet stays in the
              browser and is not uploaded.
            </p>
            <Link
              href="/bill-eob-comparison-worksheet"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
            >
              Open Private Comparison Worksheet
            </Link>
          </section>
        )}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            No upload · fully synthetic
          </p>
          <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">
            See the report format before using the AI tool
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            Review a fabricated bill-and-EOB example with no customer or health data.
          </p>
          <Link
            href="/sample-medical-bill-report"
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-teal-900 underline underline-offset-4 dark:text-teal-200"
          >
            See a synthetic sample report
          </Link>
        </section>

        {config.features.singleAnalysis && (
          <section className="mb-6 rounded-2xl border border-slate-300 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
              Path 2 · Third-party AI processing
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Explain a Redacted Document with AI
            </h2>
            <p className="mt-3 max-w-3xl text-slate-700 dark:text-slate-300">
              Upload a supported redacted bill or EOB. The file is sent through
              the application to Anthropic for the requested report.
            </p>
            <a
              href="#analyzer"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900"
            >
              Use AI Document Explainer
            </a>
          </section>
        )}

        <section
          aria-labelledby="health-data-notice-heading"
          className="mb-6 rounded-2xl border-2 border-teal-300 bg-teal-50 p-5 text-left dark:border-teal-800 dark:bg-teal-950/30 sm:p-6"
        >
          <h2
            id="health-data-notice-heading"
            className="text-lg font-bold text-slate-950 dark:text-white"
          >
            Before you upload a bill or EOB
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-800 dark:text-slate-200">
            Remove names, member IDs, account numbers, dates of birth, addresses,
            barcodes, and other identifiers you do not need explained. The file
            is sent to Anthropic to create the report. Anthropic&apos;s standard
            API policy provides automatic deletion within 30 days, but
            policy-enforcement, legal, and other published exceptions can be
            longer. Policy-flagged inputs and outputs may be retained for up to
            two years and associated classification scores for up to seven
            years. Medical Bill Reader does not claim zero-data-retention terms
            or a Business Associate Agreement and is a direct-to-consumer tool,
            not a HIPAA-covered service.
          </p>
          <Link
            href="/consumer-health-data-privacy"
            className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-white px-4 py-2 text-sm font-bold text-teal-900 underline shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:bg-slate-900 dark:text-teal-200"
          >
            Read the Consumer Health Data Privacy Notice
          </Link>
        </section>

        {/* Disclaimer ,  server-rendered, visible before tool */}
        <div className="mb-6">
          <Disclaimer />
        </div>

        {/* Interactive Tool (client component) */}
        {config.features.singleAnalysis ? (
          <BillAnalyzer
            localImageRedactionEnabled={config.features.localImageRedaction}
          />
        ) : (
          <section
            id="analyzer"
            className="mb-8 scroll-mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8"
            aria-labelledby="analyzer-unavailable-heading"
          >
            <h2
              id="analyzer-unavailable-heading"
              className="text-xl font-bold text-slate-900 dark:text-slate-100"
            >
              Document analysis is not currently available
            </h2>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              You can still use the free local comparison worksheet and the
              educational guides without uploading a document.
            </p>
          </section>
        )}

        {/* Answer Block (server-rendered) */}
        <AnswerBlock
          what="An AI-assisted tool that organizes legible medical-bill fields, explains unfamiliar terms, and identifies specific items to verify."
          who="People who received a confusing medical bill or EOB and want a structured first pass before verifying details with the provider or insurer."
          bottomLine="Upload a supported medical bill for an AI-assisted first pass. Verify important findings against the source; results are not financial or medical advice."
          lastUpdated="2026-08-23"
        />

        <section className="mb-12 grid gap-6 md:grid-cols-2" aria-label="Report boundaries">
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              What the AI report does
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              It organizes legible visible fields, codes, amounts, and specific
              questions to verify against the source document.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              What the AI report does not do
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
              It does not determine fraud, legal obligations, medical necessity,
              coverage, coding correctness, savings, or dispute outcomes.
            </p>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="homepage-pricing-heading">
          <h2 id="homepage-pricing-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Clear options
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Free</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                $0 · 1 analysis per browser per UTC calendar month.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Single document</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {config.displayPrices.singleAnalysis} · one analysis.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Bill and EOB comparison</h3>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                {config.displayPrices.billEobComparison} · coming later; no checkout yet.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="mt-5 inline-flex min-h-11 items-center font-semibold text-teal-900 underline underline-offset-4 dark:text-teal-200"
          >
            Read pricing, access, and refund details
          </Link>
        </section>

        <section className="mb-12 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Methodology and limits
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            See the documented data flow, evidence boundaries, source hierarchy,
            and limitations before relying on any output.
          </p>
          <Link
            href="/methodology"
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-teal-900 underline underline-offset-4 dark:text-teal-200"
          >
            Read the methodology
          </Link>
        </section>

        {/* GEO Content Sections (server-rendered) */}
        <section className="mb-12 space-y-10">

          {/* Section 1 ,  How AI analysis works */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              How does AI medical bill analysis work?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              Upload a supported medical bill or EOB and the AI attempts to organize legible line items, billing codes, and insurance fields into a plain-language report.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              Files are sent over encrypted HTTPS through the application to Anthropic solely to generate the requested report. Medical Bill Reader does not intentionally save the document in its own database. The tool accepts JPEG, PNG, WebP, and PDF files up to 10 MB. AI output can omit or misread text, so compare every important finding with the original document.
            </p>
          </div>

          {/* Section 2 ,  Fields to verify */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Which bill and EOB fields can I check?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
               Fields worth comparing include service dates, apparent duplicate line items, insurance and patient payments, billed and allowed amounts, and services or quantities you do not recognize. Coding questions require the underlying records, current payer rules, and authorized code sources.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              CMS advises comparing the provider bill with the Explanation of Benefits, checking that the services match what you received, and contacting the provider or insurer when amounts do not match. An AI flag is only a prompt to verify the source records; it does not establish that a charge is wrong.
            </p>
          </div>

          {/* Section 3 ,  CPT codes */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              What do CPT codes mean on a medical bill?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              CPT (Current Procedural Terminology) codes identify medical procedures and services. The code alone does not establish what you should owe because payment depends on the claim, network, plan, and other billing details.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              CPT is maintained by the American Medical Association. CMS recommends comparing the bill and EOB with the care and supplies you received, and asking the provider or insurer about anything that does not match. Use the report to locate items for that review, not as a payment determination.
            </p>
          </div>

          {/* Section 4 ,  Upload safety */}
          <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                What happens to my data when I upload a medical bill?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
               Bills are transmitted over encrypted HTTPS through the application to Anthropic for your requested explanation. They are not sold or used for advertising, and Medical Bill Reader does not intentionally store bill documents in its own database.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
               No account or login is required. The document may contain identifying, health, insurance, and financial information. Redact fields you do not need explained and read the Consumer Health Data Privacy Notice before uploading. Bill content, filenames, report text, and analysis activity are not sent to analytics or advertising systems; Anthropic and infrastructure providers process data under their terms.
            </p>
          </div>

          {/* Required YMYL Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-5">
            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong>Important:</strong> This tool provides general explanations of medical billing codes and charges for informational purposes only. It is not financial or medical advice. For billing disputes, contact your healthcare provider or insurance company directly.
            </p>
          </div>

          {/* Further Reading */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Further Reading</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.cms.gov/medical-bill-rights/help/guides/how-to-read-bill"
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                  target="_blank"
                   rel="noopener noreferrer"
                >
                  CMS ,  How to Read Your Medical Bill
                </a>
              </li>
              <li>
                <a
                  href="https://www.cms.gov/medical-bill-rights/help/guides/bill-errors"
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                  target="_blank"
                   rel="noopener noreferrer"
                >
                  CMS ,  Check Your Medical Bill for Errors
                </a>
              </li>
              <li>
                <a
                  href="https://www.healthcare.gov/appeal-insurance-company-decision/appeals/"
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                  target="_blank"
                   rel="noopener noreferrer"
                >
                  HealthCare.gov ,  How to Appeal an Insurance Decision
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Privacy and legal
            </h3>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">
              Review the{" "}
              <Link href="/consumer-health-data-privacy" className="font-semibold underline">
                Consumer Health Data Privacy Notice
              </Link>
              ,{" "}
              <Link href="/privacy" className="font-semibold underline">
                Privacy Policy
              </Link>
              ,{" "}
              <Link href="/terms" className="font-semibold underline">
                Terms
              </Link>
              , and{" "}
              <Link href="/disclaimer" className="font-semibold underline">
                Disclaimer
              </Link>
              .
            </p>
          </div>

        </section>

        <HomepageGuideCluster />

        {/* How It Works (server-rendered) */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-4xl mb-3">📤</div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Upload Your Bill</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Choose a supported JPEG, PNG, WebP, or PDF file up to 10 MB.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">AI Reads It</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Claude AI attempts to identify legible line items, codes, and insurance fields.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Get Plain English</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Review the structured report and verify important items against the bill and EOB.
            </p>
          </div>
        </div>

        {/* Trust Bar (server-rendered) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-12 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">No bill database</p>
            <p className="text-xs text-slate-600">Not intentionally saved by us</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🆓</div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Free to try</p>
            <p className="text-xs text-slate-600">1/browser/month, no account</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">10 MB</p>
            <p className="text-xs text-slate-600">Maximum file size</p>
          </div>
        </div>

        {/* FAQ (server-rendered) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Frequently Asked Questions About Medical Bills
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">What is Medical Bill Reader?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                Medical Bill Reader generates an AI-assisted report from a supported medical bill or EOB. It attempts to identify visible codes, charges, insurance fields, and patterns that may be worth verifying.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Is my medical bill data kept private?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                Documents are transmitted securely to Anthropic for analysis. They are not sold or shared for advertising, and Medical Bill Reader does not intentionally store them in its own database. Anthropic&apos;s standard API policy provides automatic deletion within 30 days, with longer policy-enforcement, legal, and other published exceptions. Policy-flagged inputs and outputs may be retained for up to two years and associated classification scores for up to seven years. Medical Bill Reader does not claim zero-data-retention terms or a Business Associate Agreement. Redact identifiers you do not need explained and see the Consumer Health Data Privacy Notice for details.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">How does the tool handle visible billing codes?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                The tool may transcribe visible code labels when they are legible, but it does not provide official CPT descriptors or an authoritative code lookup. Verify each finding with the source document, provider, insurer, or an appropriately licensed official resource.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Can Medical Bill Reader determine that a bill has an error?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                 The tool may identify apparent duplicate lines, mismatches, or unfamiliar fields for review. It cannot determine from a bill alone that coding, coverage, or a charge is wrong. Confirm every concern with the provider or insurer before taking action.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Is Medical Bill Reader a substitute for professional advice?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                No. Medical Bill Reader provides general explanations of visible medical-billing fields, codes, and charges for informational purposes only. It is not financial or medical advice. For billing disputes, contact your healthcare provider, insurance company, or a qualified medical billing advocate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
