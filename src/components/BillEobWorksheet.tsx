"use client";

import { useMemo, useState } from "react";
import {
  calculateWorksheet,
  EMPTY_WORKSHEET_VALUES,
  formatCents,
  type WorksheetMoneyField,
  type WorksheetValues,
  worksheetSummary,
} from "@/lib/bill-eob-worksheet";

const providerFields: Array<[WorksheetMoneyField, string]> = [
  ["providerCharge", "Provider charge"],
  ["insuranceAdjustment", "Insurance adjustment"],
  ["insurancePaymentCredited", "Insurance payment credited"],
  ["patientPaymentCredited", "Patient payment credited"],
  ["providerBalanceShown", "Provider balance shown"],
  ["otherLabeledAdjustment", "Other labeled adjustment"],
];

const eobFields: Array<[WorksheetMoneyField, string]> = [
  ["eobAmountBilled", "Amount billed"],
  ["allowedAmount", "Allowed amount"],
  ["planPayment", "Plan payment"],
  ["deductible", "Deductible"],
  ["copay", "Copay"],
  ["coinsurance", "Coinsurance"],
  ["nonCoveredAmount", "Non-covered amount"],
  ["otherPatientResponsibility", "Other patient responsibility"],
  ["eobPatientResponsibilityShown", "EOB patient responsibility shown"],
];

function MoneyInput({
  field,
  label,
  value,
  invalid,
  onChange,
}: {
  field: WorksheetMoneyField;
  label: string;
  value: string;
  invalid: boolean;
  onChange: (field: WorksheetMoneyField, value: string) => void;
}) {
  const errorId = `${field}-error`;
  return (
    <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">
      {label}
      <span className="mt-1 flex rounded-lg border border-slate-300 bg-white focus-within:border-teal-700 focus-within:ring-2 focus-within:ring-teal-700/20 dark:border-slate-700 dark:bg-slate-950">
        <span aria-hidden="true" className="px-3 py-2 text-slate-500">$</span>
        <input
          name={field}
          value={value}
          onChange={(event) => onChange(field, event.target.value)}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          className="min-w-0 flex-1 rounded-r-lg bg-transparent px-2 py-2 text-slate-950 outline-none dark:text-white"
          placeholder="0.00"
        />
      </span>
      {invalid ? (
        <span id={errorId} className="mt-1 block text-xs text-red-700 dark:text-red-300">
          Enter a number such as 1250.00, -25.00, or (25.00).
        </span>
      ) : null}
    </label>
  );
}

export default function BillEobWorksheet() {
  const [values, setValues] = useState<WorksheetValues>({ ...EMPTY_WORKSHEET_VALUES });
  const [copyStatus, setCopyStatus] = useState("");
  const result = useMemo(() => calculateWorksheet(values), [values]);

  function setMoney(field: WorksheetMoneyField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setCopyStatus("");
  }

  function reset() {
    setValues({ ...EMPTY_WORKSHEET_VALUES });
    setCopyStatus("Worksheet reset. Nothing was saved.");
  }

  async function copyLocally() {
    try {
      await navigator.clipboard.writeText(worksheetSummary(values));
      setCopyStatus("Summary copied to this device's clipboard.");
    } catch {
      setCopyStatus("Your browser blocked clipboard access. Use Print instead.");
    }
  }

  const resultRows: Array<[string, number | null, string]> = [
    ["Charge difference", result.chargeDifference, "Provider charge minus EOB amount billed"],
    ["Calculated EOB responsibility", result.calculatedEobResponsibility, "Deductible + copay + coinsurance + non-covered + other responsibility"],
    ["Calculated vs. EOB shown", result.calculatedVsShownDifference, "Calculated responsibility minus the EOB responsibility shown"],
    ["EOB vs. provider balance", result.eobVsProviderBalanceDifference, "EOB responsibility shown minus provider balance"],
    ["Difference after patient payments", result.differenceAfterPatientPayments, "Provider balance minus EOB responsibility remaining after the entered patient payment"],
  ];

  return (
    <section aria-labelledby="worksheet-heading" className="mt-10">
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 text-sm text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
        <h2 id="worksheet-heading" className="text-xl font-bold">Private, local worksheet</h2>
        <p className="mt-2">
          Entries stay only in this page&apos;s temporary memory. This worksheet has no submit button,
          does not save entries, and does not put them in a URL, cookie, analytics event, or server request.
          Refreshing, leaving, or resetting clears them.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <legend className="px-2 text-lg font-bold text-slate-950 dark:text-white">Provider bill</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {providerFields.map(([field, label]) => (
              <MoneyInput key={field} field={field} label={label} value={values[field]} invalid={result.parsed[field].status === "invalid"} onChange={setMoney} />
            ))}
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-800 dark:text-slate-200">
            Optional neutral note (this visit only)
            <textarea
              value={values.providerNote}
              onChange={(event) => setValues((current) => ({ ...current, providerNote: event.target.value }))}
              rows={2}
              maxLength={240}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"
              placeholder="Example: second statement received — do not enter names, diagnoses, account IDs, or claim IDs"
            />
          </label>
        </fieldset>

        <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <legend className="px-2 text-lg font-bold text-slate-950 dark:text-white">Explanation of Benefits (EOB)</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {eobFields.map(([field, label]) => (
              <MoneyInput key={field} field={field} label={label} value={values[field]} invalid={result.parsed[field].status === "invalid"} onChange={setMoney} />
            ))}
          </div>
          <label className="mt-4 block text-sm font-medium text-slate-800 dark:text-slate-200">
            Optional neutral note (this visit only)
            <textarea
              value={values.eobNote}
              onChange={(event) => setValues((current) => ({ ...current, eobNote: event.target.value }))}
              rows={2}
              maxLength={240}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950"
              placeholder="Example: EOB processed later — do not enter names, diagnoses, account IDs, or claim IDs"
            />
          </label>
        </fieldset>
      </div>

      <section aria-labelledby="worksheet-results" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 id="worksheet-results" className="text-xl font-bold text-slate-950 dark:text-white">Comparison results</h2>
        {result.invalidFields.length ? (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            Correct the highlighted non-numeric values before relying on calculated rows.
          </p>
        ) : null}
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {resultRows.map(([label, amount, explanation]) => (
            <div key={label} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950">
              <dt className="font-semibold text-slate-900 dark:text-white">{label}</dt>
              <dd className="mt-1 text-xl font-bold text-teal-800 dark:text-teal-300">
                {amount === null ? "Needs more fields" : formatCents(amount)}
              </dd>
              <dd className="mt-1 text-xs text-slate-600 dark:text-slate-300">{explanation}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white">Fields missing from the comparison</h3>
            {result.missingFields.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
                {result.missingFields.map((field) => <li key={field}>{field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())}</li>)}
              </ul>
            ) : <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">No money fields are blank.</p>}
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white">Questions you may ask</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
              {result.questions.map((question) => <li key={question}>{question}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button type="button" onClick={reset} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold dark:border-slate-700">Reset</button>
        <button type="button" onClick={() => window.print()} className="rounded-lg bg-teal-800 px-4 py-2 font-semibold text-white">Print / save as PDF</button>
        <button type="button" onClick={copyLocally} className="rounded-lg border border-teal-700 px-4 py-2 font-semibold text-teal-800 dark:text-teal-300">Copy summary locally</button>
      </div>
      <p aria-live="polite" className="mt-2 text-sm text-slate-600 dark:text-slate-300">{copyStatus}</p>
    </section>
  );
}
