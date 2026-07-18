import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medical Billing Codes Explained: CPT, ICD-10, HCPCS, NDC, DRG",
  description:
    "Plain-English glossary of medical billing code systems and abbreviations: CPT, HCPCS, ICD-10-CM, ICD-10-PCS, NDC, DRG, modifiers, place of service, revenue codes, and the EOB acronyms that appear on every bill.",
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
      "Plain-English definitions of every code type and abbreviation that appears on a medical bill.",
    url: "https://medicalbillreader.com/codes-explained",
    type: "article",
  },
};

const PAGE_URL = "https://medicalbillreader.com/codes-explained";
const TODAY = new Date().toISOString().substring(0, 10);

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
      "Five-digit codes that identify clinical procedures and services performed by clinicians.",
    usedFor:
      "CPT is the main code set used to bill outpatient procedures, office visits, surgeries, lab tests, and imaging. Insurers use the code to decide reimbursement, and providers use it to describe what was done.",
    example: "CPT 99213: established patient office visit, 20 to 29 minutes.",
    lookup: {
      label: "AMA CPT overview",
      href: "https://www.ama-assn.org/practice-management/cpt",
    },
    watchFor:
      "Upcoding (a more complex code than the visit warranted), unbundling (billing component services separately when they should be combined), and codes that do not match the documented diagnosis.",
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
      "Equipment billed at a purchase price when it should have been a rental, and unspecified-drug codes (J3490, J3590) that obscure what was actually administered.",
  },
  {
    slug: "icd-10-cm",
    name: "ICD-10-CM",
    shortName: "ICD-10-CM",
    oneLine:
      "Diagnosis codes that describe the patient's condition or the reason for the visit.",
    usedFor:
      "ICD-10-CM is the diagnosis side of the bill. It tells the insurer why a service was needed. CPT says what was done; ICD-10-CM says why. Insurers cross-check the two to decide whether a service was medically necessary under your plan.",
    example:
      "ICD-10-CM E11.9: type 2 diabetes mellitus without complications.",
    lookup: {
      label: "CMS ICD-10",
      href: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
    },
    watchFor:
      "Diagnosis codes that do not match the procedures billed, which can lead to denied claims or accusations of upcoded diagnoses to justify higher-paying procedures.",
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
      "These codes drive DRG assignment for inpatient billing, so a single different character can change the dollar amount substantially. Request your itemized inpatient bill if anything looks off.",
  },
  {
    slug: "ndc",
    name: "NDC (National Drug Code)",
    shortName: "NDC",
    oneLine:
      "A unique 10 or 11-digit identifier for a specific drug, including manufacturer, product, and package size.",
    usedFor:
      "Pharmacies and clinics use NDC codes to bill medications. The code identifies the exact product, not just the active ingredient, so two NDCs can refer to the same drug from different manufacturers.",
    example:
      "NDC 0002-7510: a specific manufacturer-and-package code for a particular medication.",
    lookup: {
      label: "FDA National Drug Code Directory",
      href: "https://www.fda.gov/drugs/drug-approvals-and-databases/national-drug-code-directory",
    },
    watchFor:
      "Brand-name NDCs billed when a generic equivalent was approved and dispensed, and quantity errors that multiply the per-unit price.",
  },
  {
    slug: "drg",
    name: "DRG (Diagnosis-Related Group)",
    shortName: "DRG",
    oneLine:
      "A classification used to set a fixed payment amount for an inpatient hospital stay, based on diagnoses and procedures.",
    usedFor:
      "Medicare and many private insurers pay hospitals a single DRG-based amount per admission rather than itemizing every charge. The DRG is determined by the principal diagnosis, secondary diagnoses, procedures, age, sex, and discharge status.",
    example:
      "MS-DRG 470: major hip and knee joint replacement without major complications.",
    lookup: {
      label: "CMS MS-DRG",
      href: "https://www.cms.gov/medicare/payment/prospective-payment-systems/acute-inpatient-pps/ms-drg-classifications-and-software",
    },
    watchFor:
      "Hospital itemized bills can show charges that look enormous individually because the insurer pays a flat DRG amount regardless of the line-item totals. Compare the EOB to the itemized bill to see what the plan actually paid.",
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
      "Inappropriate use of modifier 25 to bill an evaluation and management visit on top of a procedure when the visit was not separately identifiable. This is a frequent source of overbilling.",
  },
  {
    slug: "place-of-service",
    name: "Place of Service codes",
    shortName: "Place of Service",
    oneLine:
      "Two-digit codes that indicate where the service was delivered.",
    usedFor:
      "Insurers reimburse the same procedure differently depending on the setting. Place of Service 11 is an office; 22 is on-campus outpatient hospital; 21 is inpatient hospital. Hospital-based clinics often bill at facility rates even when the visit looks like an office visit.",
    example:
      "POS 22: a clinic visit at an outpatient department of a hospital, billed at facility rates rather than office rates.",
    lookup: {
      label: "CMS Place of Service code set",
      href: "https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets",
    },
    watchFor:
      "Facility-rate billing for a visit at a hospital-owned clinic that you assumed was a regular office visit. The same CPT code paid at POS 22 can cost substantially more than at POS 11.",
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
      "Charges grouped under revenue codes that do not match the visit you actually had, and pharmacy revenue codes with no NDC detail to verify what was administered.",
  },
];

const ABBREVIATIONS: { term: string; meaning: string }[] = [
  { term: "EOB", meaning: "Explanation of Benefits, the insurer's record of how a claim was processed. Not a bill." },
  { term: "COB", meaning: "Coordination of Benefits, the rules that determine which plan pays first when you have more than one insurance." },
  { term: "AOB", meaning: "Assignment of Benefits, an authorization that lets the provider receive payment directly from the insurer." },
  { term: "DOS", meaning: "Date of Service, the date the care was actually delivered." },
  { term: "POS", meaning: "Place of Service code, indicating where care was delivered (office, outpatient hospital, inpatient hospital, etc.)." },
  { term: "PCP", meaning: "Primary Care Provider, your designated lead doctor. Some plans require referrals through the PCP." },
  { term: "PPO", meaning: "Preferred Provider Organization, a plan that pays out-of-network providers at a reduced rate without requiring referrals." },
  { term: "HMO", meaning: "Health Maintenance Organization, a plan that requires care from in-network providers and usually a referral from a PCP." },
  { term: "EPO", meaning: "Exclusive Provider Organization, similar to an HMO but typically no PCP referral required." },
  { term: "POS plan", meaning: "Point of Service plan, a hybrid that lets you go out of network at a higher cost." },
  { term: "Deductible", meaning: "What you pay out of pocket before the insurer starts paying covered expenses." },
  { term: "Copay", meaning: "A fixed dollar amount you pay per visit or service." },
  { term: "Coinsurance", meaning: "A percentage of the allowed amount you owe after the deductible is met." },
  { term: "OOP max", meaning: "Out-of-pocket maximum, the cap on what you can be required to pay in covered costs in a plan year." },
  { term: "Allowable / Allowed Amount", meaning: "The maximum the insurer treats as eligible for payment for a given service. Charges above the allowable are typically the provider's write-off (in network) or your responsibility (out of network)." },
  { term: "Adjustment / Write-off", meaning: "A reduction the provider agreed to under the network contract. You do not owe this amount." },
  { term: "N/C (Non-covered)", meaning: "The service is not covered under your plan, in part or in full." },
  { term: "N/A", meaning: "Not applicable, often used in EOB columns where a value would not make sense for that line." },
  { term: "Pending", meaning: "The claim has not finished processing yet." },
  { term: "Paid", meaning: "The insurer has paid its portion of the claim." },
  { term: "Denied", meaning: "The insurer has refused to pay, with a reason code that should appear on the EOB." },
  { term: "Appealed", meaning: "A formal request to the insurer to reconsider a denial. Most plans give you 180 days from the EOB date." },
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
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
        Last updated: {TODAY}. Built by an experienced web professional.
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
        codes tell the insurer what was done, why it was done, where it
        happened, and which item or drug was involved. The sections below
        define each code system in plain English, give an example, point to
        an authoritative lookup, and call out the most common mistakes to
        watch for.
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
              <p className="text-gray-600 dark:text-gray-600 text-sm leading-relaxed mb-3">
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
                  <dd className="text-sm text-gray-600 dark:text-gray-600 leading-relaxed mt-1">
                    {a.meaning}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-600">
              Related:{" "}
              <Link href="/methodology" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
                Methodology
              </Link>
              {" · "}
              <Link href="/blog" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
                Blog
              </Link>
              {" · "}
              <Link href="/" className="text-teal-800 dark:text-teal-300 underline underline-offset-2 hover:no-underline">
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
