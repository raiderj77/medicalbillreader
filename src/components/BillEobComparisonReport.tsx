import BillAnalysisReport from "@/components/BillAnalysisReport";
import {
  BILL_EOB_COMPARISON_SCHEMA_VERSION,
  type BillEobComparisonReport as BillEobComparisonReportData,
} from "@/lib/bill-eob-comparison-schema";

function Page({ value }: { value: number | null }) {
  return value === null ? null : (
    <span className="ml-2 whitespace-nowrap text-xs font-medium text-slate-500 dark:text-slate-400">
      Page {value}
    </span>
  );
}

function TextList({ values }: { values: ReadonlyArray<string> }) {
  return (
    <ul className="ml-5 list-disc space-y-2 text-slate-700 dark:text-slate-300">
      {values.map((value, index) => (
        <li key={`${value}-${index}`}>{value}</li>
      ))}
    </ul>
  );
}

/**
 * Fixed JSX only: report strings are React text nodes. There is no Markdown
 * parser, raw-HTML path, model-controlled element, or model-controlled link.
 */
export default function BillEobComparisonReport({
  report,
}: {
  report: BillEobComparisonReportData;
}) {
  return (
    <div
      className="space-y-8"
      data-comparison-schema={BILL_EOB_COMPARISON_SCHEMA_VERSION}
    >
      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-white">
          Provider bill document
        </h2>
        <BillAnalysisReport report={report.billDocument} />
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-slate-950 dark:text-white">
          EOB document
        </h2>
        <BillAnalysisReport report={report.eobDocument} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
          Match assessment
        </h2>
        <p className="mt-3 font-semibold capitalize text-slate-800 dark:text-slate-200">
          Appears related: {report.matchAssessment.appearsRelated}
        </p>
        {report.matchAssessment.matchingEvidence.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Visible matching evidence
            </h3>
            <TextList values={report.matchAssessment.matchingEvidence} />
          </div>
        )}
        {report.matchAssessment.limitations.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Match limitations
            </h3>
            <TextList values={report.matchAssessment.limitations} />
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
          Visible comparison
        </h2>
        {report.visibleComparison.length > 0 ? (
          <dl className="mt-4 space-y-4">
            {report.visibleComparison.map((comparison, index) => (
              <div
                key={`${comparison.field}-${index}`}
                className="rounded-lg border border-slate-200 p-4 dark:border-slate-700"
              >
                <dt className="font-semibold text-slate-950 dark:text-white">
                  {comparison.field}
                </dt>
                <dd className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Provider bill
                    </span>
                    <p>{comparison.billValue ?? "Not visible"}</p>
                    {comparison.billEvidence && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        Visible evidence: {comparison.billEvidence.visibleText}
                        <Page value={comparison.billEvidence.page} />
                      </p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      EOB
                    </span>
                    <p>{comparison.eobValue ?? "Not visible"}</p>
                    {comparison.eobEvidence && (
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        Visible evidence: {comparison.eobEvidence.visibleText}
                        <Page value={comparison.eobEvidence.page} />
                      </p>
                    )}
                  </div>
                </dd>
                {comparison.difference && (
                  <dd className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                    Visible difference: {comparison.difference}
                  </dd>
                )}
                <dd className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/20 dark:text-amber-200">
                  Question to verify: {comparison.questionToVerify}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-3 text-slate-700 dark:text-slate-300">
            No document-supported field comparison was available.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
          Questions
        </h2>
        <TextList values={report.questions} />
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
          Limitations
        </h2>
        <TextList values={report.limitations} />
      </section>
    </div>
  );
}
