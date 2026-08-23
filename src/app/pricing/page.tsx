import Link from "next/link";
import Script from "next/script";
import { getProductConfig } from "@/config/product";

type PricingPageProps = Readonly<{
  searchParams: Promise<{ payment?: string | string[] }>;
}>;

const pricingActions = [
  "(() => {",
  "  const status = document.getElementById('pricing-status');",
  "  const showStatus = (message) => {",
  "    if (!status) return;",
  "    status.textContent = message;",
  "    status.hidden = false;",
  "    status.focus();",
  "  };",
  "  const requestRedirect = async (button, endpoint, body) => {",
  "    if (button.getAttribute('aria-busy') === 'true') return;",
  "    button.setAttribute('aria-busy', 'true');",
  "    button.disabled = true;",
  "    try {",
  "      const response = await fetch(endpoint, {",
  "        method: 'POST',",
  "        headers: { 'Content-Type': 'application/json' },",
  "        body: body ? JSON.stringify(body) : undefined,",
  "      });",
  "      const data = await response.json().catch(() => ({}));",
  "      if (!response.ok || typeof data.url !== 'string') {",
  "        showStatus(data.error || 'This Stripe action could not be started.');",
  "        return;",
  "      }",
  "      const target = new URL(data.url);",
  "      const stripeHost = ['checkout.stripe.com', 'billing.stripe.com'].includes(target.hostname);",
  "      if (target.protocol !== 'https:' || !stripeHost) {",
  "        showStatus('This Stripe action returned an unexpected destination.');",
  "        return;",
  "      }",
  "      window.location.assign(target.href);",
  "    } catch {",
  "      showStatus('This Stripe action could not be started. Please try again.');",
  "    } finally {",
  "      button.setAttribute('aria-busy', 'false');",
  "      button.disabled = false;",
  "    }",
  "  };",
  "  document.querySelectorAll('[data-checkout-price-type]').forEach((button) => {",
  "    button.addEventListener('click', () => requestRedirect(",
  "      button, '/api/checkout',",
  "      { priceType: button.getAttribute('data-checkout-price-type') },",
  "    ));",
  "  });",
  "  document.querySelectorAll('[data-billing-portal]').forEach((button) => {",
  "    button.addEventListener('click', () => requestRedirect(",
  "      button, '/api/billing-portal', undefined,",
  "    ));",
  "  });",
  "})();",
].join("\n");

export default async function PricingPage({ searchParams }: PricingPageProps) {
  const config = getProductConfig();
  const payment = (await searchParams).payment;
  const paymentState = Array.isArray(payment) ? payment[0] : payment;
  const cancelled = paymentState === "cancelled";
  const verificationFailed = paymentState === "error";

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <nav className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Stethoscope">
              🩺
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              MedicalBillReader
            </span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
            Simple, transparent options
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300">
            Use the free allowance first, or purchase one additional AI-assisted
            document explanation. No new monthly subscriptions are offered.
          </p>
        </header>

        <div
          id="pricing-status"
          role="status"
          tabIndex={-1}
          hidden={!cancelled && !verificationFailed}
          className="mx-auto mb-8 max-w-3xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 focus:outline-none dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
        >
          {cancelled && "Checkout was canceled. No new access was enabled."}
          {verificationFailed && (
            <>
              We could not verify that checkout completed, so no analysis access
              was enabled. If you see a charge,{" "}
              <Link href="/contact" className="font-semibold underline underline-offset-2">
                contact support
              </Link>
              .
            </>
          )}
        </div>

        <section aria-label="Pricing options" className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Free</h2>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">$0</p>
            <p className="mt-4 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {config.freeAnalysis.limit} single-document analysis per{" "}
              {config.freeAnalysis.scope} per {config.freeAnalysis.period}, subject
              to network abuse controls. No card or account is required.
            </p>
            <Link
              href="/#analyzer"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-100 px-4 py-3 font-semibold text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
            >
              Use free analysis
            </Link>
          </article>

          <article className="flex flex-col rounded-2xl border-2 border-teal-700 bg-white p-7 shadow-sm dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Single document</h2>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
              {config.displayPrices.singleAnalysis}
            </p>
            <p className="mt-4 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
              One AI-assisted analysis of one supported redacted bill or EOB. No
              subscription. The server chooses the fixed Stripe price.
            </p>
            {config.features.singleAnalysis ? (
              <button
                type="button"
                data-checkout-price-type="per-use"
                aria-busy="false"
                className="mt-6 min-h-11 rounded-lg bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Buy one analysis
              </button>
            ) : (
              <p className="mt-6 rounded-lg bg-slate-100 p-3 text-center text-sm font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                Single-analysis checkout is currently unavailable.
              </p>
            )}
            <p className="mt-3 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Secure checkout on Stripe. After verified payment, you return to
              the analyzer and have 24 hours in this browser to start the one
              analysis. Keep the Stripe receipt if you change devices or clear
              site data.
            </p>
          </article>

          <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-bold uppercase tracking-wide text-teal-800 dark:text-teal-300">
              Coming later
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
              Bill and EOB comparison
            </h2>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-slate-100">
              {config.displayPrices.billEobComparison}
            </p>
            <p className="mt-4 flex-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
              Planned price for one comparison. There is no buy button while
              quality, payment, privacy, and owner-approval release gates remain
              incomplete.
            </p>
            {config.features.localComparisonWorksheet && (
              <Link
                href="/bill-eob-comparison-worksheet"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-100 px-4 py-3 text-center font-semibold text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
              >
                Use the free local worksheet
              </Link>
            )}
          </article>
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Existing monthly subscribers
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            New monthly subscriptions are not offered. A real existing subscriber
            can keep server-verified access and use Stripe to manage or cancel the
            existing subscription.
          </p>
          <button
            type="button"
            data-billing-portal
            aria-busy="false"
            className="mt-4 min-h-11 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Manage or cancel an existing subscription
          </button>
        </section>

        <section className="mx-auto mt-10 max-w-3xl space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Payment, access, and refunds
          </h2>
          <p>
            Stripe processes payment card details; Medical Bill Reader does not
            collect card details itself. Paid access is enabled only after the
            server verifies an eligible paid state.
          </p>
          <p>
            If a single-analysis result is unsatisfactory,{" "}
            <Link href="/contact" className="font-semibold underline underline-offset-2">
              contact support
            </Link>{" "}
            within 24 hours of delivery for the published full-refund guarantee.
            Statutory rights are not limited. Do not email a medical bill or
            health information.
          </p>
          <p>
            If checkout or subscription management does not work,{" "}
            <Link href="/contact" className="font-semibold underline underline-offset-2">
              contact support
            </Link>{" "}
            with the minimum transaction detail needed to locate the payment.
          </p>
          <p>
            Read the{" "}
            <Link href="/terms" className="font-semibold underline underline-offset-2">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-semibold underline underline-offset-2">
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>

      <Script id="pricing-actions" strategy="afterInteractive">
        {pricingActions}
      </Script>
    </main>
  );
}
