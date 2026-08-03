import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "About Jason Ramirez | Medical Bill Reader",
  description:
    "Jason Ramirez, Founder of Your Friendly Developer, built Medical Bill Reader to help patients understand confusing medical bills, insurance EOBs, and healthcare charges in plain language.",
  keywords:
    "about medical bill reader, Jason Ramirez, understand medical bills, EOB explanation, medical billing help, CPT codes, deductible, coinsurance",
  authors: [{ name: "Jason Ramirez", url: "https://medicalbillreader.com/about" }],
  alternates: {
    canonical: "https://medicalbillreader.com/about",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "About Jason Ramirez | Medical Bill Reader",
    description: "Jason Ramirez, Founder of Your Friendly Developer, built Medical Bill Reader to help patients understand confusing medical bills, insurance EOBs, and healthcare charges in plain language.",
    url: "https://medicalbillreader.com/about",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jason Ramirez",
  jobTitle: "Founder of Your Friendly Developer",
  worksFor: { "@type": "Organization", name: "Your Friendly Developer LLC" },
  url: "https://medicalbillreader.com/about",
};

const aboutFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Who built Medical Bill Reader, and what is his scope?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Medical Bill Reader was built by Jason Ramirez, Founder of Your Friendly Developer. His professional background is web and product development, not medicine, insurance, law, certified coding, or medical billing. The product attempts to organize visible bill and EOB fields into a plain-language report that users must verify.",
      },
    },
    {
      "@type": "Question",
      name: "How does the AI bill analysis tool work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You upload a supported medical bill or EOB. The AI attempts to organize legible line items, codes, and insurance fields into a report and may identify patterns to verify. It can miss or misread information.",
      },
    },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Medical Bill Reader",
  url: "https://medicalbillreader.com",
  description:
    "AI-assisted tool that organizes visible billing codes, charges, and insurance fields from supported medical bills and EOBs.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@medicalbillreader.com",
    url: "https://medicalbillreader.com/contact",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "About", item: "https://medicalbillreader.com/about" },
  ],
};

export default function AboutPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">
          About Medical Bill Reader
        </h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-4 text-center">Last reviewed: August 2, 2026</p>

        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
          Hi. I&apos;m Jason Ramirez. Here is my role and the product&apos;s scope.
        </p>

        <p className="mb-6 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          My professional background is web and product development. I am not a
          clinician, attorney, insurer, financial adviser, certified medical
          coder, or billing specialist. The site&apos;s{" "}
          <Link href="/editorial-policy" className="underline underline-offset-2">
            editorial policy
          </Link>{" "}
          explains how source-backed content and corrections are handled.
        </p>

        <AnswerBlock
          what="A free-to-start AI tool that attempts to organize visible medical-bill charges, codes, and insurance fields into a plain-language report."
          who="Patients, families, and caregivers who want to understand confusing medical bills or insurance EOBs before paying."
          bottomLine="Upload a supported file for an AI-assisted first pass. Verify important findings against the source; results are not financial or medical advice."
          lastUpdated="2026-08-02"
        />

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
          {/* What It Does */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              What Medical Bill Reader Does
            </h2>
            <p>
              Medical Bill Reader helps you understand confusing medical bills and
              insurance Explanations of Benefits (EOBs) in plain language. The
              AI attempts to organize visible charges, billing
              codes, and insurance fields, and may flag patterns for you to verify.
            </p>
            <p>
              Medical billing in the United States is notoriously complex. A single
              hospital visit can generate multiple bills from different providers, each
              filled with procedure codes, diagnostic codes, and insurance adjustments
              that can be difficult to interpret. Medical Bill Reader attempts to
              organize visible fields into a more readable report and identify
              questions the user can verify with the provider or health plan.
            </p>
            <p>
              The AI attempts to read visible bill content and return a structured
              summary. It may flag apparent duplicates or code combinations for
              review, but it cannot determine that a charge is wrong. Users should
              confirm important items with the provider or insurer.
            </p>
          </section>

          {/* Who It Helps */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Who Medical Bill Reader Helps
            </h2>
            <p>
              Medical Bill Reader is designed for anyone who has ever been confused by
              a medical bill. That includes patients who receive unexpected charges
              after a doctor visit or hospital stay, families trying to understand what
              their insurance actually covered, individuals reviewing an Explanation of
              Benefits from their insurer and struggling to match it against provider
              bills, uninsured or underinsured patients reviewing charges, and
              caregivers managing medical bills for family members.
            </p>
            <p>
              Report quality depends on document clarity, layout, and complexity. AI
              output can be incomplete or incorrect.
            </p>
          </section>

          {/* How to Use It */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              How to Use Medical Bill Reader
            </h2>
            <p>
              Take a photo of your medical bill or save it as a supported file. Next,
              upload it through the homepage file picker and keep the page open while
              the request runs. Review the returned report against the original bill
              and EOB before relying on any item.
            </p>
            <p>
              No account is required for the free tier. Your bill is transmitted
              to Anthropic for the requested report and is not intentionally
              stored in Medical Bill Reader&apos;s own database. Anthropic&apos;s
              published standard commercial API retention is up to 30 days,
              subject to account, policy, safety, and legal exceptions. Remove
              unnecessary identifiers and read the{" "}
              <Link href="/consumer-health-data-privacy" className="underline underline-offset-2">
                Consumer Health Data Privacy Notice
              </Link>{" "}
              before uploading.
            </p>
          </section>

          {/* Common Medical Billing Terms */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Common Medical Billing Terms Explained
            </h2>
            <p>
              Medical bills use specialized terminology. These general definitions
              can help you locate fields to verify against the bill, EOB, and plan
              documents; they do not determine coverage or what you legally owe:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>CPT Codes (Current Procedural Terminology):</strong> A copyrighted
                code set maintained by the American Medical Association and used to
                report many professional services and procedures. A reported code does
                not by itself prove what occurred, medical necessity, coverage, or the
                amount a patient owes. Verify a current descriptor through an authorized
                source rather than relying on an informal summary.
              </li>
              <li>
                <strong>EOB (Explanation of Benefits):</strong> A statement from a
                health plan describing how it processed a claim. It may show the billed
                amount, allowed amount, plan payment, adjustments, and the plan&apos;s
                calculated patient responsibility. An EOB is not a provider bill and
                does not by itself establish the amount you legally owe; compare it with
                the provider&apos;s bill and plan documents.
              </li>
              <li>
                <strong>Deductible:</strong> The amount a plan member generally pays for
                covered services that are subject to the deductible before the plan
                begins paying its share. Some services may be covered before the
                deductible is met, and not every payment counts toward it; check the plan.
              </li>
              <li>
                <strong>Coinsurance:</strong> A percentage of the plan&apos;s allowed
                amount that a member may owe for a covered service, often after an
                applicable deductible. The percentage and calculation depend on the
                plan, service, and network rules and are not automatically based on the
                provider&apos;s billed charge.
              </li>
              <li>
                <strong>Out-of-Pocket Maximum:</strong> A plan-year limit on eligible
                cost sharing for covered care under the plan&apos;s terms. Premiums,
                non-covered services, and some out-of-network amounts may not count.
                Check the plan for what counts and what happens after the limit is met.
              </li>
              <li>
                <strong>Copay:</strong> A fixed amount a plan may require as cost
                sharing for a covered service. The amount and whether it applies depend
                on the service, network status, and plan terms.
              </li>
              <li>
                <strong>Allowed Amount:</strong> The maximum amount your insurance plan
                recognizes for a covered service. Whether an amount above it is your
                responsibility depends on network status, plan terms, and applicable protections.
              </li>
            </ul>
          </section>

          {/* Why It Matters */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Why Understanding Your Medical Bill Matters
            </h2>
            <p>
              CMS recommends checking that the services and supplies on the provider
              bill match what you received and comparing the amount with the
              Explanation of Benefits.
            </p>
            <p>
              Understanding the visible fields can help you ask more specific
              questions. When you know what each charge label means, you can verify that the services
              listed match what you actually received. You can compare your provider
              bill against your insurance EOB to make sure the numbers align. And you
              can make informed decisions about whether to dispute a charge, negotiate
              a payment plan, or apply for financial assistance.
            </p>
            <p>
              Medical Bill Reader is intended to make that review easier to organize.
              It does not replace the provider, insurer, or a qualified billing advocate.
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Frequently Asked Questions About Medical Bill Reader
            </h2>
            <div className="space-y-4 mt-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Who built Medical Bill Reader, and what is his scope?</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Medical Bill Reader was built by Jason Ramirez, Founder of Your
                  Friendly Developer. His professional background is web and product
                  development, not medicine, insurance, law, certified coding, or
                  medical billing. The product attempts to organize visible bill and
                  EOB fields into a plain-language report that users must verify.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">How does the AI bill analysis tool work?</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  You upload a supported medical bill or EOB. The AI attempts to organize legible line items, codes, and insurance fields into a report and may identify patterns to verify. It can miss or misread information.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <Disclaimer />
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300">
          <p className="font-medium text-slate-700 dark:text-slate-300">Jason Ramirez</p>
          <p>Your Friendly Developer LLC</p>
        </div>

      </div>
    </main>
  );
}
