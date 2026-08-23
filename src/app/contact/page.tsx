import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Medical Bill Reader",
  description:
    "Get in touch with the MedicalBillReader team for questions, privacy requests, or feedback about our medical bill analysis tool.",
  keywords: "contact medical bill reader, support, feedback, privacy request",
  alternates: {
    canonical: "https://medicalbillreader.com/contact",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Contact | Medical Bill Reader",
    description: "Get in touch with the MedicalBillReader team for questions, privacy requests, or feedback about our medical bill analysis tool.",
    url: "https://medicalbillreader.com/contact",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const contactFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I get help understanding my medical bill?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the homepage tool to request an AI-generated report from a supported medical bill or EOB. The report can be incomplete or incorrect. For technical questions, email support@medicalbillreader.com without attaching a bill or other health information.",
      },
    },
    {
      "@type": "Question",
      name: "Is my medical bill data safe if I contact you?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Do not send a medical bill or health information by email. Documents submitted through the upload tool pass through application memory and are transmitted to Anthropic for the requested analysis; Medical Bill Reader does not intentionally store them in its own database. Anthropic and infrastructure providers apply their disclosed retention terms.",
      },
    },
    {
      "@type": "Question",
      name: "What should I include in a support request?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Include the file type, file size, browser, device, and exact error message. Do not attach a medical bill or include health information in email.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://medicalbillreader.com/contact" },
  ],
};

export default function ContactPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqJsonLd) }}
      />
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Contact Us</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 mb-4 text-center">Last reviewed: August 23, 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed">
          <section>
            <p>
              The MedicalBillReader team is here to help. Whether you have a
              question about how the tool works, want to report a problem, or
              need to submit a privacy-related request, we are happy to assist.
              Medical Bill Reader is a free-to-start AI-assisted tool that
              organizes visible fields from supported medical bills and
              insurance Explanations of Benefits. AI output can be incomplete
              or incorrect and does not determine what you legally owe.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              What Kinds of Questions We Can Help With
            </h2>
            <p>
              Our support team can assist with a range of topics related to
              using Medical Bill Reader. If you are having trouble uploading a
              bill, receiving an error during analysis, or your results seem
              incomplete, we want to hear about it so we can improve the tool.
              We also welcome general feedback about the user experience,
              suggestions for new features, and questions about what file
              formats are supported. If you are unsure whether Medical Bill
              Reader supports a file type or size, you can ask before uploading.
              Do not describe diagnoses, treatments, providers, account details,
              or other health information in the message.
            </p>
            <p>
              Please note that we cannot provide medical advice, financial
              advice, or help you dispute a specific charge with your provider.
              The tool can organize visible information into questions to
              verify, but it cannot determine that a charge is wrong. Direct
              disputes or negotiations to your provider, insurer, or a
              qualified adviser.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              General Inquiries and Support
            </h2>
            <p>
              For general questions, feedback, or support requests, email us at:
            </p>
            <p>
              <a
                href="mailto:support@medicalbillreader.com"
                className="text-teal-800 hover:text-teal-800 underline font-semibold"
              >
                support@medicalbillreader.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              What to Include in Your Message for Faster Support
            </h2>
            <p>
              To help us resolve your issue as quickly as possible, please
              include the following details when you contact us:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>A brief description of the issue or question you have.</li>
              <li>The type of document you uploaded (medical bill, EOB, hospital statement, etc.).</li>
              <li>The file format you used (JPG, PNG, or PDF).</li>
              <li>The browser and device you were using (for example, Chrome on Windows or Safari on iPhone).</li>
              <li>Any error messages you saw during the upload or analysis process.</li>
            </ul>
            <p>
              Do not attach the bill or include patient, diagnosis, treatment,
              account, or other health information in the email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Privacy and Data Deletion Requests
            </h2>
            <p>
              Medical Bill Reader processes uploaded bills in application
              memory and transmits them to Anthropic for the requested report.
              We do not intentionally write bill files or report text to our own
              database, logs, or advertising systems. Anthropic&apos;s published
              standard commercial API policy provides automatic deletion within
              30 days, subject to account, policy, safety, and legal exceptions;
              this site does not claim zero-data retention. Your displayed
              report remains in page memory until you reset, refresh, close, or
              navigate away.
            </p>
            <p>
              If you have questions about how your data is handled, want to
              request deletion of any personal information we may hold such as
              server logs or analytics data, or need to exercise your rights
              under applicable privacy or consumer-health-data law, email us at:
            </p>
            <p>
              First read the{" "}
              <Link href="/privacy-request" className="font-semibold text-teal-800 underline">
                privacy request instructions
              </Link>
              . They explain how to begin without sending a bill, health data,
              payment details, or another sensitive locator.
            </p>
            <p>
              <a
                href="mailto:privacy@medicalbillreader.com"
                className="text-teal-800 hover:text-teal-800 underline font-semibold"
              >
                privacy@medicalbillreader.com
              </a>
            </p>
            <p>
              Response timing depends on the request and applicable law. For full details on how we collect, use, and
              protect your information, see our{" "}
              <Link
                href="/privacy"
                className="text-teal-800 hover:text-teal-800 underline"
              >
                Privacy Policy
              </Link>
              {" "}and{" "}
              <Link
                href="/consumer-health-data-privacy"
                className="text-teal-800 hover:text-teal-800 underline"
              >
                Consumer Health Data Privacy Notice
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Frequently Asked Questions About Contacting Us
            </h2>
            <div className="space-y-4 mt-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">How do I get help understanding my medical bill?</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  The fastest way to understand your medical bill is to use our
                  free tool on the{" "}
                  <Link href="/" className="text-teal-800 hover:text-teal-800 underline">homepage</Link>.
                  Upload a supported bill or EOB and review the AI-generated
                  report against the original document. If you
                  run into a technical issue, email us at
                  support@medicalbillreader.com without including the bill,
                  report, or health information.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">Is my medical bill data safe if I contact you?</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Do not send a medical bill or health information by email.
                  Bills submitted through the upload flow pass through
                  application memory and are transmitted to Anthropic for the
                  requested report. Anthropic and infrastructure providers apply
                  the retention terms described in the privacy notices. Technical
                  support does not need the bill or generated report.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">What should I include in a support request?</h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Include the file type, file size, browser, device, and exact
                  error message. Do not attach a bill or include health
                  information in email.
                </p>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <section>
            <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl">
              <p className="text-amber-900 dark:text-amber-300 font-semibold text-base mb-2">
                Important Notice
              </p>
              <p className="text-amber-800 dark:text-amber-400 text-sm leading-relaxed">
                The MedicalBillReader team cannot provide medical advice,
                financial advice, or billing dispute assistance. Our tool
                provides informational explanations of medical billing codes and
                charges only. For billing disputes, contact your healthcare
                provider&apos;s billing department or your insurance company
                directly.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
