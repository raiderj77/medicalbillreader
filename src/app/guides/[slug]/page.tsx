import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCTA from "@/components/ArticleCTA";
import FAQSection from "@/components/FAQSection";
import RelatedGuides from "@/components/RelatedGuides";
import { getAllGuides, getGuide } from "@/lib/guides";

const SITE_URL = "https://medicalbillreader.com";

function jsonForHtml(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return {};
  const url = `${SITE_URL}/guides/${guide.slug}`;

  return {
    title: guide.title,
    description: guide.description,
    keywords: guide.keywords,
    authors: [{ name: "Jason Ramirez", url: `${SITE_URL}/about` }],
    robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.reviewedAt,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const reviewedDate = new Date(guide.reviewedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.reviewedAt,
    url,
    mainEntityOfPage: url,
    author: {
      "@type": "Person",
      name: "Jason Ramirez",
      jobTitle: "Web professional and product founder",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: SITE_URL,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  return (
    <main id="main-content" className="bg-slate-50 px-4 pt-8 pb-24 dark:bg-slate-950 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonForHtml(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonForHtml(breadcrumbSchema) }}
      />
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-300">
          <Link className="underline underline-offset-2" href="/">
            Home
          </Link>{" "}
          /{" "}
          <Link className="underline underline-offset-2" href="/guides">
            Guides
          </Link>
        </nav>
        <header className="mt-5">
          <p className="text-sm font-semibold text-teal-800 dark:text-teal-300">
            Source-backed medical billing guide
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Last reviewed{" "}
            <time dateTime={guide.reviewedAt}>{reviewedDate}</time>
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
            By{" "}
            <Link className="underline underline-offset-2" href="/about">
              Jason Ramirez
            </Link>
            , a web professional and product founder—not a clinician, attorney,
            insurer, certified coder, or medical-billing professional. See the{" "}
            <Link className="underline underline-offset-2" href="/editorial-policy">
              editorial policy
            </Link>
            .
          </p>
          <div
            role="note"
            className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
          >
            This guide is general educational information, not medical, legal,
            insurance, tax, or financial advice. Rules, deadlines, plan terms,
            and state protections vary. Verify current requirements with the
            official source and an appropriate qualified professional.
          </div>
        </header>

        <ArticleCTA />

        <div
          className="prose-medical"
          dangerouslySetInnerHTML={{ __html: guide.htmlContent }}
        />

        <FAQSection items={guide.faqs} />

        <section className="mt-10 rounded-xl border border-slate-200 p-5 text-sm leading-6 text-slate-700 dark:border-slate-700 dark:text-slate-300">
          <h2 className="font-bold text-slate-950 dark:text-white">
            Review and corrections
          </h2>
          <p className="mt-2">
            This page was reviewed against the linked primary sources on{" "}
            {reviewedDate}. Requirements and agency guidance can change. To
            report a factual issue, use the{" "}
            <Link className="underline underline-offset-2" href="/contact">
              contact page
            </Link>
            . We review supported corrections and update the page when warranted.
          </p>
          <p className="mt-2">
            Definitions are available in the{" "}
            <Link className="underline underline-offset-2" href="/glossary">
              medical billing glossary
            </Link>
            . CPT is a registered trademark of the American Medical Association.
            This page does not reproduce AMA code descriptors.
          </p>
        </section>

        <RelatedGuides currentSlug={guide.slug} />
      </article>
    </main>
  );
}
