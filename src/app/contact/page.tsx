import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Medical Bill Reader",
  description:
    "Get in touch with the MedicalBillReader team for questions, privacy requests, or feedback about our medical bill analysis tool.",
  keywords: "contact medical bill reader, support, feedback, privacy request",
  robots: "index, follow, max-snippet:-1",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Stethoscope">
              🩺
            </span>
            <span className="font-bold text-slate-800 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h1>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700 text-[15px] leading-relaxed">
          <section>
            <p>
              The MedicalBillReader team is here to help. Whether you have a
              question about how the tool works, want to report a problem, or
              need to submit a privacy-related request, we are happy to assist.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">
              General Inquiries
            </h2>
            <p>
              For general questions, feedback, or support requests, email us at:
            </p>
            <p>
              <a
                href="mailto:support@medicalbillreader.com"
                className="text-teal-600 hover:text-teal-800 underline font-semibold"
              >
                support@medicalbillreader.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">
              Privacy &amp; Data Requests
            </h2>
            <p>
              For privacy inquiries, data deletion requests, or questions about
              how we handle your information, email us at:
            </p>
            <p>
              <a
                href="mailto:privacy@medicalbillreader.com"
                className="text-teal-600 hover:text-teal-800 underline font-semibold"
              >
                privacy@medicalbillreader.com
              </a>
            </p>
            <p>
              We respond to all privacy requests within 45 days as required by
              applicable law. For details on how we handle your data, see our{" "}
              <Link
                href="/privacy"
                className="text-teal-600 hover:text-teal-800 underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800">
              Response Times
            </h2>
            <p>
              We aim to respond to all inquiries within 1-2 business days.
              Privacy and data requests are handled within the timeframes
              required by your state or country&apos;s privacy laws.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <div className="p-5 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <p className="text-amber-900 font-semibold text-base mb-2">
                Important Notice
              </p>
              <p className="text-amber-800 text-sm leading-relaxed">
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
