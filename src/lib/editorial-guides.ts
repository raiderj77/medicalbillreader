import { getAllGuides } from "@/lib/guides";

export type EditorialGuideSource = "guide" | "markdown" | "standalone";

export type EditorialGuide = {
  slug: string;
  href: `/${string}`;
  title: string;
  description: string;
  publishedAt: string;
  lastReviewedAt: string;
  source: EditorialGuideSource;
  schemaType: "Article" | "BlogPosting";
};

export const DISPUTE_MEDICAL_BILL_GUIDE = {
  slug: "how-to-dispute-a-medical-bill",
  href: "/blog/how-to-dispute-a-medical-bill",
  title: "How to Dispute a Medical Bill: Steps and Letter Template",
  description:
    "A careful, source-backed guide to checking and disputing a medical bill, including a privacy-conscious letter template and official help resources.",
  publishedAt: "2026-03-28",
  lastReviewedAt: "2026-08-02",
  source: "standalone",
  schemaType: "Article",
} satisfies EditorialGuide;

export const SAMPLE_MEDICAL_BILL_REPORT_GUIDE = {
  slug: "sample-medical-bill-report",
  href: "/sample-medical-bill-report",
  title: "What Does a Sample Bill Report Show? (2026)",
  description:
    "Walk through a fully fabricated bill and EOB, see how the amounts relate, and review questions to verify without uploading a document.",
  publishedAt: "2026-08-18",
  lastReviewedAt: "2026-08-18",
  source: "standalone",
  schemaType: "Article",
} satisfies EditorialGuide;

const standaloneGuides: readonly EditorialGuide[] = [
  SAMPLE_MEDICAL_BILL_REPORT_GUIDE,
];

export function getAllEditorialGuides(): EditorialGuide[] {
  const tierOneGuides = getAllGuides().map(
    (guide): EditorialGuide => ({
      slug: guide.slug,
      href: `/guides/${guide.slug}`,
      title: guide.title,
      description: guide.description,
      publishedAt: guide.publishedAt,
      lastReviewedAt: guide.reviewedAt,
      source: "guide",
      schemaType: "Article",
    }),
  );

  const guides = [...tierOneGuides, ...standaloneGuides];
  const uniqueSlugs = new Set(guides.map((guide) => guide.slug));

  if (uniqueSlugs.size !== guides.length) {
    throw new Error("Editorial guide slugs must be unique");
  }

  return guides.sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
}

export function getRelatedEditorialGuides(
  currentSlug: string,
  limit = 4,
): EditorialGuide[] {
  return getAllEditorialGuides()
    .filter((guide) => guide.slug !== currentSlug)
    .slice(0, limit);
}
