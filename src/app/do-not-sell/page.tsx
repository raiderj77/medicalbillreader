import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Do Not Sell or Share My Personal Information ,  Medical Bill Reader",
  description:
    "Exercise your right under CCPA/CPRA to opt out of the sale or sharing of your personal information on MedicalBillReader.com.",
  keywords: "do not sell, CCPA, CPRA, personal information, opt out, privacy rights, California",
  alternates: {
    canonical: "https://medicalbillreader.com/do-not-sell",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Do Not Sell or Share My Personal Information ,  Medical Bill Reader",
    description: "Exercise your CCPA/CPRA right to opt out of the sale or sharing of personal information.",
    url: "https://medicalbillreader.com/do-not-sell",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "Do Not Sell or Share My Personal Information", item: "https://medicalbillreader.com/do-not-sell" },
  ],
};

export default function DoNotSellPage() {
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
          Do Not Sell or Share My Personal Information
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Your rights under the California Consumer Privacy Act (CCPA/CPRA) and other state privacy laws
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <div className="bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <p className="font-semibold text-teal-800 dark:text-teal-200">
              Medical Bill Reader does not sell your personal information or health data. We never
              have, and we never will.
            </p>
          </div>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Our Data Practices</h2>
          <p>
            Medical billing data is classified as sensitive personal information under the expanded
            CCPA 2026 definitions. We take this classification seriously:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>We do <strong>not sell</strong> any personal information to third parties</li>
            <li>We do <strong>not share</strong> personal information for cross-context behavioral advertising</li>
            <li>We do <strong>not sell or share</strong> medical bill content, health data, or billing codes under any circumstances</li>
            <li>Uploaded medical bills pass through application memory, are transmitted to Anthropic solely for analysis, and are <strong>not intentionally stored in our own database</strong></li>
            <li>We do <strong>not</strong> use health data for advertising targeting</li>
            <li>We do <strong>not</strong> send medical bill content or analysis results to analytics or advertising systems</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Analytics and Third Parties</h2>
          <p>
            If you opt in, Google Analytics receives limited website usage data. We do not sell that
            data, and we do not send medical bill content or analysis results to Google Analytics.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">How to Opt Out</h2>
          <p>Even though we do not sell personal information, you can take these steps to further control your data:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>
              <strong>Global Privacy Control (GPC):</strong> Enable GPC in your browser. We automatically
              honor GPC signals as a valid opt-out request under CCPA/CPRA. Learn more at{" "}
              <a href="https://globalprivacycontrol.org/" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">
                globalprivacycontrol.org
              </a>.
            </li>
            <li>
              <strong>Privacy choices:</strong> Use the Privacy choices button in the bottom-left corner
              of any page to withdraw consent for optional analytics at any time.
            </li>
            <li>
              <strong>Contact us directly:</strong> Email{" "}
              <a href="mailto:support@medicalbillreader.com" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
                support@medicalbillreader.com
              </a>{" "}
              or visit our{" "}
              <Link href="/contact" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
                Contact page
              </Link>{" "}
              to submit an opt-out request. We respond within 15 business days.
            </li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Your Rights</h2>
          <p>Under CCPA/CPRA and similar state privacy laws, you have the right to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Know</strong> what personal information we collect and how it is used</li>
            <li><strong>Delete</strong> your personal information</li>
            <li><strong>Correct</strong> inaccurate personal information</li>
            <li><strong>Opt out</strong> of the sale or sharing of personal information</li>
            <li><strong>Limit</strong> the use of sensitive personal information</li>
            <li><strong>Non-discrimination</strong> for exercising your privacy rights</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Applicable States</h2>
          <p>
            These rights apply to residents of California (CCPA/CPRA), Colorado, Connecticut,
            Virginia, Tennessee, Minnesota, Maryland, Indiana, Kentucky, Rhode Island, and other
            states with consumer privacy laws. We extend these rights to all users regardless of
            location.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
            For complete details about our data practices, see our{" "}
            <Link href="/privacy" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
