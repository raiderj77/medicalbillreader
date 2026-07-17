interface AnswerBlockProps {
  what: string
  who: string
  bottomLine: string
  lastUpdated: string
}

export default function AnswerBlock({ what, who, bottomLine, lastUpdated }: AnswerBlockProps) {
  return (
    <section
      aria-label="Quick Answer"
      className="answer-block border-l-4 border-blue-600 bg-slate-50 dark:bg-slate-800/50 dark:border-blue-400 rounded-r-lg p-5 mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-1">What is this?</span>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 m-0">{what}</p>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-1">Who needs it?</span>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 m-0">{who}</p>
        </div>
        <div>
          <span className="block text-xs font-semibold uppercase tracking-widest text-slate-600 mb-1">Bottom line</span>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 m-0">{bottomLine}</p>
        </div>
      </div>
      <time dateTime={lastUpdated} className="block text-right text-xs text-slate-600">
        Last updated:{' '}
        {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
      </time>
    </section>
  )
}
