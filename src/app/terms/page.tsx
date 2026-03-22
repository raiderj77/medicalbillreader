import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Medical Bill Reader",
  description:
    "Terms of Service for MedicalBillReader.com. Understand the terms and conditions governing your use of our medical bill analysis tool.",
  keywords: "terms of service, medical bill reader, terms and conditions, user agreement",
  alternates: {
    canonical: "https://medicalbillreader.com/terms",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Terms of Service — Medical Bill Reader",
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
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Effective Date: January 1, 2026 | Last Reviewed: March 2026
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
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              2. Description of Service
            </h2>
            <p>
              Medical Bill Reader is an AI-powered tool that helps consumers
              understand their medical bills, insurance Explanations of Benefits
              (EOBs), and healthcare charges. The Service analyzes uploaded
              medical bill images or PDFs and provides plain-English explanations
              of charges, billing codes, and potential errors.
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
              4. Use of the Service
            </h2>
            <p>You agree to:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Use the Service only for lawful purposes.</li>
              <li>
                Upload only medical bills and related documents that you are
                authorized to access.
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
              5. Privacy and Data Handling
            </h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-teal-600 hover:text-teal-800 underline"
              >
                Privacy Policy
              </Link>
              . Key points:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>
                Uploaded medical bills are deleted immediately after analysis.
              </li>
              <li>
                Bill contents are never stored, logged, or retained on our
                servers.
              </li>
              <li>
                Analysis results exist only in your browser session and are not
                stored server-side.
              </li>
              <li>
                Bill images are sent to Anthropic&apos;s Claude API for
                processing. Anthropic does not use API inputs for model training.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              6. AI-Generated Content
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
              7. Limitation of Liability
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
              non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              8. Intellectual Property
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
              9. Service Availability
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
              10. Changes to Terms
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
              11. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance
              with the laws of the United States. Any disputes arising from these
              terms or your use of the Service shall be resolved in the
              appropriate courts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              12. Contact
            </h2>
            <p>
              If you have questions about these Terms of Service, please contact
              us at{" "}
              <a
                href="mailto:support@medicalbillreader.com"
                className="text-teal-600 hover:text-teal-800 underline"
              >
                support@medicalbillreader.com
              </a>{" "}
              or visit our{" "}
              <Link
                href="/contact"
                className="text-teal-600 hover:text-teal-800 underline"
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
