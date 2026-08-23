import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Medical Bill Reader",
  description:
    "Terms of Service for MedicalBillReader.com. Understand the terms and conditions governing your use of our medical bill analysis tool.",
  keywords: "terms of service, medical bill reader, terms and conditions, user agreement",
  alternates: {
    canonical: "https://medicalbillreader.com/terms",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Terms of Service | Medical Bill Reader",
    description: "Terms of Service for MedicalBillReader.com. Understand the terms and conditions governing your use of our medical bill analysis tool.",
    url: "https://medicalbillreader.com/terms",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://medicalbillreader.com/terms" },
  ],
};

export default function TermsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Stethoscope">
              🩺
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-8">
          Effective Date: August 2, 2026 | Last Reviewed: August 23, 2026
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using MedicalBillReader.com (&quot;the
              Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, do not use the Service.
            </p>
            <p>
              The Service is intended and offered only to people located in the
              United States and U.S. territories. It is not offered or marketed
              to people in the European Economic Area, United Kingdom, or
              Switzerland. Do not use the analyzer or submit personal data if you
              are outside the United States or its territories. Nothing in this
              geographic limitation waives a consumer protection that cannot
              lawfully be waived.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              2. Description of Service
            </h2>
            <p>
              Medical Bill Reader is an AI-powered tool that helps consumers
              understand their medical bills, insurance Explanations of Benefits
              (EOBs), and healthcare charges. The Service analyzes uploaded
               medical bill images or PDFs and provides a plain-English,
               AI-generated report of visible charges, billing fields, and items
               to verify. It cannot determine from the document alone that a
               charge, code, coverage decision, or amount is correct or incorrect.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              3. Not Medical, Financial, or Legal Advice
            </h2>
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>
                  The analysis provided by Medical Bill Reader is for
                  informational purposes only.
                </strong>{" "}
                It does not constitute medical advice, financial advice, legal
                advice, or a professional billing review. The Service does not
                replace consultation with qualified healthcare providers,
                certified medical billing specialists, financial advisors, or
                legal professionals. Always verify charges directly with your
                healthcare provider and insurance company before taking any
                action based on the analysis provided.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              4. Pricing and Billing
            </h2>
            <ul className="list-disc ml-6 space-y-1">
              <li>The free tier provides up to 1 medical bill or EOB analysis per browser per UTC calendar month, subject to network abuse controls. Clearing browser data does not authorize abuse or automated use.</li>
              <li>Pay-per-bill customers receive one analysis per purchase ($4.99).</li>
              <li>A one-time bill-and-EOB comparison is planned at $9.99 but is not currently available for purchase.</li>
              <li>New monthly subscriptions are not offered. A real existing monthly subscriber retains server-verified access under the existing subscription terms unless the subscription becomes ineligible or ends.</li>
              <li>Payments are processed securely through Stripe. We do not store your payment card details.</li>
              <li>Existing monthly subscriptions can be managed or cancelled through the Stripe-hosted billing portal and remain subject to the existing billing terms through the applicable period.</li>
              <li>If a pay-per-bill result is unsatisfactory, contact support within 24 hours of delivery for the published full-refund guarantee. We may request the minimum transaction detail needed to locate the payment.</li>
              <li>Single-analysis and existing-subscription access is browser-bound through essential cookies containing authenticated, encrypted entitlement tokens. The tokens do not expose raw Stripe identifiers. The single-analysis token lasts up to 24 hours; existing-subscription access may last up to 400 days and is reverified before use. Clearing site data or changing devices can require support-assisted recovery. Keep the Stripe receipt and do not email a medical bill.</li>
              <li>Monthly charges are not prorated or refunded for a partial month except where applicable law requires otherwise.</li>
              <li>If the analysis service fails before delivering a report, the application is designed not to consume the paid credit.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              5. Use of the Service
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Use the Service only for lawful purposes.</li>
              <li>
                Upload only medical bills and related documents that you are
                authorized to access.
              </li>
              <li>
                Remove identifiers that are not needed for the explanation. Do
                not use the public service on behalf of a HIPAA covered entity or
                where a business associate agreement is required.
              </li>
              <li>
                Not attempt to reverse-engineer, disassemble, or disrupt the
                Service.
              </li>
              <li>
                Not use the Service for any automated, bulk, or systematic data
                collection.
              </li>
              <li>
                Not upload content that is illegal, harmful, or violates the
                rights of others.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              6. Privacy and Data Handling
            </h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-teal-800 hover:text-teal-800 underline"
              >
                Privacy Policy
              </Link>
              . Key points:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Medical Bill Reader does not intentionally store uploaded bill documents in its own database.
              </li>
              <li>
                 Documents are transmitted to Anthropic to generate an analysis;
                 infrastructure providers process request data under their terms.
                 Anthropic states that standard commercial API inputs and outputs
                 are automatically deleted within 30 days, but policy-enforcement,
                 legal, and other published exceptions can be longer. Anthropic
                 says policy-flagged inputs and outputs may be retained for up to
                 two years and associated classification scores for up to seven
                 years. We do not claim that this public service has a
                 zero-data-retention agreement or Business Associate Agreement.
              </li>
              <li>
                Analysis results exist only in your browser session and are not
                stored server-side.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              7. AI-Generated Content
            </h2>
            <p>
              The Service uses artificial intelligence to analyze medical bills.
              AI-generated analysis may contain errors, omissions, or
              inaccuracies. You acknowledge that:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                AI analysis is not a substitute for professional human review.
              </li>
              <li>
                Results may not reflect the most current billing codes, rates, or
                insurance policies.
              </li>
              <li>
                You are responsible for verifying all information with your
                healthcare provider and insurance company.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              8. Limitation of Liability
            </h2>
            <p>
               To the fullest extent permitted by law, MedicalBillReader.com and
              its operators shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of the Service, including but not limited to errors in analysis,
              financial losses from acting on analysis results, or inability to
              access the Service.
            </p>
            <p>
              The Service is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
               implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, or
               non-infringement. Nothing in these Terms limits rights or remedies
               that cannot lawfully be limited.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              9. Intellectual Property
            </h2>
            <p>
              All content, design, and code on MedicalBillReader.com are
              protected by applicable intellectual property laws. You may not
              copy, modify, distribute, or reproduce any part of the Service
              without prior written consent.
            </p>
            <p>
              You retain all rights to the medical bills and documents you
              upload. We claim no ownership over your uploaded content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              10. Service Availability
            </h2>
            <p>
              We strive to keep the Service available at all times but do not
              guarantee uninterrupted access. The Service may be temporarily
              unavailable due to maintenance, updates, or circumstances beyond
              our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              11. Changes to Terms
            </h2>
            <p>
              We may update these Terms of Service at any time. Material changes
              will be posted on this page with an updated effective date. Your
              continued use of the Service after changes are posted constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              12. Governing Law
            </h2>
            <p>
               Applicable law governs these Terms. Nothing in this section waives
               mandatory consumer protections or a forum right that cannot
               lawfully be waived.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              13. Contact
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <a
                href="mailto:support@medicalbillreader.com"
                className="text-teal-800 hover:text-teal-800 underline"
              >
                support@medicalbillreader.com
              </a>{" "}
              or visit our{" "}
              <Link
                href="/contact"
                className="text-teal-800 hover:text-teal-800 underline"
              >
                Contact page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
