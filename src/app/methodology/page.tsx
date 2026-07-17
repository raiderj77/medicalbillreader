import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology: How Medical Bill Reader Works",
  description:
    "How Medical Bill Reader analyzes uploaded medical bills: which AI model powers it, what codes and charges it identifies, how bill data is handled and deleted, and what the tool cannot do.",
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
const TODAY = new Date().toISOString().substring(0, 10);

export default function MethodologyPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Methodology: How Medical Bill Reader Works",
    description:
      "How Medical Bill Reader analyzes uploaded medical bills, which AI model powers it, what it identifies, how bill data is handled, and its honest limits.",
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
      { "@type": "ListItem", position: 2, name: "Methodology", item: PAGE_URL },
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
        <span className="text-gray-600 dark:text-gray-300">Methodology</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
        Methodology: How Medical Bill Reader Works
      </h1>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Last updated: {TODAY}. Built by an experienced web professional.
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
          returns a plain-English breakdown organized into five sections: what
          the bill is for, a breakdown of the charges, what you owe, potential
          issues to review, and what to do next. The output is a written
          explanation, not a diagnosis or a payment decision.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          What model powers the analysis
        </h2>
        <p>
          The analyzer calls the Anthropic Claude API. The current model is{" "}
          <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm">
            claude-opus-4-7
          </code>
          , Anthropic&apos;s general-purpose multimodal model. The API request
          is made server-side from a Next.js API route. The Anthropic API key
          is read from a Vercel environment variable and is never embedded in
          client code.
        </p>
        <p>
          The model receives the uploaded file (image or PDF) and a single
          prompt instructing it to act as a medical billing expert and
          structure its response under the five fixed section headings above.
          The model uses its general training to recognize billing codes,
          common charge patterns, and typical EOB layouts. It does not look up
          codes against a live database, does not read your insurance plan
          documents, and does not have access to your medical history.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-3">
          What the analyzer identifies
        </h2>
        <p>The model is asked to surface the items most useful to a patient:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Procedure and service codes</strong> such as CPT (Current
            Procedural Terminology), HCPCS Level II, ICD-10-CM diagnosis codes,
            and NDC drug codes when present.
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
            <strong>Patterns that may indicate billing errors</strong>:
            duplicate line items, charges inconsistent with the listed
            diagnosis, suspected unbundling of services, or charges for
            services not commonly delivered together. These are pattern
            observations from the AI, not certified findings.
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
            <strong>No identifiers stored</strong>: the application does not
            require an account, does not capture your name, and does not link
            uploads to a user identity.
          </li>
          <li>
            <strong>No advertising data flow</strong>: bill content is never
            passed to any advertising system, analytics provider, or
            third-party tracker. Analysis pages use a strict referrer policy
            so that page URLs cannot leak to third parties.
          </li>
          <li>
            <strong>Anthropic processing</strong>: the file is processed by
            Anthropic&apos;s API to produce the response. Per Anthropic&apos;s
            published policies, API inputs and outputs are not used to train
            their models by default. Refer to Anthropic&apos;s data usage and
            retention policy for the current details.
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
            The model cannot detect every form of billing fraud or error.
            Sophisticated upcoding, unbundling, or balance-billing issues
            often require a billing advocate to confirm.
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
          Medical billing errors are common and costly. Patient advocacy
          organizations and academic studies have for years documented
          significant error rates on hospital and provider statements,
          alongside widespread confusion about what charges mean and which
          ones can be appealed. Patients have rights they often do not know
          about: the right to an itemized bill, the right to appeal a denied
          claim, and protections under the federal No Surprises Act for
          certain out-of-network charges. The goal of this tool is to lower
          the barrier to reading what is actually on a bill so those rights
          can be used.
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
              rel="nofollow noopener noreferrer"
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
              rel="nofollow noopener noreferrer"
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
              rel="nofollow noopener noreferrer"
            >
              cms.gov/nosurprises
            </a>
            .
          </li>
          <li>
            Patient Advocate Foundation, billing resources:{" "}
            <a
              href="https://www.patientadvocate.org/explore-our-resources/understanding-healthcare-bills/"
              className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              target="_blank"
              rel="nofollow noopener noreferrer"
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
              rel="nofollow noopener noreferrer"
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
            ,{" "}
            <Link href="/stats" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
              extraction stats
            </Link>
            .
          </li>
        </ul>
      </article>
    </main>
  );
}
