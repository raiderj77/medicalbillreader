"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { trackConversion } from "@/lib/analytics";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out with one free bill analysis per month.",
    features: [
      "1 bill or EOB per month",
      "AI-generated report",
      "Patterns flagged for verification",
      "No credit card required",
    ],
    limitations: [],
    cta: "Start Free",
    href: "/",
    highlighted: false,
    checkoutNote: null,
    priceType: null,
  },
  {
    name: "Pay Per Bill",
    price: "$4.99",
    period: "per bill",
    description:
      "Perfect for an occasional confusing bill. No subscription required.",
    features: [
      "One analysis per purchase",
      "AI-generated report",
      "Patterns flagged for verification",
    ],
    limitations: [],
    cta: "Buy Single Analysis",
    href: null,
    highlighted: true,
    checkoutNote:
      "Secure checkout on Stripe. After payment, you return to the bill analyzer to upload one bill or EOB.",
    priceType: "per-use",
  },
  {
    name: "Monthly Plan",
    price: "$49",
    period: "/month",
    description:
      "Best value if you or your family deal with medical bills regularly.",
    features: [
      "Up to 44 bills and EOBs per month",
      "AI-generated report",
      "Patterns flagged for verification",
      "Cancel anytime",
    ],
    limitations: [],
    cta: "Subscribe Now",
    href: null,
    highlighted: false,
    checkoutNote:
      "Secure checkout on Stripe. After payment, you return to the bill analyzer with monthly access enabled.",
    priceType: "subscription",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const paymentState = new URLSearchParams(window.location.search).get("payment");
    if (paymentState === "error") {
      trackConversion("payment_failed");
    } else if (paymentState === "cancelled") {
      trackConversion("checkout_cancelled");
    }
  }, []);

  const handleCheckout = async (priceType: string) => {
    const plan = priceType === "subscription" ? "subscription" : "per-use";
    trackConversion("checkout_started", { plan });
    setLoading(priceType);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        trackConversion("payment_failed", { plan });
        alert(data.error || "Failed to start checkout.");
      }
    } catch {
      trackConversion("payment_failed", { plan });
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const handleBillingPortal = async () => {
    const response = await fetch("/api/billing-portal", { method: "POST" });
    const data = (await response.json()) as { url?: string; error?: string };
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Subscription management is unavailable.");
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
            Each plan uses the same AI-assisted report for supported bills and EOBs;
            choose based on the number of analyses you expect to use.
          </p>
          <p className="text-slate-700 dark:text-slate-300 text-lg max-w-2xl mx-auto">
            Start with a free analysis. Upgrade when you need more. No hidden
            fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.highlighted
                  ? "bg-slate-900 dark:bg-slate-950 text-white ring-2 ring-teal-500 shadow-xl scale-105"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {tier.highlighted && (
                <div className="text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
                  One extra analysis
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
                <button
                  onClick={() =>
                    tier.priceType && handleCheckout(tier.priceType)
                  }
                  disabled={loading === tier.priceType}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    tier.highlighted
                      ? "bg-teal-700 text-white hover:bg-teal-800"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {loading === tier.priceType ? "Loading..." : tier.cta}
                </button>
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
            className="text-sm font-semibold text-teal-800 dark:text-teal-300 underline underline-offset-4"
          >
            Manage or cancel an existing subscription
          </button>
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
                analysis per month at no cost , no credit card required. If you
                have already used your free analysis this month, the{" "}
                <strong>Pay Per Bill</strong> option at $4.99 is the most
                economical choice for a single bill.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                I get medical bills occasionally
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                The <strong>Pay Per Bill</strong> plan is ideal. Pay $4.99 only
                when you need an analysis , no subscription, no commitment.
                Perfect for the occasional ER bill, EOB, or unexpected charge.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                I manage medical bills for myself or my family regularly
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                The <strong>Monthly Plan</strong> at $49 per month is the best
                value if you review more than 10 bills a month, for example if
                you are managing ongoing treatment or caring for family members.
                It includes up to 44 analyses per month (more than one a day).
                Cancel anytime with no penalty.
              </p>
            </div>
          </div>
        </section>

        {/* What's Included in Every Plan */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">
            What&apos;s Included in Every Plan
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Each plan uses the same analysis route, supported file types, and
              report fields. Usage limits differ by plan.
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
                q: "Can I try before I buy?",
                a: "Yes. The free tier provides one analysis per month without a credit card. It uses the same report fields and supported file types as paid access.",
              },
              {
                q: "How does pay-per-bill work?",
                a: "Each $4.99 payment gives you one bill or EOB analysis. You pay only when you need it, no subscription required. Payment is processed securely through Stripe.",
              },
              {
                q: "Can I cancel the monthly plan?",
                a: "Yes, you can cancel anytime. Your access continues until the end of the current billing period. There are no cancellation fees or long-term commitments.",
              },
              {
                q: "How many bills can I analyze on the Monthly Plan?",
                a: "The monthly entitlement is capped at 44 analyses per billing month. No higher-volume plan is currently published.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes. If you are unsatisfied with a pay-per-bill analysis, contact us within 24 hours for a full refund. Monthly subscriptions can be cancelled at any time but are not refunded for partial months.",
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

        {/* Money-Back Guarantee */}
        <section className="mt-12 max-w-3xl mx-auto mb-4">
          <div className="bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Money-Back Guarantee
            </h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              We stand behind the quality of every analysis. If you are not
              satisfied with a pay-per-bill result, contact us within 24 hours
              for a full refund , no questions asked. For monthly subscribers,
              you can cancel anytime and your access continues through the end
              of your billing period.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
