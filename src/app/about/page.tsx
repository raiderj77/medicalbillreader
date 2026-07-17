import type { Metadata } from "next";
import Link from "next/link";
import AnswerBlock from "@/components/AnswerBlock";
import Disclaimer from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "About Jason Ramirez ,  Medical Bill Reader",
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
    title: "About Jason Ramirez ,  Medical Bill Reader",
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
      name: "Who built Medical Bill Reader and why?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Medical Bill Reader was built by Jason Ramirez, Founder of Your Friendly Developer. He built it after seeing how many patients struggle to understand confusing medical bills. The goal is to make medical billing transparent and accessible to everyone, regardless of their medical or insurance knowledge.",
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
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-4 text-center">Last reviewed: July 16, 2026</p>

        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-6">
          Hi. I&apos;m Jason Ramirez. This is why I built this.
        </p>

        <AnswerBlock
          what="A free-to-start AI tool that attempts to organize visible medical-bill charges, codes, and insurance fields into a plain-language report."
          who="Patients, families, and caregivers who want to understand confusing medical bills or insurance EOBs before paying."
          bottomLine="Upload a supported file for an AI-assisted first pass. Verify important findings against the source; results are not financial or medical advice."
          lastUpdated="2026-07-16"
        />

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
          {/* What It Does */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              What Medical Bill Reader Does
            </h2>
            <p>
              Medical Bill Reader helps you understand confusing medical bills and
              insurance Explanations of Benefits (EOBs) in plain language ,  no medical
              degree required. The AI attempts to organize visible charges, billing
              codes, and insurance fields, and may flag patterns for you to verify.
            </p>
            <p>
              Medical billing in the United States is notoriously complex. A single
              hospital visit can generate multiple bills from different providers, each
              filled with procedure codes, diagnostic codes, and insurance adjustments
              that can be difficult to interpret. Medical
              Bill Reader was built to change that. We believe every patient deserves
              to understand what they are being charged for and where to ask questions.
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
              No account is required for the free tier. Your bill is transmitted to Anthropic solely for analysis and is not intentionally stored in Medical Bill Reader&apos;s own database.
            </p>
          </section>

          {/* Common Medical Billing Terms */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Common Medical Billing Terms Explained
            </h2>
            <p>
              Medical bills are full of specialized terminology. Here are some of the
              most common terms you will encounter and what they actually mean:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>CPT Codes (Current Procedural Terminology):</strong> Five-digit
                codes assigned to every medical procedure or service performed. For
                example, CPT code 99213 represents a standard office visit. These codes
                determine how much your provider bills for each service.
              </li>
              <li>
                <strong>EOB (Explanation of Benefits):</strong> A document your insurance
                company sends after processing a claim. It shows what the provider
                charged, what the insurance paid, and what you still owe. An EOB is not a
                bill ,  it is a summary of how your claim was handled.
              </li>
              <li>
                <strong>Deductible:</strong> The amount you must pay out of pocket each
                year before your insurance starts covering costs. For example, with a
                $1,500 deductible, you pay the first $1,500 of covered services yourself.
              </li>
              <li>
                <strong>Coinsurance:</strong> The percentage of costs you share with your
                insurance after meeting your deductible. If your plan has 20% coinsurance,
                you pay 20% of covered charges and your insurer pays 80%.
              </li>
              <li>
                <strong>Out-of-Pocket Maximum:</strong> The most you will pay in a
                plan year for covered, in-network services. Once you reach this limit, your
                plan generally covers remaining covered, in-network costs for that plan year. This
                amount includes your deductible, copays, and coinsurance.
              </li>
              <li>
                <strong>Copay:</strong> A fixed dollar amount you pay for a specific
                service, such as $30 for a doctor visit or $15 for a prescription. Copays
                are set by your insurance plan and can depend on the service and network status.
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
              Understanding your bill is the first step toward catching these errors.
              When you know what each charge means, you can verify that the services
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
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Who built Medical Bill Reader and why?</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Medical Bill Reader was built by Jason Ramirez, Founder of Your Friendly Developer. He built it after seeing how many patients struggle to understand confusing medical bills. The goal is to make medical billing transparent and accessible to everyone, regardless of their medical or insurance knowledge.
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
