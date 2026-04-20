import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMarkdownPosts, getMarkdownPost } from "@/lib/blog-markdown";

export function generateStaticParams() {
  return getAllMarkdownPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getMarkdownPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description || undefined,
    keywords: post.keywords.length ? post.keywords : undefined,
    robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
    alternates: { canonical: `https://medicalbillreader.com/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || undefined,
      publishedTime: post.date,
      url: `https://medicalbillreader.com/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description || undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getMarkdownPost(slug);
  if (!post) notFound();

  const allPosts = getAllMarkdownPosts();

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.date,
    dateModified: post.date,
    url: `https://medicalbillreader.com/blog/${post.slug}`,
    mainEntityOfPage: `https://medicalbillreader.com/blog/${post.slug}`,
    author: {
      "@type": "Person",
      name: "Built by an experienced web professional",
      jobTitle: "Web Professional",
      url: "https://medicalbillreader.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Medical Bill Reader",
      url: "https://medicalbillreader.com",
    },
    keywords: post.keywords.join(", "),
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
        name: "Blog",
        item: "https://medicalbillreader.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://medicalbillreader.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-6"
      >
        <Link
          href="/"
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href="/blog"
          className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
        >
          Blog
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">
          {post.title}
        </span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-3">
        {post.title}
      </h1>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6 text-sm text-gray-500 dark:text-gray-400">
        {post.date && (
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
        )}
        <span aria-hidden="true">&middot;</span>
        <span>Built by an experienced web professional</span>
      </div>

      {/* Medical disclaimer */}
      <div
        role="note"
        className="mb-8 px-4 py-3 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 text-sm text-amber-800 dark:text-amber-300"
      >
        <strong>Disclaimer:</strong> This content is for informational purposes
        only and does not constitute medical or financial advice. Always consult
        a qualified professional for advice specific to your situation.
      </div>

      {/* Rendered markdown content */}
      <article
        className="prose-medical"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />

      {/* Related posts */}
      {allPosts.filter((p) => p.slug !== slug).length > 0 && (
        <section className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
            More Guides
          </h2>
          <div className="grid gap-3">
            {allPosts
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
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          Try Medical Bill Reader Free →
        </Link>
      </div>
    </main>
  );
}
