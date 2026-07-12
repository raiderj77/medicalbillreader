"use client";

import Link from "next/link";
import { useState } from "react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try it out with one free bill analysis per month.",
    features: [
      "1 bill or EOB per month",
      "Full plain-English report",
      "Potential billing error flags",
      "No credit card required",
    ],
    limitations: [],
    cta: "Start Free",
    href: "/",
    popular: false,
    priceType: null,
  },
  {
    name: "Pay Per Bill",
    price: "$4.99",
    period: "per bill",
    description: "Perfect for an occasional confusing bill. No subscription required.",
    features: [
      "Unlimited bills, pay per analysis",
      "Full plain-English report",
      "Potential billing error flags",
      "Priority processing",
    ],
    limitations: [],
    cta: "Buy Single Analysis",
    href: null,
    popular: true,
    priceType: "per-use",
  },
  {
    name: "Monthly Plan",
    price: "$49",
    period: "/month",
    description: "Best value if you or your family deal with medical bills regularly.",
    features: [
      "Up to 44 bills and EOBs per month",
      "Full plain-English report",
      "Potential billing error flags",
      "Priority processing",
      "Cancel anytime",
    ],
    limitations: [],
    cta: "Subscribe Now",
    href: null,
    popular: false,
    priceType: "subscription",
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceType: string) => {
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
        alert(data.error || "Failed to start checkout.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main id="main-content" className="min-h-screen bg-slate-50 dark:bg-slate-900">
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
            Medical Bill Reader explains any bill or EOB in plain English , choose a plan that fits how often you deal with medical bills.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Start with a free analysis. Upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col ${
                tier.popular
                  ? "bg-slate-900 dark:bg-slate-950 text-white ring-2 ring-teal-500 shadow-xl scale-105"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              }`}
            >
              {tier.popular && (
                <div className="text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
                  Most Popular
                </div>
              )}
              <h2 className={`text-xl font-bold mb-1 ${tier.popular ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                {tier.name}
              </h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className={`text-4xl font-bold ${tier.popular ? "text-white" : "text-slate-900 dark:text-slate-100"}`}>
                  {tier.price}
                </span>
                {tier.period && (
                  <span className={`text-sm ${tier.popular ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                    {tier.period}
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${tier.popular ? "text-slate-300" : "text-slate-500 dark:text-slate-400"}`}>
                {tier.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${tier.popular ? "text-teal-400" : "text-teal-600"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={tier.popular ? "text-slate-200" : "text-slate-600 dark:text-slate-300"}>{feature}</span>
                  </li>
                ))}
              </ul>

              {tier.href ? (
                <Link
                  href={tier.href}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${
                    tier.popular
                      ? "bg-teal-500 text-white hover:bg-teal-600"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {tier.cta}
                </Link>
              ) : (
                <button
                  onClick={() => tier.priceType && handleCheckout(tier.priceType)}
                  disabled={loading === tier.priceType}
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    tier.popular
                      ? "bg-teal-500 text-white hover:bg-teal-600"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {loading === tier.priceType ? "Loading..." : tier.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Which Plan Is Right for You? */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">Which Plan Is Right for You?</h2>
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">I have one confusing bill right now</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Start with the <strong>Free</strong> plan. You get one full analysis per month at no cost , no credit card required. If you have already used your free analysis this month, the <strong>Pay Per Bill</strong> option at $4.99 is the most economical choice for a single bill.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">I get medical bills occasionally</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">The <strong>Pay Per Bill</strong> plan is ideal. Pay $4.99 only when you need an analysis , no subscription, no commitment. Perfect for the occasional ER bill, EOB, or unexpected charge.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">I manage medical bills for myself or my family regularly</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">The <strong>Monthly Plan</strong> at $49 per month is the best value if you review more than 10 bills a month, for example if you are managing ongoing treatment or caring for family members. It includes up to 44 analyses per month (more than one a day). Cancel anytime with no penalty.</p>
            </div>
          </div>
        </section>

        {/* What's Included in Every Plan */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">What&apos;s Included in Every Plan</h2>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <p className="text-slate-600 dark:text-slate-300 mb-4">Every Medical Bill Reader plan , including the free tier , gives you access to the full analysis engine. There are no feature gates or stripped-down versions.</p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Full AI-powered bill and EOB analysis
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Plain-English charge breakdown
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Potential billing error flags
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Clear next-step guidance
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                No data stored after processing
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Secure, encrypted processing
              </li>
            </ul>
          </div>
        </section>

        {/* Pricing FAQ */}
        <section className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            {[
              {
                q: "Can I try before I buy?",
                a: "Yes. The free tier gives you one full bill analysis per month with no credit card required. The analysis is identical to paid plans , same AI, same report, same features.",
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
                a: "Up to 44 bills or EOBs per month, more than one per day. That covers the vast majority of people managing ongoing care or a family's medical bills. If you need more, contact us about a higher-volume plan.",
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
              <details key={q} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group">
                <summary className="px-5 py-3 cursor-pointer font-medium text-slate-900 dark:text-slate-100 hover:text-teal-600 dark:hover:text-teal-400 transition-colors list-none flex justify-between items-center text-sm">
                  {q}
                  <svg className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-3 text-slate-500 dark:text-slate-400 text-sm">{a}</div>
              </details>
            ))}
          </div>
        </section>

        {/* Money-Back Guarantee */}
        <section className="mt-12 max-w-3xl mx-auto mb-4">
          <div className="bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Money-Back Guarantee</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto">We stand behind the quality of every analysis. If you are not satisfied with a pay-per-bill result, contact us within 24 hours for a full refund , no questions asked. For monthly subscribers, you can cancel anytime and your access continues through the end of your billing period.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
