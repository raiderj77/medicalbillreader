import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | Medical Bill Reader",
  description:
    "Cookie policy for MedicalBillReader.com. Learn about the cookies we use, why we use them, and how to control them.",
  keywords: "cookie policy, cookies, medical bill reader, tracking, analytics cookies",
  alternates: {
    canonical: "https://medicalbillreader.com/cookies",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Cookie Policy | Medical Bill Reader",
    description: "Cookie policy for MedicalBillReader.com. Learn about the cookies we use, why we use them, and how to control them.",
    url: "https://medicalbillreader.com/cookies",
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
    { "@type": "ListItem", position: 2, name: "Cookie Policy", item: "https://medicalbillreader.com/cookies" },
  ],
};

export default function CookiesPage() {
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
          Cookie Policy
        </h1>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-8">
          Effective: August 2, 2026 | Last Updated: August 2, 2026
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
          <p>
            This Cookie Policy explains what cookies are, how Medical Bill Reader
            (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) uses them, and how you can control them.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device by your web browser when you visit a
            website. They help the site remember your preferences and understand how you interact with
            the site.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Cookies We Use</h2>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Essential Cookies</h3>
          <p>
            These cookies are strictly necessary for the website to function. They include:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Legacy privacy preference:</strong> If your browser still has an older analytics-choice cookie, the site changes an old opt-in value to essential-only. No optional tracking is enabled by that cookie.</li>
            <li><strong>Theme preference:</strong> Stores your light/dark mode preference in localStorage (not a cookie, but similar local storage).</li>
            <li><strong>Analysis entitlements:</strong> HttpOnly cookies hold signed or opaque access values that the server verifies before use. They do not contain bill content or payment-card data. A single-analysis cookie lasts up to 24 hours. A subscription cookie can last up to 400 days and is renewed after verified successful use; Stripe status is checked on each analysis. Clearing cookies or changing browsers can remove access, and shared devices share the same browser allowance. Privacy-minimized network counters are also used for abuse prevention.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Analytics Cookies</h3>
          <p>
            We do not currently load Google Analytics, advertising pixels, or
            other third-party analytics code on any page, and the site does not
            set third-party analytics or advertising cookies.
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Current status:</strong> Third-party analytics and advertising tracking are disabled for every visitor.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Optional Tracking</h2>
          <p>
            Because no optional analytics or advertising tracking is active, the
            site does not display a tracking-consent banner. An older saved
            analytics choice cannot re-enable Google Analytics.
          </p>
          <p>
            Global Privacy Control signals are consistent with the current
            default: no personal information is sold or shared for cross-context
            behavioral advertising, and no optional tracking loads.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">How to Control Cookies</h2>
          <p>You can manage cookies in several ways:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Browser settings:</strong> Most browsers let you block or delete cookies. Check your browser&apos;s help documentation for instructions.</li>
            <li><strong>Global Privacy Control:</strong> You may enable GPC in your browser. The service already keeps sale, sharing for behavioral advertising, and optional tracking off.</li>
          </ul>
          <p>
            Disabling essential cookies may prevent free or paid access, theme
            preferences, and other parts of the website from functioning correctly.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Health Data and Cookies</h2>
          <p>
            Medical bill content is not stored in cookies or localStorage. The
            selected preview and generated report remain in the active page&apos;s
            memory until you remove them, refresh, navigate away, or close the
            page. Uploaded bills pass through server memory and are transmitted
            to Anthropic for analysis. Medical Bill Reader does not intentionally
            store them in its own database. Filenames, bill content, report text,
            upload and analysis activity, and payment state are not passed to
            advertising or analytics systems.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on this page
            with an updated effective date.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please visit our{" "}
            <Link href="/contact" className="text-teal-800 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Contact page
            </Link>{" "}
            or email us at support@medicalbillreader.com.
          </p>

          <p className="text-sm text-slate-700 dark:text-slate-300 mt-8">
            See also:{" "}
            <Link href="/privacy" className="text-teal-800 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
