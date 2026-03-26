import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Medical Billing Guides & Resources",
  description:
    "Practical guides to understanding medical bills, insurance claims, billing codes, and your patient rights. Written by healthcare billing professionals.",
  alternates: { canonical: "https://medicalbillreader.com/blog" },
};

export default function BlogIndexPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Medical Billing Guides &amp; Resources
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
        Practical, plain-language guides to help you understand medical bills,
        insurance claims, billing codes, and your rights as a patient.
      </p>

      <div className="grid gap-6">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 transition-colors"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {post.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {post.description}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Updated {post.dateModified}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
