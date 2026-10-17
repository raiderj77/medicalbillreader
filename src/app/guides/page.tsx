import type { Metadata } from "next";
import Link from "next/link";
import ArticleCTA from "@/components/ArticleCTA";
import { getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Which Medical Billing Guides Help in 2026?",
  description:
    "Read source-backed 2026 guides for EOBs, billing review, disputes, Good Faith Estimates, and hospital financial assistance.",
  alternates: { canonical: "https://medicalbillreader.com/guides" },
  openGraph: {
    title: "Which Medical Billing Guides Help in 2026?",
    description:
      "Source-backed guides for understanding medical bills, EOBs, disputes, estimates, and payment options.",
    url: "https://medicalbillreader.com/guides",
    type: "website",
  },
};

export default function GuidesPage() {
  const guides = getAllGuides();
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-4 pt-10 pb-24 sm:px-6 sm:pb-10">
      <h1 className="text-3xl font-bold text-slate-950 dark:text-white">
        Medical billing guides for 2026
      </h1>
      <p className="mt-3 max-w-2xl leading-7 text-slate-700 dark:text-slate-300">
        Use these source-backed guides to read an EOB, identify questions worth
        reviewing, follow the correct dispute path, and ask about estimates or
        financial assistance. They provide general information, not professional
        advice or a promise of a billing outcome.
      </p>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
        Last reviewed October 16, 2026. See the{" "}
        <Link className="underline underline-offset-2" href="/editorial-policy">
          editorial and corrections policy
        </Link>
        .
      </p>

      <ArticleCTA />

      <section aria-labelledby="guide-list-heading">
        <h2 id="guide-list-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Start with your question
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <article
              key={guide.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
            >
              <h3 className="font-bold text-slate-950 dark:text-white">
                <Link
                  className="text-teal-800 underline underline-offset-2 dark:text-teal-300"
                  href={`/guides/${guide.slug}`}
                >
                  {guide.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                {guide.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 p-5 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">
          Look up a billing term
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
          Visit the{" "}
          <Link className="underline underline-offset-2" href="/glossary">
            medical billing glossary
          </Link>{" "}
          for definitions of EOB, allowed amount, deductible, coinsurance,
          balance billing, Good Faith Estimate, and related terms.
        </p>
      </section>
    </main>
  );
}
