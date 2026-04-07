import type { Metadata } from "next";
import BillAnalyzer from "@/components/BillAnalyzer";
import AnswerBlock from "@/components/AnswerBlock";
import Disclaimer from "@/components/Disclaimer";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Medical Bill Reader — Understand Your Bill",
  description:
    "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
  keywords:
    "medical bill reader, understand medical bill, EOB explanation, medical billing codes, CPT codes, insurance EOB, billing errors",
  alternates: {
    canonical: "https://medicalbillreader.com",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Medical Bill Reader — Understand Your Bill",
    description:
      "Upload your medical bill and get a free plain-English explanation of every charge. We flag potential errors and tell you exactly what to do next.",
    url: "https://medicalbillreader.com",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  dateModified: "2026-04-07",
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
  dateModified: "2026-04-07",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Medical Bill Reader?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Medical Bill Reader is a free AI-powered tool that explains medical bills in plain English. Upload your bill and the tool identifies CPT codes, ICD-10 codes, and HCPCS codes, explains what each charge is for, flags potential billing errors, and breaks down insurance columns like allowed amount and patient responsibility.",
      },
    },
    {
      "@type": "Question",
      name: "Is my medical bill data kept private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Uploaded medical bills are processed immediately and deleted after analysis. No bill content is stored, logged, or retained. Medical bills contain sensitive personal and health information — we treat all uploaded data with the highest level of privacy protection and never use it for advertising purposes.",
      },
    },
    {
      "@type": "Question",
      name: "What medical billing codes does the tool explain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool explains CPT codes (procedure codes), ICD-10 codes (diagnosis codes), and HCPCS codes (supplies and services). These codes appear on Explanation of Benefits (EOB) documents and itemized medical bills. Understanding them helps you verify charges and identify potential errors before paying.",
      },
    },
    {
      "@type": "Question",
      name: "Can Medical Bill Reader detect billing errors?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The tool flags common billing patterns that may indicate errors, such as duplicate charges, unbundled procedures, and charges inconsistent with your diagnosis codes. However, results are informational only — consult a medical billing advocate or your insurance company to dispute any specific charge.",
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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Free · No account needed
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-block bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-teal-200 dark:border-teal-700">
            Free Medical Bill Explainer — No Sign-Up Required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Finally Understand<br />Your Medical Bill
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 text-center">
            Last updated: March 16, 2026
          </p>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Medical Bill Reader helps you understand confusing medical bills and insurance
            EOBs in plain language — no medical degree required. Upload a photo or PDF and
            get every charge explained, potential errors flagged, and clear next steps.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-4">
            Built by an experienced web professional
          </p>
        </div>

        {/* Answer Block (server-rendered) */}
        <AnswerBlock
          what="An AI tool that decodes medical bills, explains CPT and ICD-10 codes, flags potential errors, and translates charges into plain English."
          who="Patients who received a confusing medical bill and want to understand what they were charged for before paying or disputing."
          bottomLine="Upload your medical bill for a free line-by-line explanation — results are for informational purposes only and not financial or medical advice."
          lastUpdated="2026-03-20"
        />

        {/* Disclaimer — server-rendered, visible before tool */}
        <div className="mb-6">
          <Disclaimer />
        </div>

        {/* Interactive Tool (client component) */}
        <BillAnalyzer />

        {/* GEO Content Sections (server-rendered) */}
        <section className="mb-12 space-y-10">

          {/* Section 1 — How AI analysis works */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              How does AI medical bill analysis work?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              Upload your medical bill or EOB document — the AI reads each line item, identifies the billing codes, and explains what each charge means in plain English within seconds.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              When you upload a file, it is sent over encrypted HTTPS to our server for processing and deleted immediately after analysis is complete — nothing is retained. The tool supports JPG, PNG, and PDF formats, including multi-page EOB documents. The analysis covers CPT codes (procedures), ICD-10 codes (diagnoses), and HCPCS codes (supplies and services), giving you a line-by-line breakdown of what you were charged for and why. Medical billing errors affect an estimated 80% of medical bills, according to the Medical Billing Advocates of America — understanding your bill before you pay is one of the most impactful steps you can take.
            </p>
          </div>

          {/* Section 2 — Common billing errors */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              What are the most common medical billing errors?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              The most common medical billing errors include duplicate charges, upcoding, unbundled procedures, charges for services not rendered, and incorrect patient or insurance information.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Americans are overcharged billions annually due to medical billing errors — the average billing error costs patients $1,300 out of pocket, according to a 2023 healthcare billing analysis. Summary statements from hospitals often mask these errors; requesting an itemized bill (not just the summary) is the best way to detect duplicate or incorrect charges before disputing them with your provider or insurer. Americans spend over $400 billion on out-of-pocket medical costs annually, making accurate bill review one of the most impactful personal finance actions available.
            </p>
          </div>

          {/* Section 3 — CPT codes */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              What do CPT codes mean on a medical bill?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              CPT (Current Procedural Terminology) codes are 5-digit numbers that identify specific medical procedures. Each code corresponds to a standard procedure with a defined cost range that insurers use to determine reimbursement.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              CPT codes are maintained and updated annually by the American Medical Association (AMA). As a patient, you have the right to request an itemized bill that lists every CPT code billed during your visit — your provider is required to provide one. Mismatched or incorrect CPT codes are one of the most common sources of overbilling: a code for a more complex procedure than what was performed (known as upcoding) can result in significant overcharges that go undetected if you only review the summary statement.
            </p>
          </div>

          {/* Section 4 — Upload safety */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Is it safe to upload a medical bill?
            </h2>
            <p className="text-slate-700 dark:text-slate-300 font-medium mb-3">
              Yes — bills are processed server-side over encrypted HTTPS and deleted immediately after analysis. No medical information is stored, logged, or used for any purpose beyond your requested explanation.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              No account is required and no login is needed — your bill is never associated with an identity. Medical data is never passed to advertising systems; ads on this site run in non-personalized mode on analysis pages specifically to prevent any health information from reaching ad networks.
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
                  href="https://www.cms.gov/medicare/billing/medicarebillingforms"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  CMS (Centers for Medicare &amp; Medicaid Services) — Understanding Your Medical Bill
                </a>
              </li>
              <li>
                <a
                  href="https://www.patientadvocate.org/explore-our-resources/understanding-healthcare-bills/"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Patient Advocate Foundation — Medical Billing Resources
                </a>
              </li>
              <li>
                <a
                  href="https://www.ama-assn.org/practice-management/cpt/cpt-overview-and-code-approval"
                  className="text-teal-600 dark:text-teal-400 hover:underline"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  American Medical Association — CPT Code Overview
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
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Take a photo or upload a PDF of any medical bill, EOB, or hospital statement.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">AI Reads It</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Our AI scans every line item, code, and charge — the same way a billing expert would.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">Get Plain English</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You get a clear breakdown of every charge, plus flags for anything that looks unusual.
            </p>
          </div>
        </div>

        {/* Trust Bar (server-rendered) */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-12 flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-2xl mb-1">🔒</div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Never stored</p>
            <p className="text-xs text-slate-400">Bills are never saved</p>
          </div>
          <div>
            <div className="text-2xl mb-1">🆓</div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Always free</p>
            <p className="text-xs text-slate-400">No account needed</p>
          </div>
          <div>
            <div className="text-2xl mb-1">⚡</div>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm">30 seconds</p>
            <p className="text-xs text-slate-400">Fast results</p>
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
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Medical Bill Reader is a free AI-powered tool that explains medical bills in plain English. Upload your bill and the tool identifies CPT codes, ICD-10 codes, and HCPCS codes, explains what each charge is for, flags potential billing errors, and breaks down insurance columns like allowed amount and patient responsibility.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Is my medical bill data kept private?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Yes. Uploaded medical bills are processed immediately and deleted after analysis. No bill content is stored, logged, or retained. Medical bills contain sensitive personal and health information — we treat all uploaded data with the highest level of privacy protection and never use it for advertising purposes.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">What medical billing codes does the tool explain?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                The tool explains CPT codes (procedure codes), ICD-10 codes (diagnosis codes), and HCPCS codes (supplies and services). These codes appear on Explanation of Benefits (EOB) documents and itemized medical bills. Understanding them helps you verify charges and identify potential errors before paying.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Can Medical Bill Reader detect billing errors?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                The tool flags common billing patterns that may indicate errors, such as duplicate charges, unbundled procedures, and charges inconsistent with your diagnosis codes. However, results are informational only — consult a medical billing advocate or your insurance company to dispute any specific charge.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Is Medical Bill Reader a substitute for professional advice?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                No. Medical Bill Reader provides general explanations of medical billing codes and charges for informational purposes only. It is not financial or medical advice. For billing disputes, contact your healthcare provider, insurance company, or a certified medical billing advocate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
