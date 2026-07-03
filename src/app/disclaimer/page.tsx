import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Disclaimer ,  Medical Bill Reader",
  description:
    "Medical disclaimer for MedicalBillReader.com. This tool provides general explanations of medical billing codes and charges for informational purposes only.",
  keywords: "disclaimer, medical bill reader, not medical advice, not financial advice, informational only",
  alternates: {
    canonical: "https://medicalbillreader.com/disclaimer",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Disclaimer ,  Medical Bill Reader",
    description: "Medical disclaimer for MedicalBillReader.com. This tool is for informational purposes only.",
    url: "https://medicalbillreader.com/disclaimer",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "Disclaimer", item: "https://medicalbillreader.com/disclaimer" },
  ],
};

export default function DisclaimerPage() {
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

      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Disclaimer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Last Updated: March 2026
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="font-semibold text-amber-800 dark:text-amber-200">
              This tool provides general explanations of medical billing codes and charges for
              informational purposes only. It is not financial or medical advice.
            </p>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Medical Advice</h2>
          <p>
            Medical Bill Reader is an AI-powered tool that reads and explains medical bills in
            plain language. The information provided by this tool is for general educational and
            informational purposes only. It does not constitute medical advice, diagnosis, or
            treatment recommendations. Always consult a qualified healthcare provider for medical
            questions or concerns.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Financial Advice</h2>
          <p>
            The explanations of charges, billing codes, insurance terms, and potential billing
            errors provided by this tool do not constitute financial advice. We do not recommend
            specific financial actions. Always consult with your insurance company, healthcare
            provider&apos;s billing department, or a qualified financial advisor before making decisions
            based on this tool&apos;s output.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Legal Advice</h2>
          <p>
            Information about your rights, billing disputes, or insurance coverage is provided for
            general awareness only and does not constitute legal advice. If you believe you have a
            legal dispute regarding a medical bill, consult a qualified attorney.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">AI-Generated Content</h2>
          <p>
            All bill analysis is performed by artificial intelligence (AI). While we strive for
            accuracy, AI-generated explanations may contain errors, omissions, or misinterpretations.
            You should always verify the AI&apos;s output against your original bill and contact your
            healthcare provider or insurance company to confirm charges and amounts.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Guarantee of Accuracy</h2>
          <p>
            Medical billing is complex and varies by provider, insurance plan, state, and individual
            circumstances. We make no representations or warranties about the accuracy, completeness,
            or reliability of any analysis provided by this tool. The tool identifies common billing
            codes (CPT, ICD-10, HCPCS) and explains them in plain language, but codes and their
            meanings can change and may have context-specific interpretations.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Limitation of Liability</h2>
          <p>
            Medical Bill Reader, its operators, and affiliates are not liable for any damages,
            losses, or costs arising from your use of or reliance on this tool&apos;s output. This
            includes, but is not limited to, financial losses from billing disputes, delayed
            payments, or insurance coverage decisions.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Use at Your Own Risk</h2>
          <p>
            By using Medical Bill Reader, you acknowledge that the tool is provided &quot;as is&quot; and
            that you assume full responsibility for how you use the information it provides. We
            encourage you to use this tool as a starting point for understanding your bill, not as
            a definitive source.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Questions</h2>
          <p>
            If you have questions about this disclaimer, please visit our{" "}
            <Link href="/contact" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Contact page
            </Link>{" "}
            or email us at support@medicalbillreader.com.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
            See also:{" "}
            <Link href="/terms" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Terms of Service
            </Link>
            {" | "}
            <Link href="/privacy" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
