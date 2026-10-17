import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCTA from "@/components/ArticleCTA";
import { CPT_CODES, CPT_REVIEWED_AT, getCptCode } from "@/lib/cpt-codes";

const CODES_BASE_URL = "https://medicalbillreader.com/codes/cpt";

export const dynamicParams = false;

export function generateStaticParams() {
  return CPT_CODES.map((entry) => ({ code: entry.code }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const entry = getCptCode(code);
  if (!entry) return {};

  const url = `${CODES_BASE_URL}/${entry.code}`;
  const description =
    "A careful, independently paraphrased guide to CPT 99213, where it may appear, and how to compare a claim without assuming a universal fair price.";

  return {
    title: entry.title,
    description,
    keywords: [
      "CPT 99213",
      "what does CPT 99213 mean",
      "99213 allowed amount",
      "medical billing code 99213",
    ],
    authors: [
      {
        name: "Jason Ramirez",
        url: "https://medicalbillreader.com/about",
      },
    ],
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { "max-snippet": -1 },
    },
    openGraph: {
      type: "article",
      title: entry.title,
      description,
      url,
      siteName: "Medical Bill Reader",
      modifiedTime: CPT_REVIEWED_AT,
    },
  };
}

function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const linkClass =
  "font-medium text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300";

export default async function CptCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const entry = getCptCode(code);
  if (!entry) notFound();

  const pageUrl = `${CODES_BASE_URL}/${entry.code}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description:
      "An independently paraphrased educational overview of CPT 99213 and a method for comparing a related claim.",
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    datePublished: CPT_REVIEWED_AT,
    dateModified: CPT_REVIEWED_AT,
    author: {
      "@type": "Person",
      name: "Jason Ramirez",
      jobTitle: "Web professional and product founder",
      url: "https://medicalbillreader.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: "https://medicalbillreader.com",
    },
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
        name: "Codes Explained",
        item: "https://medicalbillreader.com/codes-explained",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `CPT ${entry.code}`,
        item: pageUrl,
      },
    ],
  };

  return (
    <main
      id="main-content"
      className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:px-6 sm:py-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(articleSchema) }}
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
        <Link className={linkClass} href="/codes-explained">
          Codes explained
        </Link>{" "}
        <span aria-hidden="true">/</span>{" "}
        <span aria-current="page">CPT {entry.code}</span>
      </nav>

      <article>
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
            Single-code educational guide
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            {entry.title}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Last reviewed <time dateTime={CPT_REVIEWED_AT}>October 16, 2026</time> by{" "}
            <Link className={linkClass} href="/about">
              Jason Ramirez
            </Link>
            , a web professional and product founder, not a clinician, attorney,
            insurer, certified medical coder, or billing specialist. No
            professional coding review is claimed.
          </p>
        </header>

        <aside
          className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          role="note"
        >
          This page is educational and is not medical, legal, financial,
          insurance, or coding advice. A code alone cannot establish what care
          occurred, whether coding was supported, whether a claim is covered,
          whether a price is fair, or what a patient legally owes. Verify the
          official current definition and your claim with the AMA, provider, and
          health plan.
        </aside>

        <div className="mt-10 space-y-10 leading-7 text-slate-700 dark:text-slate-300">
          <section aria-labelledby="meaning-heading">
            <h2
              id="meaning-heading"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              What does CPT {entry.code} mean in plain English?
            </h2>
            <p className="mt-3">{entry.plainEnglishMeaning}</p>
          </section>

          <section aria-labelledby="setting-heading">
            <h2
              id="setting-heading"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              Where might this code appear?
            </h2>
            <p className="mt-3">{entry.typicalSetting}</p>
          </section>

          <section aria-labelledby="price-heading">
            <h2
              id="price-heading"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              Is there a fair-price range for CPT {entry.code}?
            </h2>
            <p className="mt-3">
              There is no single responsible nationwide dollar range for this
              code. Amounts vary by payer contract, geography, clinician,
              setting, modifier, network status, and whether another facility
              charge is billed. A billed charge, negotiated amount, Medicare
              rate, and patient responsibility answer different questions. Use
              the claim-specific comparison steps below instead of treating one
              benchmark as proof of a fair or unfair price.
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              {entry.comparisonSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="questions-heading">
            <h2
              id="questions-heading"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              Questions to ask about a CPT {entry.code} line
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              {entry.questionsToAsk.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="copyright-heading">
            <h2
              id="copyright-heading"
              className="text-2xl font-bold text-slate-950 dark:text-white"
            >
              AMA copyright and licensing boundary
            </h2>
            <p className="mt-3">
              CPT is created, maintained, and copyrighted by the American
              Medical Association. The explanation on this page is an
              independent high-level paraphrase and does not reproduce the
              official descriptor or substitute for the current CPT code set and
              guidelines. The AMA states that organizations using, referencing,
              displaying, or creating derivative works from CPT content are
              expected to obtain an appropriate license. Licensing or qualified
              legal review for this single exemplar is a prepublication owner
              gate; the same review is required before any broader code library
              or reuse of official wording.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <ArticleCTA />
        </div>

        <section
          aria-labelledby="related-heading"
          className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
        >
          <h2
            id="related-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Related definitions and guides
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Review the{" "}
            <Link className={linkClass} href="/glossary">
              medical billing glossary
            </Link>{" "}
            for terms such as allowed amount, coinsurance, and itemized bill.
          </p>
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
          aria-labelledby="sources-heading"
          className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
        >
          <h2
            id="sources-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Primary sources, updates, and corrections
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Reviewed October 16, 2026. Coding guidance, fee schedules, payer
            policies, and licensing terms can change. Check the current official
            source rather than relying on this review date alone.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            {entry.sources.map((source) => (
              <li key={source.href}>
                <a
                  className={linkClass}
                  href={source.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
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
