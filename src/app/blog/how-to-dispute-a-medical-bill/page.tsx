import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Dispute a Medical Bill: Steps and Letter Template",
  description:
    "A careful, source-backed guide to checking and disputing a medical bill, including a privacy-conscious letter template and official help resources.",
  alternates: {
    canonical: "https://medicalbillreader.com/blog/how-to-dispute-a-medical-bill",
  },
};

const sources = [
  {
    label: "CMS: How to read an Explanation of Benefits",
    href: "https://www.cms.gov/medical-bill-rights/help/guides/explanation-of-benefits",
  },
  {
    label: "CMS: Medical bill rights and No Surprises Act protections",
    href: "https://www.cms.gov/medical-bill-rights",
  },
  {
    label: "CMS: Submit a No Surprises complaint",
    href: "https://www.cms.gov/medical-bill-rights/help/submit-a-complaint",
  },
  {
    label: "HealthCare.gov: Internal health-plan appeals",
    href: "https://www.healthcare.gov/appeal-insurance-company-decision/internal-appeals/",
  },
  {
    label: "HealthCare.gov: External review",
    href: "https://www.healthcare.gov/appeal-insurance-company-decision/external-review/",
  },
  {
    label: "HHS: Accessing medical and billing records under HIPAA",
    href: "https://www.hhs.gov/hipaa/for-individuals/medical-records/index.html",
  },
  {
    label: "CFPB: Disputing a debt with a debt collector",
    href: "https://www.consumerfinance.gov/ask-cfpb/can-a-debt-collector-still-collect-a-debt-after-ive-disputed-it-en-338/",
  },
  {
    label: "IRS: Financial assistance policies for tax-exempt hospitals",
    href: "https://www.irs.gov/charities-non-profits/financial-assistance-policies-faps",
  },
];

const faqItems = [
  {
    question: "Can I question a medical bill after I paid it?",
    answer:
      "You can ask the provider and health plan to review a suspected error after payment, but refund rights and deadlines depend on the provider, plan, contract, and applicable state law. Act promptly, keep proof of payment, and follow the appeal instructions on your EOB or denial notice.",
  },
  {
    question: "Does an EOB prove what I owe?",
    answer:
      "An Explanation of Benefits is not a bill. It explains the claim, the plan's allowed amount and payment, and the patient balance calculated by the plan. Compare it with the provider's bill and ask both organizations about a mismatch.",
  },
  {
    question: "How long does a medical-bill dispute take?",
    answer:
      "There is no universal deadline for a provider's voluntary billing review. Health-plan appeals have deadlines stated in the denial notice and plan documents. Under federal Marketplace guidance, many internal appeals must be filed within 180 days, with different decision timelines depending on whether care is urgent, pending, or already received.",
  },
  {
    question: "Should I send my full medical record with a dispute?",
    answer:
      "Send only the records needed to explain the disputed line item. Use the provider or insurer's secure portal when possible, avoid ordinary email for sensitive documents, and keep copies of what you submit.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Dispute a Medical Bill: Steps and Letter Template",
  description:
    "A source-backed guide to checking and disputing a medical bill, with a privacy-conscious letter template.",
  datePublished: "2026-03-28",
  dateModified: "2026-07-12",
  author: {
    "@type": "Organization",
    name: "Medical Bill Reader",
  },
  publisher: {
    "@type": "Organization",
    name: "Medical Bill Reader",
    url: "https://medicalbillreader.com",
  },
  mainEntityOfPage:
    "https://medicalbillreader.com/blog/how-to-dispute-a-medical-bill",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function DisputeMedicalBillPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main id="main-content" className="bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <header>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
              Medical bill guidance
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              How to Dispute a Medical Bill
            </h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Last reviewed July 12, 2026
            </p>
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
              This guide provides general educational information, not medical,
              legal, insurance, or financial advice. Rights and deadlines can
              depend on your health plan, provider, state, and the type of bill.
              Follow the instructions on your bill, EOB, and denial notice, and
              consult a qualified professional when needed.
            </div>
          </header>

          <div className="mt-8 space-y-8 leading-7">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Start with the two documents that should match
              </h2>
              <p className="mt-3">
                Ask the provider for a detailed statement showing the dates of
                service, descriptions, codes when available, charges, payments,
                and adjustments. HIPAA generally gives individuals a right to
                inspect and receive copies of medical and billing records held by
                covered providers and health plans, subject to limited exceptions
                and permitted copying costs. A provider cannot deny access to
                those records solely because the underlying bill is unpaid. See
                the{" "}
                <a
                  className="font-medium text-teal-700 underline dark:text-teal-300"
                  href="https://www.hhs.gov/hipaa/for-individuals/medical-records/index.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  HHS medical-record access guidance
                </a>
                .
              </p>
              <p className="mt-3">
                If insurance processed the claim, download the corresponding
                Explanation of Benefits. CMS emphasizes that an EOB is not a bill:
                it explains the provider charge, allowed charge, insurer payment,
                and the patient balance calculated by the plan. Compare that
                patient balance with the provider&apos;s bill. If the provider bill is
                higher, ask both the provider and plan to explain the difference.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Check facts before alleging a coding error
              </h2>
              <p className="mt-3">
                First look for facts you can verify: a duplicate line, the wrong
                patient or insurance information, an incorrect date, a payment
                that is missing, or a service you did not receive. Procedure-code
                questions can be legitimate, but coding rules are complex. Ask the
                billing office to explain the code and compare it with your records
                before describing it as upcoding or unbundling.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="border border-slate-200 p-3 dark:border-slate-700">
                        What you notice
                      </th>
                      <th className="border border-slate-200 p-3 dark:border-slate-700">
                        What to request
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        The same line appears twice
                      </td>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        An explanation of quantity, units, and whether the services
                        were distinct
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        The bill and EOB show different patient balances
                      </td>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        A corrected claim or an explanation from both the provider
                        and health plan
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        You do not recognize a service
                      </td>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        The service description and relevant portion of your record
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        Insurance information is wrong
                      </td>
                      <td className="border border-slate-200 p-3 dark:border-slate-700">
                        Correction and resubmission of the claim, if appropriate
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4">
                You can use{" "}
                <Link className="font-medium text-teal-700 underline dark:text-teal-300" href="/">
                  Medical Bill Reader
                </Link>{" "}
                to organize the document into plain-language questions. Its output
                is informational and should not be treated as proof that a charge
                is improper.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Contact the right organization
              </h2>
              <ul className="mt-3 list-disc space-y-3 pl-6">
                <li>
                  <strong>Provider billing issue:</strong> Contact the provider for
                  a duplicate, missing payment, wrong demographic information, or a
                  service-description question.
                </li>
                <li>
                  <strong>Coverage or claim denial:</strong> Contact the health plan
                  and use the appeal instructions on the EOB or denial notice.
                </li>
                <li>
                  <strong>Possible surprise bill:</strong> The federal No Surprises
                  Act protects many people with group or individual insurance from
                  certain out-of-network bills for emergency care, some services at
                  in-network facilities, and air ambulances. It does not cover every
                  bill or every plan. CMS offers a{" "}
                  <a
                    className="font-medium text-teal-700 underline dark:text-teal-300"
                    href="https://www.cms.gov/medical-bill-rights/help/submit-a-complaint"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    No Surprises complaint process
                  </a>{" "}
                  and Help Desk at 1-800-985-3059.
                </li>
                <li>
                  <strong>Uninsured or self-pay estimate dispute:</strong> CMS says
                  you may qualify for the federal patient-provider dispute process
                  when a provider charges at least $400 more than its good faith
                  estimate and the initial bill is dated within the last 120
                  calendar days. Review the complete{" "}
                  <a
                    className="font-medium text-teal-700 underline dark:text-teal-300"
                    href="https://www.cms.gov/medical-bill-rights/help/dispute-a-bill"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    CMS eligibility rules
                  </a>{" "}
                  before applying.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Medical bill review letter template
              </h2>
              <p className="mt-3">
                Use the provider&apos;s secure portal when available. Share only the
                information needed to locate the account and explain the disputed
                line. Do not put a full Social Security number, full date of birth,
                diagnosis history, or unrelated records in an ordinary email.
              </p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 font-mono text-sm leading-6 dark:border-slate-700 dark:bg-slate-950">
                <p>[Your name]</p>
                <p>[Preferred secure contact method]</p>
                <p>[Date]</p>
                <br />
                <p>Billing Department</p>
                <p>[Provider or facility]</p>
                <br />
                <p>
                  <strong>
                    Re: Request to review account ending [LAST FOUR DIGITS], date
                    of service [DATE]
                  </strong>
                </p>
                <br />
                <p>Dear Billing Department:</p>
                <br />
                <p>
                  I am asking you to review the following item on my detailed bill:
                  [DATE, DESCRIPTION OR CODE, AND AMOUNT].
                </p>
                <br />
                <p>
                  My concern is: [STATE THE VERIFIABLE ISSUE — for example, the
                  line appears twice, the payment is missing, the date is wrong, or
                  I do not recognize the described service].
                </p>
                <br />
                <p>
                  Please investigate and send me a written explanation. If a
                  correction is appropriate, please send a corrected statement and,
                  when applicable, submit the corrected claim to my health plan. I
                  also request that you note the account as disputed while you
                  review it.
                </p>
                <br />
                <p>
                  I have included only the following supporting documents: [LIST
                  COPIES, NOT ORIGINALS]. Please use my secure contact method above
                  if you need additional information.
                </p>
                <br />
                <p>Sincerely,</p>
                <p>[Your name]</p>
              </div>
              <p className="mt-3 text-sm">
                Asking for an account hold does not guarantee the provider must
                grant one. Confirm the provider&apos;s collection policy and continue
                monitoring statements while the review is pending.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                If the health plan denied the claim
              </h2>
              <p className="mt-3">
                A provider billing review and a health-plan appeal are different
                processes. Follow the denial notice. HealthCare.gov says that under
                the federal framework, an internal appeal generally must be filed
                within 180 days of the denial. Internal decisions generally must be
                completed within 30 days for services not yet received and 60 days
                for services already received, with faster procedures for urgent
                situations. Plan and state rules can differ or provide additional
                rights.
              </p>
              <p className="mt-3">
                If an eligible internal appeal remains denied, the notice should
                explain external review. Federal guidance generally gives four
                months to request external review and requires a standard external
                decision as soon as possible, no later than 45 days after receipt.
                Use the deadlines printed on your own notice rather than relying on
                a general article.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Financial assistance and collections
              </h2>
              <p className="mt-3">
                Ask the hospital whether it has a financial assistance policy and
                whether you qualify. Federal tax rules require tax-exempt hospital
                organizations subject to Internal Revenue Code section 501(r) to
                maintain and publicize a written policy for emergency and other
                medically necessary care. That requirement is not the same as a
                promise that every hospital or every patient qualifies for free
                care.
              </p>
              <p className="mt-3">
                If a third-party debt collector contacts you, separate federal debt
                collection rules may apply. The CFPB explains that a written dispute
                sent within the validation period—generally 30 days after you
                receive the validation notice—requires the collector to pause
                collection of the disputed amount until it sends verification.
                This rule concerns debt collectors and should not be described as a
                universal 30-day deadline for the original provider.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Frequently asked questions
              </h2>
              <div className="mt-4 space-y-5">
                {faqItems.map((item) => (
                  <div key={item.question}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.question}
                    </h3>
                    <p className="mt-1">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Primary sources
              </h2>
              <p className="mt-3 text-sm">
                Last reviewed July 12, 2026. Official guidance can change; check the
                linked source before relying on a deadline or eligibility rule.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6">
                {sources.map((source) => (
                  <li key={source.href}>
                    <a
                      className="font-medium text-teal-700 underline dark:text-teal-300"
                      href={source.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </article>
      </main>
    </>
  );
}
