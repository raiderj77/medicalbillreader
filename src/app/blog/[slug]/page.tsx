import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getAllBlogSlugs } from "@/lib/blog";
import Disclaimer from "@/components/Disclaimer";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.join(", "),
    alternates: { canonical: `https://medicalbillreader.com/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://medicalbillreader.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      "@type": "Person",
      name: "Medical Bill Reader Team",
      url: "https://medicalbillreader.com/about",
      description: "Experienced web professionals specializing in healthcare billing transparency",
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: "https://medicalbillreader.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://medicalbillreader.com/blog/${slug}`,
    },
  };

  const faqJsonLd =
    post.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://medicalbillreader.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://medicalbillreader.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://medicalbillreader.com/blog/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-teal-600 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 truncate">{post.title}</span>
        </nav>

        <article>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {post.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            Last updated: {post.dateModified}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            By the Medical Bill Reader Team &mdash;{" "}
            <Link href="/about" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 underline">
              About the author
            </Link>
          </p>

          <Disclaimer />

          <div className="prose prose-gray dark:prose-invert max-w-none mt-8">
            {post.sections.map((section, i) => (
              <section key={i} className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  {section.heading}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          {/* FAQ */}
          {post.faq.length > 0 && (
            <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {post.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {f.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Related posts */}
        <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            More Guides
          </h2>
          <div className="grid gap-3">
            {blogPosts
              .filter((p) => p.slug !== slug)
              .slice(0, 4)
              .map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="text-teal-600 dark:text-teal-400 hover:underline text-sm"
                >
                  {p.title}
                </Link>
              ))}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Try Medical Bill Reader Free →
          </Link>
        </div>
      </main>
    </>
  );
}
