import type { Metadata } from "next";
import Link from "next/link";
import RelatedGuides from "@/components/RelatedGuides";
import { SAMPLE_MEDICAL_BILL_REPORT_GUIDE } from "@/lib/editorial-guides";

const PAGE_URL =
  "https://medicalbillreader.com/sample-medical-bill-report";
const SOCIAL_IMAGE_URL = `${PAGE_URL}/opengraph-image`;
const REVIEW_DATE = "August 18, 2026";

export const metadata: Metadata = {
  title: SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title,
  description:
    "Review a fabricated medical bill and EOB example with plain-English fields, verification questions, and no upload required.",
  keywords: [
    "sample medical bill report",
    "medical bill example",
    "EOB example",
    "how to read a medical bill",
    "medical bill patient responsibility",
  ],
  authors: [{ name: "Jason Ramirez" }],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title,
    description:
      "See a fully fabricated bill-and-EOB example, a representative report, and questions to verify. No upload required.",
    url: PAGE_URL,
    siteName: "Medical Bill Reader",
    type: "article",
    publishedTime: "2026-08-18",
    modifiedTime: "2026-08-18",
  },
  twitter: {
    card: "summary_large_image",
    title: SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title,
    description:
      "See a fully fabricated bill-and-EOB example, a representative report, and questions to verify. No upload required.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title,
  description:
    "A fully fabricated medical bill and EOB example with plain-English field explanations and questions to verify.",
  url: PAGE_URL,
  mainEntityOfPage: PAGE_URL,
  datePublished: "2026-08-18",
  dateModified: "2026-08-18",
  author: {
    "@type": "Person",
    name: "Jason Ramirez",
    jobTitle: "Web professional and product founder",
    url: "https://medicalbillreader.com/about",
  },
  publisher: {
    "@type": "Organization",
    name: "Medical Bill Reader",
    url: "https://medicalbillreader.com",
  },
  image: {
    "@type": "ImageObject",
    url: SOCIAL_IMAGE_URL,
    width: 1200,
    height: 630,
  },
};

const breadcrumbJsonLd = {
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
      name: "Sample Medical Bill Report",
      item: PAGE_URL,
    },
  ],
};

const headingClass =
  "text-2xl font-bold tracking-tight text-slate-950 dark:text-white";
const linkClass =
  "font-medium text-teal-800 underline decoration-teal-500 underline-offset-2 hover:text-teal-950 dark:text-teal-300 dark:hover:text-teal-100";

export default function SampleMedicalBillReportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main
        id="main-content"
        className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 sm:py-12 dark:bg-slate-950"
      >
        <article
          id="synthetic-sample"
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div
            className="border-b-4 border-amber-500 bg-amber-100 px-4 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-amber-950 sm:text-base print:border-4 print:border-black print:bg-white print:text-black"
            role="note"
          >
            Synthetic example — not a real patient, provider, claim, or bill
          </div>

          <div className="px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm">
              <Link href="/" className={linkClass}>
                Home
              </Link>{" "}
              <span aria-hidden="true">/</span>{" "}
              <span aria-current="page">Sample Medical Bill Report</span>
            </nav>

            <header className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                Fabricated educational walkthrough
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                {SAMPLE_MEDICAL_BILL_REPORT_GUIDE.title}
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
                See how common bill and Explanation of Benefits (EOB) fields can
                be organized into a plain-English report. No upload is needed:
                every label, identifier, service, and amount below was invented
                for this page.
              </p>
              <p className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-4 font-semibold leading-7 text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
                Nothing here came from a customer or patient. This static sample
                has no form fields, document viewer, or external embed.
              </p>
              <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Prepared and last reviewed {REVIEW_DATE} by{" "}
                <Link href="/about" className={linkClass}>
                  Jason Ramirez
                </Link>
                , a web professional and product founder. He is not a clinician,
                attorney, insurer, certified medical coder, or billing specialist.
                No review by one of those professionals is claimed. See the{" "}
                <Link href="/editorial-policy" className={linkClass}>
                  editorial policy
                </Link>
                .
              </p>
            </header>

            <div className="mt-12 space-y-12 text-slate-700 dark:text-slate-300">
              <section aria-labelledby="source-documents-heading">
                <h2 id="source-documents-heading" className={headingClass}>
                  The two synthetic source documents
                </h2>
                <p className="mt-3 max-w-3xl leading-7">
                  A provider bill requests payment. An EOB is the health plan&apos;s
                  explanation of how it processed a claim; it is not itself a
                  bill. Real layouts, labels, benefits, and calculations vary by
                  plan. CMS recommends comparing the bill and EOB, while
                  recognizing that they may arrive at different times and that an
                  EOB may not reflect an amount already paid to the provider.
                </p>

                <figure className="mt-6">
                  <div className="grid gap-5 lg:grid-cols-2">
                  <section className="min-w-0 rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      Fabricated provider bill
                    </h3>
                    <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Person
                        </dt>
                        <dd>Synthetic person — no name</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Provider
                        </dt>
                        <dd>Synthetic provider — no name or address</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Statement identifier
                        </dt>
                        <dd>SAMPLE-001 — non-billable demonstration ID</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Service date
                        </dt>
                        <dd>Sample date — not a real date</dd>
                      </div>
                    </dl>
                    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                      <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                        <caption className="bg-slate-100 px-4 py-3 text-left font-bold text-slate-950 dark:bg-slate-800 dark:text-white">
                          Invented bill amounts
                        </caption>
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="col" className="px-4 py-3 font-semibold">
                              Field
                            </th>
                            <th scope="col" className="px-4 py-3 text-right font-semibold">
                              Sample amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Original charge
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">$300</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Plan adjustment
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">−$120</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Plan payment
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">−$120</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Person payment credited
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">−$0</td>
                          </tr>
                          <tr className="font-bold text-slate-950 dark:text-white">
                            <th scope="row" className="px-4 py-3">
                              Balance shown
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">$60</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="min-w-0 rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      Fabricated EOB
                    </h3>
                    <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Covered person
                        </dt>
                        <dd>Synthetic person — no name</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Provider
                        </dt>
                        <dd>Synthetic provider — no name or address</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Claim identifier
                        </dt>
                        <dd>SAMPLE-001 — non-billable demonstration ID</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-slate-950 dark:text-white">
                          Service description
                        </dt>
                        <dd>Sample service — no clinical meaning</dd>
                      </div>
                    </dl>
                    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                      <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
                        <caption className="bg-slate-100 px-4 py-3 text-left font-bold text-slate-950 dark:bg-slate-800 dark:text-white">
                          Invented EOB amounts
                        </caption>
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="col" className="px-4 py-3 font-semibold">
                              Field
                            </th>
                            <th scope="col" className="px-4 py-3 text-right font-semibold">
                              Sample amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Provider charge
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">$300</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Adjustment or discount
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">−$120</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Allowed amount
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">$180</td>
                          </tr>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th scope="row" className="px-4 py-3 font-medium">
                              Plan paid
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">−$120</td>
                          </tr>
                          <tr className="font-bold text-slate-950 dark:text-white">
                            <th scope="row" className="px-4 py-3">
                              Illustrated responsibility
                            </th>
                            <td className="px-4 py-3 text-right tabular-nums">$60</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    </section>
                  </div>
                  <figcaption className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Side-by-side educational rendering of two fabricated
                    documents. The presentation does not reproduce a customer,
                    provider, or insurer layout.
                  </figcaption>
                </figure>

                <aside className="mt-6 rounded-xl border border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50">
                  <h3 className="font-bold text-slate-950 dark:text-white">
                    The sample arithmetic reconciles
                  </h3>
                  <p className="mt-2 leading-7">
                    $300 charge − $120 adjustment = $180 allowed amount. $180
                    allowed amount − $120 plan payment = $60 illustrated
                    responsibility. The same $60 appears as the fabricated bill
                    balance. These round numbers were selected only to demonstrate
                    the relationship; they are not typical prices, coverage terms,
                    or proof of an amount legally owed.
                  </p>
                </aside>
              </section>

              <section aria-labelledby="bill-eob-heading">
                <h2 id="bill-eob-heading" className={headingClass}>
                  Bill fields versus EOB fields
                </h2>
                <p className="mt-3 max-w-3xl leading-7">
                  The labels below are common examples described in CMS consumer
                  guidance. A particular provider or plan may use different words,
                  combine fields, or show additional claim details.
                </p>
                <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
                    <caption className="bg-slate-100 px-4 py-3 text-left font-bold text-slate-950 dark:bg-slate-800 dark:text-white">
                      Common fields to compare; real layouts vary
                    </caption>
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Topic
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Provider bill may show
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          EOB may show
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Question to verify
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 align-top dark:border-slate-700">
                        <th scope="row" className="px-4 py-3 font-medium">
                          Document role
                        </th>
                        <td className="px-4 py-3">A request for payment</td>
                        <td className="px-4 py-3">How the plan processed a claim; not a bill</td>
                        <td className="px-4 py-3">Which document am I reading?</td>
                      </tr>
                      <tr className="border-b border-slate-200 align-top dark:border-slate-700">
                        <th scope="row" className="px-4 py-3 font-medium">
                          Starting amount
                        </th>
                        <td className="px-4 py-3">Total or line-item charges</td>
                        <td className="px-4 py-3">Provider charges or amount billed</td>
                        <td className="px-4 py-3">Do the service lines and dates appear to match?</td>
                      </tr>
                      <tr className="border-b border-slate-200 align-top dark:border-slate-700">
                        <th scope="row" className="px-4 py-3 font-medium">
                          Plan calculation
                        </th>
                        <td className="px-4 py-3">Adjustments and insurance payments</td>
                        <td className="px-4 py-3">Allowed amount, discounts, and plan payment</td>
                        <td className="px-4 py-3">Are the adjustment and payment fields reflected on the bill?</td>
                      </tr>
                      <tr className="align-top">
                        <th scope="row" className="px-4 py-3 font-medium">
                          Person&apos;s amount
                        </th>
                        <td className="px-4 py-3">Balance due or patient responsibility</td>
                        <td className="px-4 py-3">What you may owe or patient responsibility</td>
                        <td className="px-4 py-3">Do the latest documents show the same amount, after credited payments?</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  On a narrow screen, scroll the table horizontally to compare all
                  four columns.
                </p>
              </section>

              <section aria-labelledby="report-heading">
                <h2 id="report-heading" className={headingClass}>
                  Representative report
                </h2>
                <p className="mt-3 max-w-3xl leading-7">
                  This is a static educational example of how visible fields might
                  be organized. It is not output from a real document, a certified
                  audit, or a determination that the bill or EOB is right or wrong.
                </p>

                <div className="mt-6 space-y-5">
                  <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      1. Document summary
                    </h3>
                    <p className="mt-2 leading-7">
                      The fabricated documents appear to be a provider statement
                      and an EOB for the same sample service because both display
                      SAMPLE-001 and the same synthetic provider label. In a real
                      review, that apparent match would still need to be checked
                      against the original documents.
                    </p>
                  </section>

                  <section className="rounded-xl border border-slate-200 p-5 dark:border-slate-700">
                    <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                      2. Visible amount summary
                    </h3>
                    <p className="mt-2 leading-7">
                      Both examples display a $300 starting charge, a $120
                      adjustment, a $120 plan payment, and a final $60 figure. The
                      sample&apos;s arithmetic is internally consistent, but matching
                      arithmetic alone would not establish coverage, coding,
                      medical necessity, or a legal payment obligation.
                    </p>
                  </section>

                  <section className="rounded-xl border border-amber-300 bg-amber-50 p-5 dark:border-amber-900 dark:bg-amber-950/30">
                    <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100">
                      3. Questions to verify
                    </h3>
                    <ul className="mt-3 list-disc space-y-3 pl-5 leading-7 text-amber-950 dark:text-amber-100">
                      <li>
                        Does the current provider statement refer to the same
                        service date and provider as the EOB?
                      </li>
                      <li>
                        Does the bill reflect the plan&apos;s adjustment and payment
                        shown on the latest EOB?
                      </li>
                      <li>
                        Has the provider credited any payment made after either
                        document was produced?
                      </li>
                      <li>
                        Do any EOB remarks, reason codes, or footnotes change how
                        the displayed amounts should be understood?
                      </li>
                      <li>
                        If the amounts differ, is the difference explained by
                        timing, a revised claim, or another visible document field?
                      </li>
                    </ul>
                    <p className="mt-4 font-semibold leading-7">
                      A mismatch is a question to verify with the provider or plan;
                      it is not by itself proof of an error, misconduct, or the
                      amount anyone legally owes.
                    </p>
                  </section>
                </div>
              </section>

              <section aria-labelledby="checklist-heading">
                <h2 id="checklist-heading" className={headingClass}>
                  Five-step review checklist
                </h2>
                <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {[
                    ["Identify", "Confirm whether each page is a bill or an EOB."],
                    ["Match", "Compare the provider, service date, and line descriptions."],
                    ["Calculate", "Trace charges, adjustments, plan payments, credits, and balance."],
                    ["Read", "Check remarks, reason codes, footnotes, and statement dates."],
                    ["Verify", "Ask the provider or plan about unexplained differences."],
                  ].map(([title, text], index) => (
                    <li
                      key={title}
                      className="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <span className="text-sm font-bold text-teal-800 dark:text-teal-300">
                        Step {index + 1}
                      </span>
                      <h3 className="mt-1 font-bold text-slate-950 dark:text-white">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-6">{text}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <section
                aria-labelledby="sources-heading"
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50"
              >
                <h2 id="sources-heading" className={headingClass}>
                  Primary sources
                </h2>
                <p className="mt-3 leading-7">
                  Field explanations were checked against current U.S. Centers for
                  Medicare &amp; Medicaid Services consumer guidance on{" "}
                  <a
                    href="https://www.cms.gov/medical-bill-rights/help/guides/how-to-read-bill"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    how to read a medical bill
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    how to read an Explanation of Benefits
                  </a>
                  . CMS also provides a{" "}
                  <a
                    href="https://www.cms.gov/medical-bill-rights/help/guides/bill-errors"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                  >
                    bill-review question guide
                  </a>
                  . Sources last checked {REVIEW_DATE}.
                </p>
              </section>

              <section
                aria-labelledby="next-step-heading"
                className="rounded-2xl bg-teal-900 px-5 py-8 text-white sm:px-8"
              >
                <p className="text-sm font-extrabold uppercase tracking-wide text-teal-100 print:text-black">
                  Synthetic example — not a real patient, provider, claim, or bill
                </p>
                <h2 id="next-step-heading" className="mt-2 text-2xl font-bold">
                  Ready to organize your own document?
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-teal-50 print:text-black">
                  The sample above needs no upload. If you choose the separate
                  analyzer, review the{" "}
                  <Link
                    href="/consumer-health-data-privacy"
                    className="font-semibold underline underline-offset-2"
                  >
                    consumer health data privacy notice
                  </Link>{" "}
                  first, remove identifiers that are not needed, and verify its
                  output against your original bill, EOB, provider, and plan.
                </p>
                <Link
                  href="/#analyzer"
                  className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-white px-5 py-3 font-bold text-teal-950 shadow-sm hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white print:border print:border-black"
                >
                  Start free analysis
                </Link>
              </section>

              <RelatedGuides
                currentSlug={SAMPLE_MEDICAL_BILL_REPORT_GUIDE.slug}
              />

              <aside className="border-t border-slate-200 pt-6 text-sm leading-6 text-slate-600 dark:border-slate-700 dark:text-slate-400">
                <p className="font-bold text-slate-900 dark:text-slate-200">
                  Informational example only
                </p>
                <p className="mt-2">
                  This fabricated walkthrough is not medical, financial,
                  insurance, coding, or legal advice. It cannot determine what
                  anyone owes, establish that a charge is correct or incorrect,
                  or replace review by a provider, insurer, or qualified
                  professional.
                </p>
              </aside>
            </div>
          </div>
        </article>
      </main>
    </>
  );
}
