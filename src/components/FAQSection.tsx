export type FAQItem = {
  question: string;
  answer: string;
};

function jsonForHtml(value: unknown): string {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

export default function FAQSection({ items }: { items: readonly FAQItem[] }) {
  if (items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="guide-faq-heading" className="mt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonForHtml(schema) }}
      />
      <h2
        id="guide-faq-heading"
        className="text-2xl font-bold text-slate-950 dark:text-white"
      >
        Frequently asked questions
      </h2>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950"
          >
            <h3 className="font-bold text-slate-950 dark:text-white">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
