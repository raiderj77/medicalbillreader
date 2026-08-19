import Link from "next/link";
import { getAllEditorialGuides } from "@/lib/editorial-guides";

export default function HomepageGuideCluster() {
  const guides = getAllEditorialGuides();

  return (
    <section aria-labelledby="medical-billing-guides-heading" className="mb-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="medical-billing-guides-heading"
            className="text-2xl font-bold text-slate-800 dark:text-slate-100"
          >
            Medical billing guides
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700 dark:text-slate-300">
            Use these source-backed guides to understand common bill and EOB
            fields, prepare questions, and find official help resources. Rules
            and deadlines can vary, so verify them for your situation.
          </p>
        </div>
        <Link
          href="/blog"
          className="inline-flex min-h-11 shrink-0 items-center font-semibold text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
        >
          View all guides
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <h3 className="font-bold text-slate-900 dark:text-slate-100">
              <Link
                href={guide.href}
                className="text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"
              >
                {guide.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {guide.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
