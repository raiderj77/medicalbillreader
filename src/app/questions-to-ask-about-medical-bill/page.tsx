import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://medicalbillreader.com/questions-to-ask-about-medical-bill";

export const metadata: Metadata = {
  title: "Questions to Ask About a Medical Bill",
  description:
    "A privacy-conscious checklist of questions for a provider billing office and health plan, based on current CMS and IRS resources.",
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Questions to Ask About a Medical Bill",
    description: "Prepare neutral questions for a provider billing office or health plan.",
    url: PAGE_URL,
    siteName: "Medical Bill Reader",
    type: "article",
  },
};

const providerQuestions = [
  "Can you provide a detailed or itemized bill showing each service, supply, adjustment, payment, and remaining balance?",
  "Which dates of service and which statement version does this balance cover?",
  "Have all plan payments, contractual adjustments, and patient payments been posted?",
  "Does this statement replace an earlier bill, or are other provider bills separate?",
  "Who can explain a visible service label or code using the underlying record and an authorized code source?",
] as const;

const planQuestions = [
  "Can you provide the EOB for the same claim and explain the billed, allowed, plan-paid, and patient-responsibility fields?",
  "Which plan term or claim-processing reason produced each deductible, copay, coinsurance, non-covered, or other amount?",
  "Does this EOB reflect a final claim, an adjustment, a replacement, or a claim that is still pending?",
  "Which provider or facility does the plan show, and does that match the provider bill?",
  "Where are the plan's current review or appeal instructions if I have a coverage question?",
] as const;

export default function QuestionsToAskAboutMedicalBillPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950">
        <article className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900">
          <nav aria-label="Breadcrumb" className="text-sm">
            <Link href="/" className="font-medium text-teal-800 underline dark:text-teal-300">Home</Link>{" "}
            <span aria-hidden="true">/</span> Questions to ask
          </nav>
          <header className="mt-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">Questions to ask about a medical bill</h1>
            <p className="mt-4 text-lg leading-8 text-slate-700 dark:text-slate-300">
              Use this checklist to prepare a conversation—not to decide that a charge is wrong. CMS recommends comparing the provider bill and EOB, checking the services and amounts shown, and asking the provider or health plan about differences.
            </p>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Source checked August 23, 2026. Written by the product team; professional billing review pending.</p>
          </header>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Before contacting anyone</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Confirm that the bill and EOB appear to cover the same provider, facility, service date, and claim.</li>
              <li>Keep the original documents available, but do not send them through ordinary email unless the recipient gives you an appropriate secure channel.</li>
              <li>Note the exact labels you want explained. A difference can reflect timing, claim adjustments, separate providers, or other facts not visible on one document.</li>
              <li>Use the <Link href="/bill-eob-comparison-worksheet" className="font-medium text-teal-800 underline dark:text-teal-300">local bill-and-EOB worksheet</Link> to compare dollar fields without uploading or saving entries.</li>
            </ul>
          </section>

          <section className="mt-10 rounded-2xl bg-slate-50 p-6 dark:bg-slate-950">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Questions for the provider billing office</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700 dark:text-slate-300">
              {providerQuestions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          </section>

          <section className="mt-8 rounded-2xl bg-slate-50 p-6 dark:bg-slate-950">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Questions for the health plan</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700 dark:text-slate-300">
              {planQuestions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Financial-assistance questions</h2>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
              If a hospital is tax-exempt, IRS rules require the hospital facility to establish a written financial-assistance policy. Eligibility, covered care, participating providers, and application steps depend on that facility&apos;s current policy.
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-300">
              <li>Does this facility have a current financial-assistance policy and plain-language summary?</li>
              <li>Which services and providers are included or excluded?</li>
              <li>What eligibility information and application steps does the policy require?</li>
              <li>Which office can answer questions about the policy without receiving unnecessary health information?</li>
            </ul>
          </section>

          <section className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-800">
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Official sources</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li><a href="https://www.cms.gov/medical-bill-rights/help/guides/how-to-read-bill" rel="noreferrer" className="font-medium text-teal-800 underline dark:text-teal-300">CMS: How to read your medical bill</a></li>
              <li><a href="https://www.cms.gov/medical-bill-rights" rel="noreferrer" className="font-medium text-teal-800 underline dark:text-teal-300">CMS: Medical bill rights</a></li>
              <li><a href="https://www.irs.gov/charities-non-profits/financial-assistance-policies-faps" rel="noreferrer" className="font-medium text-teal-800 underline dark:text-teal-300">IRS: Financial assistance policies</a></li>
            </ul>
          </section>

          <aside className="mt-10 rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            This checklist is general information, not medical, legal, insurance, coding, or financial advice. It does not determine coverage, correctness, deadlines, or what anyone owes.
          </aside>
        </article>
    </main>
  );
}
