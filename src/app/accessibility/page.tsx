import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility Statement ,  Medical Bill Reader",
  description:
    "Accessibility statement for MedicalBillReader.com. Our commitment to WCAG 2.1 AA compliance and making medical bill analysis accessible to everyone.",
  keywords: "accessibility, WCAG, medical bill reader, accessible, screen reader, disability",
  alternates: {
    canonical: "https://medicalbillreader.com/accessibility",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Accessibility Statement ,  Medical Bill Reader",
    description: "Accessibility statement for MedicalBillReader.com. Our commitment to WCAG 2.1 AA compliance.",
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
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Last Updated: March 2026
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Our Commitment</h2>
          <p>
            Medical Bill Reader is committed to ensuring digital accessibility for people with
            disabilities. We continually improve the user experience for everyone and apply
            relevant accessibility standards so that all users can access and understand their
            medical billing information.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Conformance Status</h2>
          <p>
            We target conformance with the{" "}
            <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These
            guidelines explain how to make web content more accessible to people with a wide
            range of disabilities, including visual, auditory, physical, speech, cognitive, and
            neurological disabilities.
          </p>
          <p>
            As a Tier 3 YMYL (Your Money or Your Life) site handling sensitive medical billing
            data, we also consider AAA criteria for cognitive accessibility where feasible, given
            that our users may include vulnerable populations navigating stressful financial
            situations.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Measures We Take</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Semantic HTML structure throughout the site</li>
            <li>Skip-to-main-content link on every page</li>
            <li>Keyboard navigation support for all interactive elements</li>
            <li>ARIA labels and roles where semantic HTML is insufficient</li>
            <li>Color contrast ratios meeting or exceeding 4.5:1 for normal text and 3:1 for large text</li>
            <li>Responsive design that reflows at 320px width without horizontal scrolling</li>
            <li>Text resizable to 200% without loss of content or functionality</li>
            <li>Visible focus indicators on all interactive elements</li>
            <li>Descriptive link text and meaningful page titles</li>
            <li>Form inputs with visible labels (not placeholder-only)</li>
            <li>Analysis results announced to screen readers via ARIA live regions</li>
            <li>Dark mode support to reduce eye strain</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Known Limitations</h2>
          <p>
            While we strive for full WCAG 2.1 AA compliance, we are aware of the following limitations:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Uploaded bill images:</strong> AI-generated analysis text is accessible, but the original uploaded bill image may not have alt text since it is user-provided content.</li>
            <li><strong>PDF rendering:</strong> Some uploaded PDF bills may not be fully accessible in their original format. Our AI analysis output is always provided as accessible HTML text.</li>
            <li><strong>Third-party content:</strong> Advertising delivered through Google AdSense and the Cookiebot consent banner are third-party components. We have limited control over their accessibility but select providers that commit to accessibility standards.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">European Accessibility Act</h2>
          <p>
            The European Accessibility Act (EAA) took effect on June 28, 2025, requiring digital
            services offered to EU consumers to meet accessibility requirements. Medical Bill Reader
            is committed to meeting these requirements, including publishing this accessibility
            statement and maintaining WCAG 2.1 AA conformance.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of Medical Bill Reader. If you encounter
            any accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Email: <a href="mailto:support@medicalbillreader.com" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">support@medicalbillreader.com</a></li>
            <li>Contact form: <Link href="/contact" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">Contact page</Link></li>
          </ul>
          <p>
            We try to respond to accessibility feedback within 5 business days.
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
            These technologies are relied upon for conformance with WCAG 2.1 AA.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Assessment Method</h2>
          <p>
            Medical Bill Reader assesses accessibility through a combination of automated testing
            tools (Lighthouse, axe-core), manual keyboard and screen reader testing, and ongoing
            review during development.
          </p>
        </div>
      </div>
    </main>
  );
}
