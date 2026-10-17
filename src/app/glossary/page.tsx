import type { Metadata } from "next";
import Link from "next/link";
import ArticleCTA from "@/components/ArticleCTA";
import { GLOSSARY_REVIEWED_AT, GLOSSARY_TERMS } from "@/lib/glossary";

const PAGE_URL = "https://medicalbillreader.com/glossary";

export const metadata: Metadata = {
  title: "What Do Medical Billing Terms Mean? 2026 Glossary",
  description:
    "Plain-English definitions of 12 medical billing and health insurance terms, with official sources and questions to verify on a bill or EOB.",
  keywords: [
    "medical billing glossary",
    "health insurance terms",
    "EOB terms",
    "medical bill definitions",
  ],
  authors: [
    {
      name: "Jason Ramirez",
      url: "https://medicalbillreader.com/about",
    },
  ],
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-snippet": -1 },
  },
  openGraph: {
    type: "article",
    title: "What Do Medical Billing Terms Mean? 2026 Glossary",
    description:
      "Understand 12 common medical billing and health insurance terms using plain-English, source-backed definitions.",
    url: PAGE_URL,
    siteName: "Medical Bill Reader",
    modifiedTime: GLOSSARY_REVIEWED_AT,
  },
};

const glossarySchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Medical Billing and Health Insurance Glossary",
  description:
    "Plain-English definitions of common medical billing and health insurance terms.",
  url: PAGE_URL,
  dateModified: GLOSSARY_REVIEWED_AT,
  hasDefinedTerm: GLOSSARY_TERMS.map((entry) => ({
    "@type": "DefinedTerm",
    name: entry.term,
    description: entry.shortDefinition,
    url: `${PAGE_URL}/${entry.slug}`,
    inDefinedTermSet: PAGE_URL,
  })),
};

const breadcrumbSchema = {
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
      name: "Glossary",
      item: PAGE_URL,
    },
  ],
};

function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const linkClass =
  "font-medium text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300";

export default function GlossaryPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-5xl px-4 pt-10 pb-24 sm:px-6 sm:py-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(glossarySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbSchema) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-600 dark:text-slate-300">
        <Link className={linkClass} href="/">
          Home
        </Link>{" "}
        <span aria-hidden="true">/</span>{" "}
        <span aria-current="page">Glossary</span>
      </nav>

      <article>
        <header className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
            Medical billing reference
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            Medical billing and health insurance glossary
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-700 dark:text-slate-300">
            These plain-English definitions explain terms that commonly appear
            on U.S. medical bills, health-plan documents, and Explanations of
            Benefits. Your own plan document, notice, and applicable law control
            when a definition differs.
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Last reviewed <time dateTime={GLOSSARY_REVIEWED_AT}>October 16, 2026</time> by{" "}
            <Link className={linkClass} href="/about">
              Jason Ramirez
            </Link>
            , a web professional and product founder, not a clinician, attorney,
            insurer, certified medical coder, or billing specialist.
          </p>
        </header>

        <aside
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          role="note"
        >
          This glossary is educational and is not medical, legal, financial,
          insurance, or coding advice. Verify a term and any deadline with your
          provider, health plan, official notice, regulator, or a qualified
          professional for your situation.
        </aside>

        <section aria-labelledby="glossary-terms-heading" className="mt-10">
          <h2
            id="glossary-terms-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Browse all 12 terms
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GLOSSARY_TERMS.map((entry) => (
              <article
                key={entry.slug}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  <Link className={linkClass} href={`/glossary/${entry.slug}`}>
                    {entry.term}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  {entry.shortDefinition}
                </p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <ArticleCTA />
        </div>

        <section
          aria-labelledby="continue-reading-heading"
          className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
        >
          <h2
            id="continue-reading-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Continue with a practical guide
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700 dark:text-slate-300">
            <li>
              <Link className={linkClass} href="/guides/how-to-read-an-eob">
                How to read an EOB, line by line
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/guides/common-medical-bill-errors">
                Six common medical bill issues to check
              </Link>
            </li>
            <li>
              <Link className={linkClass} href="/guides/how-to-dispute-a-medical-bill">
                How to dispute a medical bill step by step
              </Link>
            </li>
          </ul>
        </section>

        <section
          aria-labelledby="glossary-sources-heading"
          className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
        >
          <h2
            id="glossary-sources-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Sources, updates, and corrections
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Definitions were independently written and checked against current
            primary guidance from CMS and HealthCare.gov on October 16, 2026.
            Rules and terminology can change, and a health plan may define a term
            more specifically. Each term page links the sources used for that
            definition.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <a
                className={linkClass}
                href="https://www.cms.gov/initiatives/your-patient-rights/medical-bill-rights/get-help/guides-resources/terms-you-should-know"
                rel="noopener noreferrer"
                target="_blank"
              >
                CMS: Health insurance terms you should know
              </a>
            </li>
            <li>
              <a
                className={linkClass}
                href="https://www.healthcare.gov/SBC-GLOSSARY/"
                rel="noopener noreferrer"
                target="_blank"
              >
                HealthCare.gov: Glossary of Health Coverage and Medical Terms
              </a>
            </li>
          </ul>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            See the{" "}
            <Link className={linkClass} href="/editorial-policy">
              editorial and corrections policy
            </Link>{" "}
            or{" "}
            <Link className={linkClass} href="/contact">
              report a possible correction
            </Link>
            . Do not send a medical bill or personal health information by
            email.
          </p>
        </section>
      </article>
    </main>
  );
}
