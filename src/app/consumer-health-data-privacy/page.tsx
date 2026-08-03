import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL =
  "https://medicalbillreader.com/consumer-health-data-privacy";

export const metadata: Metadata = {
  title: "Consumer Health Data Privacy Notice",
  description:
    "How Medical Bill Reader collects, uses, shares, retains, and protects consumer health data submitted for bill analysis.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Consumer Health Data Privacy Notice",
    description:
      "Medical Bill Reader's consumer health data practices and privacy rights.",
    url: PAGE_URL,
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
      name: "Consumer Health Data Privacy Notice",
      item: PAGE_URL,
    },
  ],
};

export default function ConsumerHealthDataPrivacyPage() {
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
          <span aria-hidden="true">/</span>{" "}
          <span>Consumer Health Data Privacy</span>
        </nav>

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Consumer Health Data Privacy Notice
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Effective August 2, 2026 · Last reviewed August 2, 2026
          </p>
          <p className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5 leading-7 text-slate-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-slate-100">
            A medical bill or EOB can reveal health care, diagnoses, services,
            providers, insurance details, and financial information. Medical Bill
            Reader uses a document only to provide the analysis you request. We
            do not sell consumer health data, use it for advertising, or
            intentionally save the document or report in our own database.
          </p>
        </header>

        <div className="mt-10 space-y-9 leading-7">
          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Scope of this notice
            </h2>
            <p className="mt-3">
              This notice supplements our{" "}
              <Link
                href="/privacy"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Privacy Policy
              </Link>{" "}
              and describes consumer health data practices for the bill analyzer.
              Medical Bill Reader is a direct-to-consumer information service. It
              is not a health care provider, health plan, HIPAA covered entity, or
              HIPAA business associate, and it does not offer a business associate
              agreement for this public service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Data, sources, and purposes
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border border-slate-200 p-3 dark:border-slate-700">
                      Category and source
                    </th>
                    <th className="border border-slate-200 p-3 dark:border-slate-700">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      The bill or EOB you choose to upload, including visible
                      health, provider, insurance, identity, and charge details
                    </td>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      Generate the plain-language report you request
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      The AI-generated report derived from that document
                    </td>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      Display the requested report in your active browser session
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      Request metadata and pseudonymous security or entitlement
                      tokens generated by the service
                    </td>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      Prevent abuse, enforce usage limits, and confirm paid access
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      Payment and subscription information you provide directly
                      to Stripe
                    </td>
                    <td className="border border-slate-200 p-3 dark:border-slate-700">
                      Process payment and provide or manage purchased access
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Processors and sharing
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                 <strong>Anthropic:</strong> receives the complete supported file
                 through its commercial API and returns the report. Anthropic says
                 standard API inputs and outputs are automatically deleted from
                 its backend within 30 days, except when a service has longer
                 customer-controlled retention, different agreed terms apply, or
                 retention is needed for policy enforcement or law. Anthropic&apos;s
                 published policy says inputs and outputs flagged by its automated
                 trust and safety systems may be retained for up to two years and
                 associated classification scores for up to seven years. Medical
                 Bill Reader does not claim a zero-data-retention agreement or
                 Business Associate Agreement. See{" "}
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
                <strong>Vercel:</strong> hosts the application and routes requests.
                It may process IP addresses, request metadata, and operational
                logs under the active account configuration and its terms. Our
                application code is designed not to log bill content, base64 file
                data, filenames, or report text.
              </li>
              <li>
                <strong>Upstash:</strong> stores HMAC-protected rate-limit,
                entitlement, and webhook-deduplication keys. It does not receive
                the uploaded document or AI report from our application.
              </li>
              <li>
                <strong>Stripe:</strong> receives payment details directly through
                Stripe-hosted Checkout and stores payment, customer, subscription,
                and limited entitlement records under its terms. Medical Bill
                Reader does not receive or store full card numbers.
              </li>
            </ul>
            <p className="mt-4">
              Third-party analytics is disabled site-wide. Medical Bill Reader
              does not load Google Analytics or send public-page usage, document
              content, report text, filenames, upload activity, analysis activity,
              payment state, or conversion events to Google. Consumer health data
              is not disclosed to advertising systems.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Retention and deletion
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                <strong>Medical Bill Reader database:</strong> the document and
                report are not intentionally written to one. They pass through
                application memory for the request.
              </li>
              <li>
                <strong>Your browser:</strong> the preview and report remain in
                the active page state until you remove them, refresh, navigate
                away, or close the page. A single-analysis access cookie can
                remain for up to 24 hours; a verified subscription access cookie
                can remain for up to 400 days and is renewed after successful
                use. These cookies contain opaque entitlement identifiers, not
                bill content.
              </li>
              <li>
                 <strong>Anthropic:</strong> standard commercial API retention is
                 up to 30 days, with the longer exceptions described above.
                 Policy-flagged inputs and outputs may be retained for up to two
                 years and associated classification scores for up to seven years.
              </li>
              <li>
                <strong>Security and access keys:</strong> temporary reservations
                expire after about 10 minutes; most rate-limit and monthly usage
                keys expire between one minute and 40 days. A pseudonymous
                pay-per-use replay-prevention key may be retained for up to 370
                days. Stripe records follow Stripe&apos;s and our applicable payment,
                accounting, dispute, and legal retention requirements.
              </li>
            </ul>
            <p className="mt-4">
              A privacy request can cover data we control. Provider records may
              be subject to provider-side deletion procedures, contractual
              limits, fraud-prevention needs, or legal retention obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Your choices and rights
            </h2>
            <ul className="mt-3 list-disc space-y-3 pl-6">
              <li>
                Remove names, addresses, dates of birth, member IDs, account
                numbers, barcodes, and other identifiers that are not needed for
                the explanation before uploading.
              </li>
              <li>
                Do not select <em>Explain My Bill</em> if you do not want the
                document transmitted to Anthropic and infrastructure providers.
              </li>
              <li>
                Depending on applicable law, you may request access, confirmation,
                correction, deletion, or withdrawal of consent for future
                processing of consumer health data, and may appeal a denied
                request.
              </li>
            </ul>
            <p className="mt-4">
              Email{" "}
              <a
                href="mailto:privacy@medicalbillreader.com"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                privacy@medicalbillreader.com
              </a>{" "}
              with the subject “Consumer Health Data Request.” Describe the
              request and the email or payment reference needed to locate any
              record. Do not email a medical bill or diagnosis. We may need to
              verify your identity before acting. To appeal a decision, reply with
              the subject “Privacy Request Appeal.”
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Legal reference
            </h2>
            <p className="mt-3">
              Washington&apos;s My Health My Data Act requires a prominent consumer
              health data privacy notice and provides rights that may apply to
              Washington consumers. Read the official{" "}
              <a
                href="https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true"
                rel="noopener noreferrer"
                target="_blank"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Chapter 19.373 RCW
              </a>
              . This notice is informational and is not legal advice.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
