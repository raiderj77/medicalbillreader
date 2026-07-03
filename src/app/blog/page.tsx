import type { Metadata } from "next";
import Link from "next/link";
import { getAllMarkdownPosts } from "@/lib/blog-markdown";

export const metadata: Metadata = {
  title: "Medical Billing Guides & Resources",
  description:
    "Practical guides to understanding medical bills, insurance claims, billing codes, and your patient rights. Written by experienced web professionals.",
  keywords: ["medical billing guides", "understand medical bill", "medical billing resources", "patient rights"],
  robots: { index: true, follow: true, googleBot: { "max-snippet": -1 } },
  alternates: { canonical: "https://medicalbillreader.com/blog" },
  openGraph: {
    title: "Medical Billing Guides & Resources",
    description:
      "Practical guides to understanding medical bills, insurance claims, billing codes, and your patient rights.",
    url: "https://medicalbillreader.com/blog",
  },
};

export default function BlogIndexPage() {
  const posts = getAllMarkdownPosts();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Medical Billing Guides & Resources ,  Medical Bill Reader",
    description:
      "Practical guides to understanding medical bills, insurance claims, billing codes, and your patient rights.",
    url: "https://medicalbillreader.com/blog",
    numberOfItems: posts.length,
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      name: post.title,
      url: `https://medicalbillreader.com/blog/${post.slug}`,
    })),
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Medical Billing Guides &amp; Resources
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
        Practical, plain-language guides to help you understand medical bills,
        insurance claims, billing codes, and your rights as a patient.
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500">No guides published yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-md transition-all group"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors mb-1">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                  {post.excerpt}
                </p>
              )}
              {post.date && (
                <time
                  dateTime={post.date}
                  className="text-xs text-gray-400 dark:text-gray-500"
                >
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
