import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCTA from "@/components/ArticleCTA";
import {
  getGlossaryTerm,
  GLOSSARY_REVIEWED_AT,
  GLOSSARY_TERMS,
} from "@/lib/glossary";

const GLOSSARY_URL = "https://medicalbillreader.com/glossary";

export const dynamicParams = false;

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryTerm(slug);
  if (!entry) return {};

  const url = `${GLOSSARY_URL}/${entry.slug}`;
  const title = `${entry.term}: What Does It Mean? (2026)`;

  return {
    title,
    description: entry.shortDefinition,
    keywords: [entry.term, ...entry.aliases, "medical billing glossary"],
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
      title,
      description: entry.shortDefinition,
      url,
      siteName: "Medical Bill Reader",
      modifiedTime: GLOSSARY_REVIEWED_AT,
    },
  };
}

function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const linkClass =
  "font-medium text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300";

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getGlossaryTerm(slug);
  if (!entry) notFound();

  const pageUrl = `${GLOSSARY_URL}/${entry.slug}`;
  const definedTermSchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.term,
    alternateName: entry.aliases,
    description: entry.shortDefinition,
    url: pageUrl,
    inDefinedTermSet: GLOSSARY_URL,
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
        item: GLOSSARY_URL,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: entry.term,
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
        dangerouslySetInnerHTML={{ __html: jsonLd(definedTermSchema) }}
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
        <Link className={linkClass} href="/glossary">
          Glossary
        </Link>{" "}
        <span aria-hidden="true">/</span>{" "}
        <span aria-current="page">{entry.term}</span>
      </nav>

      <article>
        <header>
          <p className="text-sm font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
            Medical billing glossary
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
            What does {entry.term} mean?
          </h1>
          <p className="mt-5 text-xl font-medium leading-8 text-slate-800 dark:text-slate-200">
            {entry.shortDefinition}
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
          This definition is educational and is not medical, legal, financial,
          insurance, or coding advice. Verify how the term applies with your
          provider, health plan, official notice, regulator, or a qualified
          professional.
        </aside>

        <section aria-labelledby="definition-heading" className="mt-10">
          <h2
            id="definition-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Plain-English definition
          </h2>
          <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
            {entry.definition.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <div className="mt-10">
          <ArticleCTA />
        </div>

        <section
          aria-labelledby="related-guides-heading"
          className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700"
        >
          <h2
            id="related-guides-heading"
            className="text-2xl font-bold text-slate-950 dark:text-white"
          >
            Use the term in context
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Return to the{" "}
            <Link className={linkClass} href="/glossary">
              medical billing glossary
            </Link>{" "}
            or continue with one of these practical guides:
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
            Primary sources
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Reviewed October 16, 2026. Official guidance, plan terms, and legal
            protections can change; check the linked source and your current
            documents before relying on a definition.
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
