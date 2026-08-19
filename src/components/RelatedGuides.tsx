import Link from "next/link";
import { getRelatedEditorialGuides } from "@/lib/editorial-guides";

export default function RelatedGuides({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const guides = getRelatedEditorialGuides(currentSlug);

  if (guides.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-gray-100">
        More medical billing guides
      </h2>
      <div className="grid gap-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={guide.href}
            className="text-sm text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
          >
            {guide.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
