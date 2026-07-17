import type { Metadata } from "next";
import BillAnalyzer from "@/components/BillAnalyzer";
import AnswerBlock from "@/components/AnswerBlock";
import Disclaimer from "@/components/Disclaimer";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Bill",
  description:
    "Upload a supported medical bill or EOB for an AI-generated report of billing codes, charges, insurance fields, and patterns to verify.",
  keywords:
    "medical bill reader, understand medical bill, EOB explanation, medical billing codes, CPT codes, insurance EOB, billing errors",
  alternates: {
    canonical: "https://medicalbillreader.com",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Medical Bill Reader — Understand Your Bill",
    description:
      "Upload a supported medical bill or EOB for an AI-generated report of billing codes, charges, insurance fields, and patterns to verify.",
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
        text: "Uploaded documents are transmitted to Anthropic solely to generate the requested analysis. They are not sold or shared for advertising, and Medical Bill Reader does not intentionally store bill documents in its own database. Processing and retention by infrastructure providers are governed by their applicable terms.",
      },
    },
    {
      "@type": "Question",
      name: "What medical billing codes does the tool explain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool attempts to identify CPT, ICD-10-CM, and HCPCS codes when they are legible in the uploaded document. AI output can be incomplete or incorrect, so verify each finding against the original bill, EOB, and insurer or provider records.",
      },
    },
    {
      "@type": "Question",
      name: "Can Medical Bill Reader detect billing errors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool may flag patterns such as apparent duplicates or code combinations for review. A flag is not proof of a billing error. Confirm it with the provider or insurer before taking action.",
      },
    },
    {
      "@type": "Question",
      name: "Is Medical Bill Reader a substitute for professional advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Medical Bill Reader provides general explanations of medical billing codes and charges for informational purposes only. It is not financial or medical advice. For billing disputes, contact your healthcare provider, insurance company, or a certified medical billing advocate.",
      },
    },
  ],
};

export default function Home() {
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
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-lg">
              MedicalBillReader
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
              <span className="sm:hidden">1 free/month</span>
              <span className="hidden sm:inline">1 free analysis/month · No account needed</span>
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="mb-8 text-center sm:mb-12">
          <div className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-200 dark:border-teal-700">
            Free Medical Bill Explainer — No Sign-Up Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Finally Understand<br />Your Medical Bill
          </h1>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-4 text-center">
            Last reviewed: July 16, 2026
          </p>
          <p className="mx-auto max-w-2xl text-lg text-slate-700 dark:text-slate-300 sm:text-xl">
            Medical Bill Reader helps you understand confusing medical bills and insurance
            EOBs in plain language — no medical degree required. Upload a photo or PDF and
            receive an AI-generated report of visible charges, codes, insurance fields, and items to verify.
          </p>
          <a
            href="#analyzer"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-teal-700 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            Start free analysis
          </a>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">
            Built by an experienced web professional
          </p>
        </div>

        {/* Disclaimer ,  server-rendered, visible before tool */}
        <div className="mb-6">
          <Disclaimer />
        </div>

        {/* Interactive Tool (client component) */}
        <BillAnalyzer />

        {/* Answer Block (server-rendered) */}
        <AnswerBlock
          what="An AI tool that decodes medical bills, explains CPT and ICD-10 codes, flags potential errors, and translates charges into plain English."
          who="Patients who received a confusing medical bill and want to understand what they were charged for before paying or disputing."
          bottomLine="Upload a supported medical bill for an AI-assisted first pass. Verify important findings against the source; results are not financial or medical advice."
          lastUpdated="2026-07-16"
        />

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

          {/* Section 2 ,  Common billing errors */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              What are the most common medical billing errors?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              The most common medical billing errors include duplicate charges, upcoding, unbundled procedures, charges for services not rendered, and incorrect patient or insurance information.
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
              Is it safe to upload a medical bill?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              Bills are processed over encrypted HTTPS and transmitted to Anthropic solely for your requested explanation. They are not sold or used for advertising, and Medical Bill Reader does not intentionally store bill documents in its own database.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              No account or login is required. The document itself may contain identifying and health information, so review the Privacy Policy before uploading. Bill content is not sent to analytics or advertising systems; Anthropic and infrastructure providers process data under their own terms.
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
                  rel="nofollow noopener noreferrer"
                >
                  CMS ,  How to Read Your Medical Bill
                </a>
              </li>
              <li>
                <a
                  href="https://www.cms.gov/medical-bill-rights/help/guides/bill-errors"
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  CMS ,  Check Your Medical Bill for Errors
                </a>
              </li>
              <li>
                <a
                  href="https://www.healthcare.gov/appeal-insurance-company-decision/appeals/"
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  HealthCare.gov ,  How to Appeal an Insurance Decision
                </a>
              </li>
            </ul>
          </div>

        </section>

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
            <p className="text-xs text-slate-600">1 per month, no account</p>
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
                Documents are transmitted securely to Anthropic solely for analysis. They are not sold or shared for advertising, and Medical Bill Reader does not intentionally store them in its own database. See the Privacy Policy for infrastructure and retention details.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">What medical billing codes does the tool explain?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                The tool attempts to identify CPT, ICD-10-CM, and HCPCS codes when they are legible. Verify each code and description against the original document and provider or insurer records.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Can Medical Bill Reader detect billing errors?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                The tool may flag patterns such as apparent duplicates or code combinations for review. A flag is not proof of an error. Confirm it with the provider or insurer before taking action.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Is Medical Bill Reader a substitute for professional advice?</h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                No. Medical Bill Reader provides general explanations of medical billing codes and charges for informational purposes only. It is not financial or medical advice. For billing disputes, contact your healthcare provider, insurance company, or a certified medical billing advocate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
