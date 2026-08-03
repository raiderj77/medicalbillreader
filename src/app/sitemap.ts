import type { MetadataRoute } from "next";
import { getAllMarkdownPosts } from "@/lib/blog-markdown";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://medicalbillreader.com";

  const markdownBlogEntries: MetadataRoute.Sitemap = getAllMarkdownPosts().map(
    (post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.modified ? new Date(post.modified) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/how-to-dispute-a-medical-bill`,
      lastModified: new Date("2026-07-12"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...markdownBlogEntries,
    {
      url: `${baseUrl}/methodology`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/codes-explained`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/consumer-health-data-privacy`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/accessibility`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/do-not-sell`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
