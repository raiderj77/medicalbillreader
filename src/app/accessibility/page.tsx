import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement | Medical Bill Reader",
  description:
    "Accessibility statement for MedicalBillReader.com, including its WCAG target, current measures, known limitations, and feedback channel.",
  keywords: "accessibility, WCAG, medical bill reader, accessible, screen reader, disability",
  alternates: {
    canonical: "https://medicalbillreader.com/accessibility",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Accessibility Statement | Medical Bill Reader",
    description: "Medical Bill Reader's accessibility target, current measures, known limitations, and feedback channel.",
    url: "https://medicalbillreader.com/accessibility",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "Accessibility", item: "https://medicalbillreader.com/accessibility" },
  ],
};

export default function AccessibilityPage() {
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
          Accessibility Statement
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-8">
          Last Updated: August 2, 2026
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Our Commitment</h2>
          <p>
            Medical Bill Reader works to improve digital accessibility for people
            with disabilities. Accessibility is an ongoing engineering and content
            requirement, and feedback about barriers is welcomed.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Conformance Status</h2>
          <p>
            The site targets the{" "}
            <strong>Web Content Accessibility Guidelines (WCAG) 2.2 Level AA</strong>.
            This is a development target, not a certification or claim that every
            page and workflow fully conforms. Medical Bill Reader has not completed
            an independent WCAG conformance audit.
          </p>
          <p>
            Because medical billing can be stressful and cognitively demanding, the
            site also aims for plain language, predictable navigation, and restrained
            interfaces where practical.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Measures We Take</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Semantic landmarks, headings, lists, and native controls in current templates</li>
            <li>A global skip-to-main-content link with matching main-content targets</li>
            <li>Visible labels for the upload and processing-acknowledgement controls</li>
            <li>Keyboard-operable native controls and visible focus styles in the core workflow</li>
            <li>Descriptive page titles, link text, and form error messages</li>
            <li>
              After a report is delivered, focus moves to its titled result heading
              so keyboard and screen-reader users are taken to the new content
            </li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Known Limitations</h2>
          <p>
            Current limitations and areas needing continued verification include:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Uploaded bill images:</strong> A user-provided image may not include an equivalent text alternative. The generated report is rendered as browser text but can still contain AI errors.</li>
            <li><strong>PDF source documents:</strong> An uploaded PDF may not be accessible in its original form; Medical Bill Reader does not remediate the source PDF.</li>
            <li><strong>Assistive-technology coverage:</strong> The site has not been comprehensively tested across every browser, screen reader, magnifier, voice-control product, and input method.</li>
          </ul>
          <p>
            <strong>Analytics:</strong> Third-party analytics is disabled
            site-wide. Medical Bill Reader does not load Google Analytics or send
            site-usage data to it.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Geographic Scope</h2>
          <p>
            Medical Bill Reader is intended and offered only to people in the
            United States and U.S. territories. It is not offered or marketed to
            people in the European Economic Area, United Kingdom, or Switzerland.
            This statement describes a voluntary accessibility target and does not
            claim certification or compliance with a foreign accessibility regime.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of Medical Bill Reader. If you encounter
            any accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Email: <a href="mailto:support@medicalbillreader.com" className="text-teal-800 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">support@medicalbillreader.com</a></li>
            <li>Contact form: <Link href="/contact" className="text-teal-800 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">Contact page</Link></li>
          </ul>
          <p>
            We review accessibility feedback as it is received. Response times can
            vary; do not include a medical bill or other sensitive document in email.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Technical Specifications</h2>
          <p>
            Medical Bill Reader relies on the following technologies for accessibility:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>HTML5</li>
            <li>WAI-ARIA</li>
            <li>CSS / Tailwind CSS</li>
            <li>JavaScript / Next.js (server-side rendered)</li>
          </ul>
          <p>
            These technologies support the accessibility target but do not establish
            conformance by themselves.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Assessment Method</h2>
          <p>
            Current assessment consists of automated build and source checks plus
            developer review during changes. It does not represent a completed
            independent accessibility audit or comprehensive screen-reader test
            matrix.
          </p>
        </div>
      </div>
    </main>
  );
}
