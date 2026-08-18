import type { MetadataRoute } from "next";
import { getAllEditorialGuides } from "@/lib/editorial-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://medicalbillreader.com";

  const editorialGuideEntries: MetadataRoute.Sitemap =
    getAllEditorialGuides().map((guide) => ({
      url: `${baseUrl}${guide.href}`,
      lastModified: guide.lastReviewedAt
        ? new Date(guide.lastReviewedAt)
        : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-08-18"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date("2026-08-18"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date("2026-08-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...editorialGuideEntries,
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
      lastModified: new Date("2026-08-17"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/consumer-health-data-privacy`,
      lastModified: new Date("2026-08-17"),
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
