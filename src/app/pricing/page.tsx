"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { readJsonResponse } from "@/lib/read-json-response";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description:
      "Try one free bill analysis per browser per UTC calendar month.",
    features: [
      "1 bill or EOB per browser per UTC calendar month",
      "AI-generated report",
      "Patterns flagged for verification",
      "No credit card required",
    ],
    limitations: [],
    cta: "Start Free",
    href: "/#analyzer",
    highlighted: true,
    badge: "Available now",
    checkoutNote: null,
  },
  {
    name: "Pay Per Bill",
    price: "$4.99",
    period: "per bill",
    description:
      "The $4.99 single-analysis option is temporarily unavailable while payment setup is verified.",
    features: [
      "One analysis per purchase",
      "AI-generated report",
      "Patterns flagged for verification",
    ],
    limitations: [],
    cta: "Checkout temporarily unavailable",
    href: null,
    highlighted: false,
    badge: null,
    checkoutNote:
      "This page will not start a payment. Previously verified paid access remains subject to the existing eligibility and refund rules.",
  },
];

export default function PricingPage() {
  const [portalLoading, setPortalLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<ReactNode>(null);

  useEffect(() => {
    const paymentState = new URLSearchParams(window.location.search).get("payment");
    queueMicrotask(() => {
      if (paymentState === "error") {
        setStatusMessage(
          <>
            We could not verify that checkout completed, so no analysis access
            was enabled. If you see a charge,{" "}
            <Link
              href="/contact"
              className="font-semibold underline underline-offset-2"
            >
              contact support
            </Link>
            .
          </>,
        );
      } else if (paymentState === "cancelled") {
        setStatusMessage("Checkout was canceled. No new access was enabled.");
      }
    });
  }, []);

  const handleBillingPortal = async () => {
    if (portalLoading) return;
    setPortalLoading(true);
    setStatusMessage(null);
    try {
      const response = await fetch("/api/billing-portal", { method: "POST" });
      const data = await readJsonResponse<{ url?: string; error?: string }>(
        response,
      );
      if (response.ok && data.url) window.location.assign(data.url);
      else
        setStatusMessage(
          data.error || "Subscription management is unavailable.",
        );
    } catch {
      setStatusMessage("Subscription management is unavailable.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <main
      id="main-content"
      className="min-h-screen bg-slate-50 dark:bg-slate-900"
    >
      {/* Nav */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
              MedicalBillReader
            </span>
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto mb-2">
            The free analysis remains available for supported bills and EOBs.
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            New paid checkout is temporarily unavailable while payment setup is
            verified.
          </p>
        </div>

        <section
          aria-labelledby="checkout-availability-heading"
          className="mx-auto mb-8 max-w-3xl rounded-xl border border-amber-300 bg-amber-50 p-5 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
        >
          <h2
            id="checkout-availability-heading"
            className="font-semibold"
          >
            New paid checkout is temporarily unavailable
          </h2>
          <p className="mt-1 text-sm leading-relaxed">
            Medical Bill Reader is not starting new single-analysis or monthly
            checkout from this site while payment setup is verified. No payment
            will be started from this page. Free analysis remains available,
            and existing eligible paid access and subscription management keep
            their current verification rules.
          </p>
        </section>

        {statusMessage && (
          <div
            className="mx-auto mb-8 max-w-3xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100"
            role="status"
          >
            {statusMessage}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? "bg-slate-900 dark:bg-slate-950 text-white ring-2 ring-teal-500 shadow-xl scale-105"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {tier.badge && (
                <div className="text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
                  {tier.badge}
                </div>
              )}
              <h2
                className={`text-xl font-bold mb-1 ${tier.highlighted ? "text-white" : "text-slate-900 dark:text-slate-100"}`}
              >
                {tier.name}
              </h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span
                  className={`text-4xl font-bold ${tier.highlighted ? "text-white" : "text-slate-900 dark:text-slate-100"}`}
                >
                  {tier.price}
                </span>
                {tier.period && (
                  <span
                    className={`text-sm ${tier.highlighted ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}`}
                  >
                    {tier.period}
                  </span>
                )}
              </div>
              <p
                className={`text-sm mb-6 ${tier.highlighted ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}`}
              >
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${tier.highlighted ? "text-teal-400" : "text-teal-800"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span
                      className={
                        tier.highlighted
                          ? "text-slate-200"
                          : "text-slate-600 dark:text-slate-300"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {tier.href ? (
                <Link
                  href={tier.href}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-teal-700 text-white hover:bg-teal-800"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {tier.cta}
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="block w-full cursor-not-allowed rounded-lg bg-slate-700 py-3 text-center font-semibold text-slate-200"
                >
                  {tier.cta}
                </span>
              )}
              {tier.checkoutNote && (
                <p
                  className={`mt-3 text-xs leading-relaxed ${tier.highlighted ? "text-slate-300" : "text-slate-700 dark:text-slate-300"}`}
                >
                  {tier.checkoutNote}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleBillingPortal}
            disabled={portalLoading}
            aria-busy={portalLoading}
            className="min-h-11 px-3 text-sm font-semibold text-teal-800 underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60 dark:text-teal-300"
          >
            {portalLoading
              ? "Opening subscription management..."
              : "Manage or cancel an existing subscription"}
          </button>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-700 dark:text-slate-300">
            New paid checkout is temporarily unavailable. Existing subscribers
            can still use the Stripe-hosted portal above to manage or cancel.
          </p>
        </div>

        {/* Which Plan Is Right for You? */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
            Which Plan Is Right for You?
          </h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                I have one confusing bill right now
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Start with the <strong>Free</strong> plan. You get one full
                analysis per browser per UTC calendar month at no cost, subject
                to network abuse controls. No credit card is required. New paid
                checkout is temporarily unavailable if this browser&apos;s free
                analysis has already been used this month.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                I get medical bills occasionally
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                The published <strong>Pay Per Bill</strong> price remains $4.99,
                but Medical Bill Reader is not starting new paid checkout while
                payment setup is verified.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                I already have a monthly subscription
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                New paid checkout is temporarily unavailable. Existing
                subscribers can use the Stripe-hosted billing portal above to
                manage or cancel under their existing terms.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included in Each Access Type */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
            What&apos;s Included in Each Access Type
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Free and previously verified paid access use the same analysis
              route, supported file types, and report fields. Usage limits
              differ by access type.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-teal-800 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                AI-generated bill or EOB report
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-teal-800 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Structured visible-charge summary
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-teal-800 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Patterns flagged for verification
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-teal-800 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                General verification suggestions
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-teal-800 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                No intentional bill storage in our database
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-teal-800 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                HTTPS transmission to the application
              </li>
            </ul>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 text-left">
            {[
              {
                q: "Can I use it without paying?",
                a: "Yes. The free tier provides one analysis per browser per UTC calendar month without a credit card, subject to network abuse controls. New paid checkout is temporarily unavailable.",
              },
              {
                q: "How does pay-per-bill work?",
                a: "New pay-per-bill checkout is temporarily unavailable while payment setup is verified. A previously completed purchase can authorize one bill or EOB analysis only after the application verifies current Stripe payment and refund state.",
              },
              {
                q: "Are monthly subscriptions available?",
                a: "No new paid checkout is currently available. Existing subscribers can use the Stripe-hosted billing portal on this page to manage or cancel under their existing terms.",
              },
              {
                q: "Is there a refund policy?",
                a: (
                  <>
                    Yes. For a pay-per-bill analysis purchased before new
                    checkout was paused, contact us{" "}
                    <Link
                      href="/contact"
                      className="font-semibold text-teal-800 underline dark:text-teal-300"
                    >
                      through the support page
                    </Link>{" "}
                    within 24 hours of delivery for the published full refund.
                    Existing monthly subscriptions can be cancelled at any time
                    but are not refunded for partial months.
                  </>
                ),
              },
              {
                q: "Do you store my bill or EOB after analyzing it?",
                a: "Your document is transmitted securely to Anthropic solely to generate the analysis. It is not sold or shared for advertising, and Medical Bill Reader does not intentionally store bill documents in its own database. Anthropic, Vercel, and other infrastructure providers process data under their applicable terms and retention practices.",
              },
            ].map(({ q, a }) => (
              <details
                key={q}
                className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group"
              >
                <summary className="px-5 py-3 cursor-pointer font-medium text-slate-900 dark:text-slate-100 hover:text-teal-800 dark:hover:text-teal-400 transition-colors list-none flex justify-between items-center text-sm">
                  {q}
                  <svg
                    className="w-4 h-4 text-slate-600 group-open:rotate-180 transition-transform flex-shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-3 text-slate-700 dark:text-slate-300 text-sm">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Refund Policy for Prior Purchases */}
        <section className="mt-12 max-w-3xl mx-auto mb-4">
          <div className="bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Refund Policy for Prior Purchases
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              For a pay-per-bill result purchased before new checkout was
              paused, contact us{" "}
              <Link
                href="/contact"
                className="font-semibold text-teal-800 underline dark:text-teal-300"
              >
                through the support page
              </Link>{" "}
              within 24 hours of delivery for the published full refund. We may
              request the minimum Stripe transaction detail needed to locate
              the payment. Existing monthly subscribers can use the
              Stripe-hosted billing portal above to manage or cancel under their
              existing terms.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
