import type { BillAnalysisReport as BillAnalysisReportData } from "@/lib/bill-analysis-schema";

const DOCUMENT_TYPE_LABELS: Record<
  BillAnalysisReportData["documentType"]["type"],
  string
> = {
  provider_bill: "Provider bill",
  itemized_bill: "Itemized bill",
  eob: "Explanation of Benefits (EOB)",
  other: "Other document",
  unclear: "Unclear document type",
};

function Page({ value }: { value: number | null }) {
  return value === null ? null : (
    <span className="ml-2 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
      Page {value}
    </span>
  );
}

function EvidenceQuality({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      {value} evidence
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 pt-5 first:border-t-0 first:pt-0 dark:border-slate-700">
      <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {children}
    </section>
  );
}

export default function BillAnalysisReport({
  report,
}: {
  report: BillAnalysisReportData;
}) {
  return (
    <div className="space-y-6" data-report-schema="2026-08-23.1">
      <Section title="What this document appears to be">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {DOCUMENT_TYPE_LABELS[report.documentType.type]}
          </p>
          <EvidenceQuality value={report.documentType.evidenceQuality} />
        </div>
        <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-300">
          {report.documentSummary}
        </p>
        {report.documentType.evidence.length > 0 && (
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {report.documentType.evidence.map((evidence, index) => (
              <li key={`${evidence.visibleText}-${index}`}>
                <span className="font-semibold">Visible evidence:</span>{" "}
                {evidence.visibleText}
                <Page value={evidence.page} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Visible fields">
        {report.visibleFields.length ? (
          <dl className="space-y-4">
            {report.visibleFields.map((field, index) => (
              <div
                key={`${field.field}-${index}`}
                className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50"
              >
                <dt className="flex flex-wrap items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  {field.field}
                  <EvidenceQuality value={field.evidenceQuality} />
                  <Page value={field.page} />
                </dt>
                <dd className="mt-1 text-slate-800 dark:text-slate-200">
                  {field.value}
                </dd>
                <dd className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {field.explanation}
                </dd>
                <dd className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Visible evidence: {field.visibleText}
                </dd>
                {field.limitation && (
                  <dd className="mt-2 text-xs text-amber-800 dark:text-amber-300">
                    Limitation: {field.limitation}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">
            No supported fields were clearly extracted.
          </p>
        )}
      </Section>

      <Section title="Amounts shown">
        {report.amounts.length ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            {report.amounts.map((amount, index) => (
              <div
                key={`${amount.label}-${index}`}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <dt className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {amount.label}
                  <Page value={amount.page} />
                </dt>
                <dd className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
                  {amount.amount}
                </dd>
                <dd className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Visible evidence: {amount.visibleText}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">
            No clearly labeled amount was extracted.
          </p>
        )}
      </Section>

      <Section title="Codes visible">
        {report.visibleCodes.length ? (
          <ul className="space-y-3">
            {report.visibleCodes.map((code, index) => (
              <li
                key={`${code.system}-${code.code}-${index}`}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {code.system} {code.code}
                  </span>
                  <EvidenceQuality value={code.evidenceQuality} />
                  <Page value={code.page} />
                </div>
                {code.visibleDescription && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    Visible description: {code.visibleDescription}
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Visible evidence: {code.visibleText}
                </p>
                {code.rightsLimited && (
                  <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
                    This code is transcribed from the document. Verify its meaning
                    with the provider, insurer, or an authorized code-set source.
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">
            No supported billing code was clearly extracted.
          </p>
        )}
      </Section>

      <Section title="Items to verify">
        {report.itemsToVerify.length ? (
          <ul className="space-y-3">
            {report.itemsToVerify.map((item, index) => (
              <li
                key={`${item.type}-${index}`}
                className="rounded-lg bg-amber-50 p-4 text-slate-800 dark:bg-amber-950/20 dark:text-slate-200"
              >
                <p className="font-semibold">
                  {item.question}
                  <Page value={item.page} />
                </p>
                <p className="mt-2 text-sm">{item.reason}</p>
                {item.visibleText && (
                  <p className="mt-2 text-xs">Visible evidence: {item.visibleText}</p>
                )}
                <p className="mt-2 text-xs">Limitation: {item.limitation}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-700 dark:text-slate-300">
            No specific item to verify was included in this report. That does
            not establish that the bill is correct; this is not a certified
            audit.
          </p>
        )}
      </Section>

      <Section title="Questions and next steps">
        <ul className="ml-5 list-disc space-y-2 text-slate-700 dark:text-slate-300">
          {(report.nextQuestions.length
            ? report.nextQuestions
            : ["Verify every important detail against the source document."]
          ).map((question, index) => (
            <li key={`${question}-${index}`}>{question}</li>
          ))}
        </ul>
      </Section>

      <Section title="Limitations">
        <ul className="ml-5 list-disc space-y-2 text-slate-700 dark:text-slate-300">
          {report.reportLimitations.map((limitation, index) => (
            <li key={`${limitation}-${index}`}>{limitation}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
