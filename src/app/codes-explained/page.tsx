import type { Metadata } from "next";
import Link from "next/link";
import {
  CODE_RIGHTS_ENTRIES,
  CODE_RIGHTS_REVIEW_DATE,
  type CodeSystemId,
} from "@/config/code-set-rights";

const PAGE_URL = "https://medicalbillreader.com/codes-explained";

export const metadata: Metadata = {
  title: "Medical Billing Code Systems Explained",
  description:
    "A system-level guide to CPT, HCPCS, ICD-10, NDC, DRG, revenue, modifier, place-of-service, and remittance codes, with rights limits and official sources.",
  keywords: [
    "medical billing code systems",
    "CPT overview",
    "HCPCS overview",
    "ICD-10 overview",
    "NDC format",
    "DRG overview",
    "EOB codes",
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
  openGraph: {
    title: "Medical Billing Code Systems Explained",
    description:
      "Understand what common medical billing code systems are for, where to verify them, and why a code alone cannot establish correctness or payment responsibility.",
    url: PAGE_URL,
    type: "article",
  },
};

type SystemCopy = {
  purpose: string;
  limitation: string;
  question: string;
};

const SYSTEM_COPY: Record<CodeSystemId, SystemCopy> = {
  cpt: {
    purpose:
      "CPT is an AMA-maintained terminology used to report professional procedures and services.",
    limitation:
      "Medical Bill Reader does not provide official CPT descriptions, a CPT lookup, or a coding determination. The AMA licensing source says electronic products need an appropriate license to use, reference, or display CPT content; no product license is verified here.",
    question:
      "Ask the provider or insurer which licensed source and documentation support the code shown on the source document.",
  },
  "hcpcs-level-i": {
    purpose:
      "HCPCS Level I is CPT, the AMA-maintained terminology used to report professional procedures and services.",
    limitation:
      "The same unresolved CPT license applies. Medical Bill Reader does not provide exact Level I examples, official descriptions, AI-generated individual-code explanations, or lookup.",
    question:
      "Ask the provider or insurer to explain the visible code using documentation and an appropriately licensed AMA source.",
  },
  "hcpcs-level-ii": {
    purpose:
      "HCPCS Level II is used for categories such as supplies, equipment, ambulance services, and certain drugs and services.",
    limitation:
      "A visible HCPCS code does not establish what was supplied, whether documentation supports it, coverage, or patient responsibility.",
    question:
      "Ask for the item or service name, quantity, and plan-processing explanation tied to the source document.",
  },
  "icd-10-cm": {
    purpose:
      "ICD-10-CM is used to report diagnoses, symptoms, conditions, and reasons for encounters.",
    limitation:
      "A diagnosis code printed on a bill or EOB is not a diagnosis by this service and does not prove that the code or underlying clinical record is correct.",
    question:
      "Ask the provider to explain an unfamiliar label using the underlying record rather than relying on this page.",
  },
  "icd-10-pcs": {
    purpose:
      "ICD-10-PCS is used to classify procedures performed during inpatient hospital care.",
    limitation:
      "The characters are highly specific. A document image and general explainer cannot establish the intended procedure or whether coding rules were applied correctly.",
    question:
      "Ask the hospital or insurer to explain the code using the inpatient record and current official guidance.",
  },
  ndc: {
    purpose:
      "The current FDA-assigned NDC is a 10-digit, three-segment number used to identify a labeler, product, and package configuration.",
    limitation:
      "NDC presentation can vary by source and workflow. This page does not publish an exact code example, identify a drug or package, or provide an NDC lookup while reuse rights remain under review.",
    question:
      "Ask which format, package, quantity, and source record were used before drawing a conclusion from the number.",
  },
  drg: {
    purpose:
      "Diagnosis-related groups classify inpatient stays for certain payment systems; Medicare uses MS-DRGs for many inpatient prospective payments.",
    limitation:
      "A group label does not reveal every diagnosis, procedure, payment rule, or payer-specific adjustment behind a claim.",
    question:
      "Ask the hospital or insurer which classification and payment method applied to the claim.",
  },
  "revenue-codes": {
    purpose:
      "Revenue codes group institutional charges by service area or charge category on facility claims.",
    limitation:
      "A revenue category is not an itemized clinical description and does not establish that a charge is supported or owed.",
    question:
      "Ask for an itemized explanation when a broad facility category is unclear.",
  },
  modifiers: {
    purpose:
      "Modifiers add context to a procedure or service code, such as circumstances affecting how a service was reported.",
    limitation:
      "Modifier meaning and rights can depend on the underlying code set. This page does not provide exact modifier descriptions or determine whether a modifier was appropriate.",
    question:
      "Ask which circumstance and documentation supported the modifier on the source record.",
  },
  "place-of-service": {
    purpose:
      "Place of Service codes identify the reported setting where a professional service occurred.",
    limitation:
      "A setting code alone does not establish network status, facility-fee rules, coverage, or a legal payment obligation.",
    question:
      "Ask the provider or insurer to confirm the setting and explain how it affected claim processing.",
  },
  "adjustment-remark-codes": {
    purpose:
      "Claim Adjustment Reason Codes and Remittance Advice Remark Codes communicate general adjustment and claim-processing information.",
    limitation:
      "A short adjustment or remark code does not replace the full EOB, plan document, denial notice, or appeal instructions and does not by itself establish what is owed.",
    question:
      "Ask the insurer to explain the code in the context of the full notice and current plan terms.",
  },
};

const BILL_FIELDS = [
  {
    term: "EOB",
    meaning:
      "An Explanation of Benefits is the health plan's record of how it processed a claim. It is not a provider bill.",
  },
  {
    term: "Allowed amount",
    meaning:
      "The amount the plan uses when calculating benefits. It is not necessarily what the plan pays or what someone legally owes.",
  },
  {
    term: "Coinsurance",
    meaning:
      "Plan-calculated percentage cost sharing under the plan's terms, often applied to an allowed amount after any applicable deductible.",
  },
  {
    term: "Adjustment",
    meaning:
      "A change shown during claim or bill processing. Ask the provider and health plan what the label means for that specific record.",
  },
] as const;

function rightsLabel(status: (typeof CODE_RIGHTS_ENTRIES)[number]["rightsStatus"]) {
  if (status === "verified-restricted") {
    return "Verified restricted — exact descriptions disabled";
  }
  if (status === "verified-permitted") {
    return "Verified for the documented use";
  }
  return "Rights review pending — exact descriptions disabled";
}

export default function CodesExplainedPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://medicalbillreader.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Code Systems Explained",
        item: PAGE_URL,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Medical Billing Code Systems Explained",
    description:
      "System-level education about common medical billing code families, their limits, rights status, and official sources.",
    datePublished: "2026-04-26",
    dateModified: CODE_RIGHTS_REVIEW_DATE,
    author: {
      "@type": "Person",
      name: "Jason Ramirez",
      jobTitle: "Web professional and product founder",
      url: "https://medicalbillreader.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: "https://medicalbillreader.com",
    },
    mainEntityOfPage: PAGE_URL,
  };

  return (
    <main
      id="main-content"
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
      >
        <Link href="/" className="hover:text-teal-800 dark:hover:text-teal-300">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span>Code Systems Explained</span>
      </nav>

      <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        Medical Billing Code Systems Explained
      </h1>
      <p className="mb-6 text-sm text-gray-700 dark:text-gray-300">
        Source and rights review: August 23, 2026. Written by{" "}
        <Link href="/about" className="underline underline-offset-2">
          Jason Ramirez
        </Link>
        , a web professional and product founder, not a certified coder or
        billing specialist.
      </p>

      <div
        role="note"
        className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200"
      >
        <strong>Important:</strong> This is system-level education, not a code
        lookup, coding audit, coverage decision, or payment determination. A code
        printed on a bill or EOB does not by itself prove what occurred, whether
        documentation supports it, or what someone legally owes.
      </div>

      <p className="mb-8 leading-7 text-gray-700 dark:text-gray-300">
        Exact code-and-description examples are intentionally omitted while
        product rights remain unresolved. Use the official source for the system
        and ask the provider or insurer to explain a code in the context of the
        original record.
      </p>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="self-start lg:sticky lg:top-6">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            On this page
          </h2>
          <ul className="space-y-2 text-sm">
            {CODE_RIGHTS_ENTRIES.map((system) => (
              <li key={system.id}>
                <a
                  href={`#${system.id}`}
                  className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
                >
                  {system.name}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#bill-fields"
                className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
              >
                Bill and EOB fields
              </a>
            </li>
          </ul>
        </aside>

        <div>
          {CODE_RIGHTS_ENTRIES.map((system) => {
            const copy = SYSTEM_COPY[system.id];
            return (
              <section
                key={system.id}
                id={system.id}
                className="mb-10 scroll-mt-24"
              >
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {system.name}
                </h2>
                <p className="mb-3 leading-7 text-gray-700 dark:text-gray-300">
                  {copy.purpose}
                </p>
                <p className="mb-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  <strong>Limits:</strong> {copy.limitation}
                </p>
                <p className="mb-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  <strong>Question to ask:</strong> {copy.question}
                </p>
                <p className="mb-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  <strong>Rights status:</strong>{" "}
                  {rightsLabel(system.rightsStatus)}. {system.rightsSummary}
                </p>
                <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                  <strong>Official source:</strong>{" "}
                  <a
                    href={system.officialSource}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
                  >
                    {system.officialSourceLabel}
                  </a>{" "}
                  ({system.sourceReviewStatus === "reviewed-primary"
                    ? "primary licensing source reviewed"
                    : "system source listed; rights review pending"}
                  ).
                </p>
              </section>
            );
          })}

          <section id="bill-fields" className="mb-10 scroll-mt-24">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Bill and EOB fields are not code determinations
            </h2>
            <dl className="space-y-4">
              {BILL_FIELDS.map((field) => (
                <div
                  key={field.term}
                  className="border-b border-gray-100 pb-4 dark:border-gray-800"
                >
                  <dt className="font-semibold text-gray-900 dark:text-gray-100">
                    {field.term}
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">
                    {field.meaning}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Related:{" "}
              <Link
                href="/methodology"
                className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
              >
                Methodology
              </Link>
              {" · "}
              <Link
                href="/#analyzer"
                className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
              >
                Analyze a bill
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
