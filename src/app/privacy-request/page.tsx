import type { Metadata } from "next";
import Link from "next/link";
import PrivacyRequestForm from "@/components/PrivacyRequestForm";

const PAGE_URL = "https://medicalbillreader.com/privacy-request";

export const metadata: Metadata = {
  title: "Privacy Request",
  description:
    "How to make a privacy request without sending a medical bill, health information, or card or bank details.",
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
};

export default function PrivacyRequestPage() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-slate-950"
    >
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm">
          <Link
            href="/"
            className="font-medium text-teal-800 underline dark:text-teal-300"
          >
            Home
          </Link>{" "}
          <span aria-hidden="true">/</span> Privacy Request
        </nav>

        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
            Privacy Request
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Last reviewed August 23, 2026
          </p>
        </header>

        <div className="mt-8 space-y-8 leading-7">
          <section className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
            <h2 className="text-xl font-bold">Do not send sensitive details</h2>
            <p className="mt-2">
              Do not attach a medical bill, EOB, diagnosis, treatment
              information, insurance identifier, or other health information.
              Do not paste a report, medical code, charge, provider or insurer
              name, member or account number, claim number, card or bank detail,
              address, date of birth, or other sensitive information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Request categories
            </h2>
            <p className="mt-3">
              You may make a general request to access, correct, or delete
              personal information we control; withdraw permission for future
              document processing; or appeal a previous privacy decision. Rights
              and exceptions depend on applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Prepare a privacy-request email
            </h2>
            <p className="mt-3">
              This form exists only in your browser. It does not call a Medical
              Bill Reader server, save values in browser storage, add values to
              the page URL, or send data to analytics. After you select the
              button, your mail application opens a draft addressed to{" "}
              <strong>privacy@medicalbillreader.com</strong>. You must review and
              send that draft yourself.
            </p>
            <p className="mt-3">
              If identity verification is legally necessary, the operator must
              first provide a separate, proportionate method and explain what is
              needed. Do not include an identity document or sensitive locator in
              this initial request.
            </p>
            <div className="mt-5">
              <PrivacyRequestForm />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
              Before making a request
            </h2>
            <p className="mt-3">
              Medical Bill Reader does not intentionally store uploaded documents
              or generated reports in its own database. Service providers may
              process data under their own configurations, contracts, and legal
              obligations. Review the{" "}
              <Link
                href="/privacy"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/consumer-health-data-privacy"
                className="font-medium text-teal-800 underline dark:text-teal-300"
              >
                Consumer Health Data Privacy Notice
              </Link>{" "}
              for the current data and retention boundaries.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
