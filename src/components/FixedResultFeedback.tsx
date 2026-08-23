"use client";

export const FIXED_FEEDBACK_OPTIONS = [
  "Helpful",
  "Partly helpful",
  "Not helpful",
  "The report appears incorrect or unsafe",
] as const;

export type FixedFeedbackOption = (typeof FIXED_FEEDBACK_OPTIONS)[number];

export default function FixedResultFeedback({
  enabled,
  onSelect,
}: {
  enabled: boolean;
  onSelect?: (option: FixedFeedbackOption) => void;
}) {
  if (!enabled) return null;
  return (
    <section aria-labelledby="result-feedback-heading" className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <h2 id="result-feedback-heading" className="font-bold">Was this report helpful?</h2>
      <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
        Do not send bill details or health information through feedback.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {FIXED_FEEDBACK_OPTIONS.map((option) => (
          <button key={option} type="button" onClick={() => onSelect?.(option)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
