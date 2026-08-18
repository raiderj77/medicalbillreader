import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://medicalbillreader.com/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Medical Bill Reader handles uploads, reports, request metadata, payments, essential cookies, and privacy requests. Third-party analytics is disabled.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy — Medical Bill Reader",
    description:
      "How Medical Bill Reader handles uploads, reports, request metadata, payments, essential cookies, and privacy requests.",
    url: PAGE_URL,
    siteName: "Medical Bill Reader",
    type: "website",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://medicalbillreader.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Privacy Policy",
      item: PAGE_URL,
    },
  ],
};

export default function PrivacyPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <Link
            href="/"
            className="font-medium text-teal-800 underline dark:text-teal-300"
          >
            Home
          </Link>{" "}
          <span aria-hidden="true">/</span> Privacy Policy
        </nav>

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Effective August 2, 2026 · Last reviewed August 17, 2026
          </p>
          <p className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5 leading-7 text-slate-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-slate-100">
            Medical Bill Reader does not sell uploaded bill data or use it for
            advertising. A supported file is sent through the application to
            Anthropic to create the report you request. We do not intentionally
            write the document or report to our own database, but service
            providers process data under their configurations, contracts, and
            legal obligations.
          </p>
        </header>

        <div className="mt-10 space-y-9 leading-7">
          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              1. Who operates the service
            </h2>
            <p className="mt-3">
              MedicalBillReader.com is operated by Jason Ramirez. For privacy
              questions or requests, email{" "}
              <a
                href="mailto:privacy@medicalbillreader.com"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                privacy@medicalbillreader.com
              </a>
              . Do not send medical bills, diagnoses, member IDs, account
              numbers, or other sensitive documents through ordinary email.
            </p>
            <p className="mt-3">
              The service is intended and offered only to people located in the
              United States and U.S. territories. It is not offered or marketed
              to people in the European Economic Area, United Kingdom, or
              Switzerland. If you are located outside the United States or its
              territories, do not use the analyzer or submit personal data. This
              geographic scope does not waive rights under a law that otherwise
              applies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              2. Information processed
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                <strong>Uploads:</strong> the image or PDF you choose, which may
                contain names, dates, providers, diagnoses, procedure codes,
                insurance details, account identifiers, and charges.
              </li>
              <li>
                <strong>Generated report:</strong> the AI response derived from
                the submitted document.
              </li>
              <li>
                <strong>Request and security data:</strong> IP address and other
                request metadata processed by hosting infrastructure, plus
                HMAC-protected rate-limit and entitlement tokens stored in
                Upstash. The application does not put bill content or report text
                in those keys.
              </li>
              <li>
                <strong>Payments:</strong> payment, customer, subscription, and
                transaction information processed by Stripe. Full card numbers
                go directly to Stripe and are not handled by our application.
              </li>
              <li>
                <strong>Support and privacy requests:</strong> the email address
                and message content you choose to send.
              </li>
              <li>
                <strong>Third-party analytics:</strong> disabled site-wide. The
                current site does not load Google Analytics or send page views,
                device or referral information, upload activity, analysis
                activity, report content, payment state, or conversion events to
                Google.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              3. How information is used
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Generate and display the bill or EOB report you request.</li>
              <li>Enforce free, paid, and subscription usage limits.</li>
              <li>Process payments, refunds, and subscription management.</li>
              <li>Prevent abuse, investigate failures, and secure the service.</li>
              <li>Respond to support, correction, and privacy requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              4. Health data and the analyzer
            </h2>
            <p className="mt-3">
              The analyzer is a direct-to-consumer service, not a HIPAA covered
              entity or business associate service. It does not offer a business
              associate agreement for public use. Before uploading, remove names,
              addresses, dates of birth, member IDs, account numbers, barcodes,
              and other identifiers that are not needed for the explanation.
            </p>
            <p className="mt-3">
              See the prominently linked{" "}
              <Link
                href="/consumer-health-data-privacy"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Consumer Health Data Privacy Notice
              </Link>{" "}
              for data categories, processors, retention, and rights specific to
              consumer health data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              5. Service providers and disclosures
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                 <strong>Anthropic:</strong> receives the supported document and
                 returns the report through its commercial API. Anthropic states
                 that standard API inputs and outputs are automatically deleted
                 from its backend within 30 days, except when a service has longer
                 customer-controlled retention, different agreed terms apply, or
                 retention is needed for policy enforcement or law. Anthropic&apos;s
                 published policy says inputs and outputs flagged by its automated
                 trust and safety systems may be retained for up to two years and
                 associated classification scores for up to seven years. By
                 default, Anthropic says commercial API inputs and outputs are not
                 used to train its models unless the customer opts in or submits
                 feedback. Medical Bill Reader does not claim a zero-data-retention
                 agreement or Business Associate Agreement. See{" "}
                 <a
                   href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="font-semibold text-teal-800 underline dark:text-teal-300"
                 >
                   Anthropic&apos;s published retention policy
                 </a>
                 .
              </li>
              <li>
                <strong>Vercel:</strong> hosts and routes the application and may
                process request metadata and operational logs. Application logs
                use fixed event categories and are designed not to include bill
                content, base64 data, filenames, report text, Stripe IDs, or raw
                provider error objects.
              </li>
              <li>
                <strong>Upstash:</strong> stores pseudonymous security,
                rate-limit, and entitlement keys, not the document or report.
                The current code creates no new webhook-deduplication keys;
                legacy keys from the prior design may remain until their
                expiration.
              </li>
              <li>
                <strong>Stripe:</strong> processes hosted Checkout, payment,
                subscription, refund, and billing-portal data.
              </li>
              <li>
                <strong>Third-party analytics:</strong> disabled. Google Analytics
                is not a current service provider for site-usage measurement, and
                the application does not send analytics data to it.
              </li>
            </ul>
            <p className="mt-4">
              We may also disclose information when required by law, to protect
              the service or users, or as part of a business transaction subject
              to applicable safeguards and notice requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              6. Retention
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                <strong>Document and report in our application:</strong> held in
                memory for the request and active browser page; not intentionally
                written to our database.
              </li>
              <li>
                 <strong>Anthropic API:</strong> up to 30 days under the standard
                 policy, subject to the longer policy-enforcement, legal,
                 customer-controlled-service, and agreed-term exceptions described
                 above. Policy-flagged inputs and outputs may be retained for up to
                 two years and associated classification scores for up to seven
                 years. We do not claim that this public service has zero data
                 retention or a Business Associate Agreement.
              </li>
              <li>
                <strong>Rate-limit and entitlement keys:</strong> generally one
                minute to 40 days. A pseudonymous pay-per-use replay-prevention
                key may be retained for up to 370 days. Temporary reservations
                expire after about 10 minutes. No new webhook-deduplication keys
                are created; legacy keys may remain for up to 30 days after
                their last creation.
              </li>
              <li>
                <strong>Payment records:</strong> retained by Stripe and, where
                applicable, by us for payment, accounting, refund, dispute,
                fraud-prevention, and legal obligations.
              </li>
              <li>
                <strong>Analytics:</strong> third-party analytics is disabled, so
                the current site sends no new site-usage data to Google Analytics.
              </li>
              <li>
                <strong>Provider metadata and logs:</strong> follows the active
                provider configuration, plan, contract, and legal obligations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              7. Cookies and controls
            </h2>
            <p className="mt-3">
              Essential cookies carry signed free-use authorization, an
              authenticated browser binding, and encrypted paid or subscription
              entitlement tokens. The paid tokens are bound to the browser-binding
              cookie and do not expose raw Stripe identifiers. A theme choice may
              be stored in localStorage. Third-party analytics is disabled, so the
              current site does not load Google Analytics, set Google Analytics
              cookies, or display an analytics-consent banner. See the{" "}
              <Link
                href="/cookies"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/do-not-sell"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Do Not Sell or Share page
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              8. Advertising
            </h2>
            <p className="mt-3">
              Google AdSense code is not currently loaded by the site. If
              advertising is introduced later, this policy and any legally
              required consent tooling must be updated before activation. Ads may
              not appear on the
              analyzer, checkout, pricing, account-management, report, contact,
              or privacy pages, and document content or sensitive activity may
              not be used for ad targeting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              9. Privacy rights
            </h2>
            <p className="mt-3">
              Depending on where you live and whether a law applies, you may have
              rights to know, access, correct, delete, or receive a copy of
              personal data, withdraw consent, limit certain uses of sensitive
              data, or appeal a denied request. We do not sell personal data or
              use bill data for targeted advertising. Email the privacy address
              above with the subject “Privacy Request.” We may need to verify your
              identity. To appeal, reply with the subject “Privacy Request
              Appeal.” Response timing and exceptions follow applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              10. Security and incidents
            </h2>
            <p className="mt-3">
              Safeguards include HTTPS, restrictive response headers, upload type
              and size validation, rate limiting, signed free-use authorization,
              browser-bound authenticated paid and subscription entitlement
              tokens, Stripe webhook signature verification, and category-only
              security logs. No service can promise absolute security. We will
              investigate incidents and provide notices when required by
              applicable breach-notification law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              11. Children and changes
            </h2>
            <p className="mt-3">
              The service is not directed to children under 13. A parent or
              guardian should manage a minor&apos;s bill and remove unnecessary
              identifiers before upload. We will update the effective date when
              this policy changes materially and provide additional notice when
              required.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
