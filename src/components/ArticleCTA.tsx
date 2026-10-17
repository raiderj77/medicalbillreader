import Link from "next/link";

export default function ArticleCTA() {
  return (
    <aside
      aria-label="Try Medical Bill Reader"
      className="my-8 rounded-2xl border border-teal-200 bg-teal-50 p-5 shadow-sm dark:border-teal-800 dark:bg-teal-950/30 sm:p-6"
    >
      <div className="md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Confused by your bill?
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-800 dark:text-slate-200">
            Upload a supported medical bill or EOB. The AI organizes legible
            lines in plain language and suggests questions to verify with the
            provider or health plan. It cannot determine that a charge is wrong.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            $4.99 one time, or check whether the limited free analysis is
            available. No account is required.
          </p>
        </div>
        <Link
          href="/#analyzer"
          className="mt-4 hidden min-h-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 md:inline-flex"
        >
          Explain my bill
        </Link>
      </div>
      <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+0.75rem)] z-40 md:hidden print:hidden">
        <Link
          href="/#analyzer"
          className="flex min-h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white shadow-lg hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Explain my bill
        </Link>
      </div>
      <div aria-hidden="true" className="h-14 md:hidden" />
    </aside>
  );
}
