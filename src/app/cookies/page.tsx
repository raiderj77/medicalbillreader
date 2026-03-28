import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — Medical Bill Reader",
  description:
    "Cookie policy for MedicalBillReader.com. Learn about the cookies we use, why we use them, and how to control them.",
  keywords: "cookie policy, cookies, medical bill reader, tracking, analytics, advertising cookies",
  alternates: {
    canonical: "https://medicalbillreader.com/cookies",
  },
  robots: "index, follow, max-snippet:-1",
  openGraph: {
    title: "Cookie Policy — Medical Bill Reader",
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
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          Effective: January 1, 2026 | Last Updated: March 2026
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
            <li><strong>CookieConsent (Cookiebot):</strong> Stores your cookie consent preferences so we do not ask you repeatedly. Expires after 12 months.</li>
            <li><strong>Theme preference:</strong> Stores your light/dark mode preference in localStorage (not a cookie, but similar local storage).</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Analytics Cookies</h3>
          <p>
            We use analytics cookies only with your consent to understand how visitors use our site.
            These cookies collect information in an aggregated, anonymous form.
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Google Analytics:</strong> Collects anonymous usage data (pages visited, time on site, referral source). Set only after you grant consent via our cookie banner.</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Advertising Cookies</h3>
          <p>
            Google AdSense may set cookies to serve ads and measure ad performance. On pages where
            medical bill analysis occurs, we serve only non-personalized ads to protect your health data
            privacy. Advertising cookies are set only after you grant consent via our cookie banner.
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Google AdSense cookies:</strong> Used to serve relevant advertisements and limit how often you see an ad. These are blocked until you provide consent.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Cookie Consent</h2>
          <p>
            We use Cookiebot as our Consent Management Platform (CMP), certified by Google and
            compliant with IAB TCF v2.2. When you first visit our site, a cookie banner asks for
            your consent. Non-essential cookies (analytics, advertising) are blocked until you opt in.
          </p>
          <p>
            For visitors in the EU/EEA/UK, we follow an <strong>opt-in model</strong> — no tracking
            cookies fire until you give affirmative consent. For visitors in California and other US
            states with privacy laws, we follow an <strong>opt-out model</strong> and honor Global
            Privacy Control (GPC) signals automatically.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">How to Control Cookies</h2>
          <p>You can manage cookies in several ways:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li><strong>Cookie banner:</strong> Use the Cookiebot banner that appears on your first visit. You can change your preferences at any time by clicking the cookie icon in the bottom-left corner of any page.</li>
            <li><strong>Browser settings:</strong> Most browsers let you block or delete cookies. Check your browser&apos;s help documentation for instructions.</li>
            <li><strong>Global Privacy Control:</strong> Enable GPC in your browser to automatically signal your opt-out preference.</li>
            <li><strong>Opt out of Google ads personalization:</strong> Visit <a href="https://adssettings.google.com" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
          </ul>
          <p>
            Disabling essential cookies may prevent parts of the website from functioning correctly.
            Disabling analytics or advertising cookies will not affect your ability to use the medical
            bill analysis tool.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Health Data and Cookies</h2>
          <p>
            Medical bill content is never stored in cookies, localStorage, or any client-side storage.
            Your uploaded bills are processed in server memory and deleted immediately after analysis.
            No health data is ever passed to advertising or analytics systems.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on this page
            with an updated effective date.
          </p>

          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Contact Us</h2>
          <p>
            If you have questions about our use of cookies, please visit our{" "}
            <Link href="/contact" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Contact page
            </Link>{" "}
            or email us at support@medicalbillreader.com.
          </p>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-8">
            See also:{" "}
            <Link href="/privacy" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
