import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medical Billing Codes Explained: CPT, ICD-10, HCPCS, NDC, DRG",
  description:
    "Plain-English glossary of common medical billing code systems and abbreviations, with authoritative lookup links and questions to verify.",
  keywords: [
    "medical billing codes",
    "CPT codes explained",
    "ICD-10 codes",
    "HCPCS codes",
    "NDC drug codes",
    "DRG explained",
    "EOB abbreviations",
    "medical billing glossary",
  ],
  alternates: { canonical: "https://medicalbillreader.com/codes-explained" },
  robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
  openGraph: {
    title: "Medical Billing Codes Explained: CPT, ICD-10, HCPCS, NDC, DRG",
    description:
      "Plain-English definitions of common code types and abbreviations that may appear on a medical bill or EOB.",
    url: "https://medicalbillreader.com/codes-explained",
    type: "article",
  },
};

const PAGE_URL = "https://medicalbillreader.com/codes-explained";
const LAST_REVIEWED = "2026-08-02";

type CodeSystem = {
  slug: string;
  name: string;
  shortName: string;
  oneLine: string;
  usedFor: string;
  example: string;
  lookup: { label: string; href: string };
  watchFor: string;
};

const CODE_SYSTEMS: CodeSystem[] = [
  {
    slug: "cpt",
    name: "CPT (Current Procedural Terminology)",
    shortName: "CPT",
    oneLine:
      "Five-character codes maintained by the AMA that identify medical procedures and services.",
    usedFor:
      "CPT is widely used to describe professional and outpatient procedures, visits, tests, and imaging. Payment and coverage also depend on documentation, payer rules, setting, modifiers, contracts, and the plan.",
    example:
      "CPT 99213: an established-patient office or other outpatient visit. Time is one permitted selection method in applicable circumstances; medical decision-making can also determine the level.",
    lookup: {
      label: "AMA CPT overview",
      href: "https://www.ama-assn.org/practice-management/cpt",
    },
    watchFor:
      "Ask what documentation and payer rule support an unfamiliar code or combination. A bill alone cannot establish upcoding, unbundling, or whether the code was supported.",
  },
  {
    slug: "hcpcs",
    name: "HCPCS Level II",
    shortName: "HCPCS",
    oneLine:
      "Codes for medical equipment, supplies, drugs, ambulance services, and other items not covered by CPT.",
    usedFor:
      "HCPCS Level II covers things like wheelchairs, crutches, injectable medications administered in a clinical setting, durable medical equipment, and ambulance transport. CPT (HCPCS Level I) covers the procedures themselves; Level II covers the items.",
    example:
      "HCPCS J3490: unclassified drug, used to bill medications that do not have a specific code.",
    lookup: {
      label: "CMS HCPCS Level II",
      href: "https://www.cms.gov/medicare/coding-billing/healthcare-common-procedure-system",
    },
    watchFor:
      "If equipment is unfamiliar, ask whether it was rented or purchased and which benefit rule applied. For an unclassified drug code, ask for the drug name, quantity, and supporting detail.",
  },
  {
    slug: "icd-10-cm",
    name: "ICD-10-CM",
    shortName: "ICD-10-CM",
    oneLine:
      "Diagnosis codes that describe the patient's condition or the reason for the visit.",
    usedFor:
      "ICD-10-CM describes diagnoses, symptoms, and reasons for encounters. Payers may use diagnosis information with procedure codes, documentation, coverage rules, and plan terms when processing a claim.",
    example:
      "ICD-10-CM E11.9: type 2 diabetes mellitus without complications.",
    lookup: {
      label: "CMS ICD-10",
      href: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
    },
    watchFor:
      "If a diagnosis label is unfamiliar or appears inconsistent with your records, ask the provider to explain it. The code and bill alone do not prove the diagnosis or coding was wrong.",
  },
  {
    slug: "icd-10-pcs",
    name: "ICD-10-PCS",
    shortName: "ICD-10-PCS",
    oneLine:
      "Inpatient procedure codes used by hospitals for services delivered during an inpatient stay.",
    usedFor:
      "ICD-10-PCS is hospital-only. If you were admitted as an inpatient, the procedures performed during the stay are coded in ICD-10-PCS rather than CPT. The codes are seven characters long and describe the procedure in structured detail.",
    example:
      "ICD-10-PCS 0FT44ZZ: laparoscopic resection of the gallbladder.",
    lookup: {
      label: "CMS ICD-10-PCS",
      href: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
    },
    watchFor:
      "A character can change the procedure represented and may affect claim classification. Ask the hospital or payer to explain any unfamiliar code; do not infer an error from the code alone.",
  },
  {
    slug: "ndc",
    name: "NDC (National Drug Code)",
    shortName: "NDC",
    oneLine:
      "The current FDA-assigned NDC is a unique 10-digit, three-segment number identifying the labeler, product, and trade package size.",
    usedFor:
      "Current FDA formats are 4-4-2, 5-3-2, or 5-4-1. Some reimbursement transactions display a HIPAA-standard 11-digit form created by padding a segment with a leading zero. FDA's uniform 12-digit format takes effect March 7, 2033.",
    example:
      "Neutral 4-4-2 format example: 0000-0000-00 (labeler-product-package). This illustrates the 10-digit, three-segment format and is not a drug lookup.",
    lookup: {
      label: "FDA National Drug Code format",
      href: "https://www.fda.gov/drugs/electronic-drug-registration-and-listing-system-edrls/national-drug-code-format",
    },
    watchFor:
      "Confirm which NDC format the document uses, then compare the labeler, product, package, and quantity with the source record. Ask the provider, pharmacy, or payer to explain a mismatch rather than treating it as proof of an incorrect charge.",
  },
  {
    slug: "drg",
    name: "DRG (Diagnosis-Related Group)",
    shortName: "DRG",
    oneLine:
      "A classification used to set a fixed payment amount for an inpatient hospital stay, based on diagnoses and procedures.",
    usedFor:
      "Medicare uses MS-DRGs for many inpatient prospective payments, and some other payers use DRG-based methods. The assigned group can depend on diagnoses, procedures, patient characteristics, discharge status, and payer-specific rules.",
    example:
      "MS-DRG 470: major hip and knee joint replacement without major complications.",
    lookup: {
      label: "CMS MS-DRG",
      href: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software",
    },
    watchFor:
      "Itemized charges and the plan's calculated payment can differ substantially. Compare the EOB with the itemized bill and ask the hospital or payer which payment method applied.",
  },
  {
    slug: "modifiers",
    name: "Modifiers",
    shortName: "Modifiers",
    oneLine:
      "Two-character additions to a CPT or HCPCS code that change its meaning without changing the underlying procedure code.",
    usedFor:
      "Modifiers describe circumstances that affect payment: which side of the body, whether the service was bilateral, whether it was a separately identifiable service from another billed on the same day, and so on.",
    example:
      "Modifier 50: bilateral procedure. Modifier 25: significant, separately identifiable evaluation and management service on the same day as a procedure.",
    lookup: {
      label: "CMS modifier reference",
      href: "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-faq-library",
    },
    watchFor:
      "A modifier can materially affect processing. Ask which circumstance and documentation supported an unfamiliar modifier; the bill alone cannot show whether its use was appropriate.",
  },
  {
    slug: "place-of-service",
    name: "Place of Service codes",
    shortName: "Place of Service",
    oneLine:
      "Two-digit codes that indicate where the service was delivered.",
    usedFor:
      "Payers can process the same procedure differently by setting. Under the CMS code set, Place of Service 11 is office, 22 is on-campus outpatient hospital, and 21 is inpatient hospital. Other payment and facility-charge rules vary.",
    example:
      "POS 22: on-campus outpatient hospital under the CMS place-of-service code set.",
    lookup: {
      label: "CMS Place of Service code set",
      href: "https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets",
    },
    watchFor:
      "If the setting differs from what you expected, ask whether a facility charge or different payment rule applied and compare the EOB with advance notices and the provider bill.",
  },
  {
    slug: "revenue-codes",
    name: "Revenue codes",
    shortName: "Revenue codes",
    oneLine:
      "Four-digit codes used on the UB-04 hospital claim form to group charges by department or category.",
    usedFor:
      "Revenue codes describe the type of service or department the charge came from: room and board, pharmacy, operating room, lab, and so on. They are paired with HCPCS or CPT codes that describe the specific service.",
    example:
      "Revenue code 0450: emergency room, general classification. Revenue code 0250: pharmacy.",
    lookup: {
      label: "NUBC overview (publishers of UB-04)",
      href: "https://www.nubc.org/",
    },
    watchFor:
      "Ask about a department category that does not match your records or a pharmacy category that lacks enough detail to identify what was administered.",
  },
];

const ABBREVIATIONS: { term: string; meaning: string }[] = [
  { term: "EOB", meaning: "Explanation of Benefits, the insurer's record of how a claim was processed. Not a bill." },
  { term: "COB", meaning: "Coordination of Benefits, the rules that determine which plan pays first when you have more than one insurance." },
  { term: "AOB", meaning: "Assignment of Benefits, an authorization that lets the provider receive payment directly from the insurer." },
  { term: "DOS", meaning: "Date of Service, the date the care was actually delivered." },
  { term: "POS", meaning: "Place of Service code, indicating where care was delivered (office, outpatient hospital, inpatient hospital, etc.)." },
  { term: "PCP", meaning: "Primary Care Provider. A plan may designate a PCP and may require referrals for some services; check the plan." },
  { term: "PPO", meaning: "Preferred Provider Organization. Network, referral, and out-of-network benefits depend on the specific plan." },
  { term: "HMO", meaning: "Health Maintenance Organization. Network and referral rules depend on the plan and exceptions." },
  { term: "EPO", meaning: "Exclusive Provider Organization. Network and referral rules depend on the plan." },
  { term: "POS plan", meaning: "Point of Service plan. In-network, referral, and out-of-network terms depend on the plan." },
  { term: "Deductible", meaning: "The amount a member pays for covered services before the plan pays for services subject to the deductible; some benefits may apply before it is met." },
  { term: "Copay", meaning: "A fixed amount a plan may apply as cost sharing for a covered visit, service, or item; the amount and conditions depend on the plan." },
  { term: "Coinsurance", meaning: "Plan-calculated percentage cost sharing for a covered service under the plan's terms, often applied to the allowed amount after an applicable deductible." },
  { term: "OOP max", meaning: "Out-of-pocket maximum, a plan-year limit on eligible cost sharing for covered services. Check what the plan excludes." },
  { term: "Allowable / Allowed Amount", meaning: "The amount the plan treats as eligible when calculating benefits. It is not always the amount the plan pays or the amount the patient legally owes." },
  { term: "Adjustment / Write-off", meaning: "A reduction or adjustment shown during claim processing. Ask the provider and plan whether the patient owes any part of it." },
  { term: "N/C (Non-covered)", meaning: "A label that may indicate the plan treated all or part of an item as non-covered. Check the reason code, plan terms, and appeal notice." },
  { term: "N/A", meaning: "Not applicable, often used in EOB columns where a value would not make sense for that line." },
  { term: "Pending", meaning: "The claim has not finished processing yet." },
  { term: "Paid", meaning: "The insurer has paid its portion of the claim." },
  { term: "Denied", meaning: "The plan did not pay all or part of a claim. The notice should identify the reason and applicable review or appeal instructions." },
  { term: "Appealed", meaning: "A formal request to reconsider an adverse benefit decision. Follow the deadline and method in the plan's notice." },
];

export default function CodesExplainedPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
      { "@type": "ListItem", position: 2, name: "Codes Explained", item: PAGE_URL },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Medical Billing Codes Explained: CPT, ICD-10, HCPCS, NDC, DRG",
    description:
      "Plain-English glossary of medical billing code systems and abbreviations.",
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

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Medical Billing Codes and Abbreviations",
    url: PAGE_URL,
    hasDefinedTerm: [
      ...CODE_SYSTEMS.map((c) => ({
        "@type": "DefinedTerm",
        "@id": `${PAGE_URL}#${c.slug}`,
        name: c.name,
        description: c.oneLine,
        inDefinedTermSet: PAGE_URL,
        url: `${PAGE_URL}#${c.slug}`,
      })),
      ...ABBREVIATIONS.map((a, i) => ({
        "@type": "DefinedTerm",
        "@id": `${PAGE_URL}#abbr-${i}`,
        name: a.term,
        description: a.meaning,
        inDefinedTermSet: PAGE_URL,
      })),
    ],
  };

  return (
    <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSet) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-6"
      >
        <Link href="/" className="hover:text-teal-800 dark:hover:text-teal-400">Home</Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-600 dark:text-gray-300">Codes Explained</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
        Medical Billing Codes Explained
      </h1>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
        Last reviewed: August 2, 2026. Written by{" "}
        <Link href="/about" className="underline underline-offset-2">
          Jason Ramirez
        </Link>
        , a web professional and product founder, not a certified coder or
        billing specialist. See the{" "}
        <Link href="/editorial-policy" className="underline underline-offset-2">
          editorial policy
        </Link>
        .
      </p>

      <div
        role="note"
        className="mb-8 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 text-sm text-amber-800 dark:text-amber-300"
      >
        <strong>Disclaimer:</strong> This glossary is for informational
        purposes only. It is not financial or medical advice. For
        decisions about a specific bill, claim, or appeal, consult your
        insurer, your provider&apos;s billing office, or a qualified
        billing advocate.
      </div>

      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
        Many lines on a medical bill are paired with one or more codes. The
        submitted codes may represent a reported service, diagnosis or reason
        for an encounter, setting, item, or drug. A code on a bill does not by
        itself prove what occurred, whether documentation supports it, or what
        the plan should cover. The sections below define each code system in
        plain English, give an example, point to an authoritative lookup, and
        suggest questions to verify.
      </p>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="lg:sticky lg:top-6 self-start">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-3">
            On this page
          </h2>
          <ul className="space-y-2 text-sm">
            {CODE_SYSTEMS.map((c) => (
              <li key={c.slug}>
                <a
                  href={`#${c.slug}`}
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                >
                  {c.shortName}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#abbreviations"
                className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
              >
                EOB abbreviations
              </a>
            </li>
          </ul>
        </aside>

        <div>
          {CODE_SYSTEMS.map((c) => (
            <section
              key={c.slug}
              id={c.slug}
              className="mb-10 scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {c.name}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                <strong>{c.oneLine}</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                {c.usedFor}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                <span className="font-semibold">Example:</span> {c.example}
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                <span className="font-semibold">Lookup:</span>{" "}
                <a
                  href={c.lookup.href}
                  className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  {c.lookup.label}
                </a>
              </p>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                <span className="font-semibold">Watch for:</span> {c.watchFor}
              </p>
            </section>
          ))}

          <section id="abbreviations" className="mb-10 scroll-mt-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              EOB and billing abbreviations
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              These acronyms appear repeatedly across bills, EOBs, and
              insurance correspondence. Knowing what each one means makes the
              rest of the document readable.
            </p>
            <dl className="space-y-3">
              {ABBREVIATIONS.map((a) => (
                <div key={a.term} className="border-b border-gray-100 dark:border-gray-800 pb-3">
                  <dt className="font-semibold text-gray-900 dark:text-gray-100">
                    {a.term}
                  </dt>
                  <dd className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-1">
                    {a.meaning}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Related:{" "}
              <Link href="/methodology" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
                Methodology
              </Link>
              {" · "}
              <Link href="/blog" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
                Blog
              </Link>
              {" · "}
              <Link
                href="/#analyzer"
                className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline"
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
