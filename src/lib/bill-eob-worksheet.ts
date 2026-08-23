export const WORKSHEET_MONEY_FIELDS = [
  "providerCharge",
  "insuranceAdjustment",
  "insurancePaymentCredited",
  "patientPaymentCredited",
  "providerBalanceShown",
  "otherLabeledAdjustment",
  "eobAmountBilled",
  "allowedAmount",
  "planPayment",
  "deductible",
  "copay",
  "coinsurance",
  "nonCoveredAmount",
  "otherPatientResponsibility",
  "eobPatientResponsibilityShown",
] as const;

export type WorksheetMoneyField = (typeof WORKSHEET_MONEY_FIELDS)[number];

export type WorksheetValues = Record<WorksheetMoneyField, string> & {
  providerNote: string;
  eobNote: string;
};

export const EMPTY_WORKSHEET_VALUES: WorksheetValues = {
  providerCharge: "",
  insuranceAdjustment: "",
  insurancePaymentCredited: "",
  patientPaymentCredited: "",
  providerBalanceShown: "",
  otherLabeledAdjustment: "",
  eobAmountBilled: "",
  allowedAmount: "",
  planPayment: "",
  deductible: "",
  copay: "",
  coinsurance: "",
  nonCoveredAmount: "",
  otherPatientResponsibility: "",
  eobPatientResponsibilityShown: "",
  providerNote: "",
  eobNote: "",
};

export type ParsedMoney =
  | { status: "missing" }
  | { status: "invalid" }
  | { status: "valid"; cents: number };

const MAX_SAFE_CENTS = Number.MAX_SAFE_INTEGER;

/** Parses a display-only currency value without using floating-point arithmetic. */
export function parseMoney(value: string): ParsedMoney {
  const trimmed = value.trim();
  if (!trimmed) return { status: "missing" };

  const parenthesized = trimmed.startsWith("(") && trimmed.endsWith(")");
  const withoutParens = parenthesized ? trimmed.slice(1, -1).trim() : trimmed;
  const normalized = withoutParens.replaceAll(",", "").replace(/^\$/, "");
  const match = normalized.match(/^([+-]?)(\d+)(?:\.(\d*))?$/);
  if (!match || (parenthesized && match[1])) return { status: "invalid" };

  const sign = parenthesized || match[1] === "-" ? -1 : 1;
  const whole = BigInt(match[2]);
  const fraction = match[3] ?? "";
  const firstTwo = (fraction + "00").slice(0, 2);
  const roundDigit = Number((fraction + "000")[2]);
  let cents = whole * BigInt(100) + BigInt(firstTwo);
  if (roundDigit >= 5) cents += BigInt(1);
  if (cents > BigInt(MAX_SAFE_CENTS)) return { status: "invalid" };

  return { status: "valid", cents: sign * Number(cents) };
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export const WORKSHEET_FIELD_LABELS: Record<WorksheetMoneyField, string> = {
  providerCharge: "Provider charge",
  insuranceAdjustment: "Insurance adjustment",
  insurancePaymentCredited: "Insurance payment credited",
  patientPaymentCredited: "Patient payment credited",
  providerBalanceShown: "Provider balance shown",
  otherLabeledAdjustment: "Other labeled adjustment",
  eobAmountBilled: "Amount billed",
  allowedAmount: "Allowed amount",
  planPayment: "Plan payment",
  deductible: "Deductible",
  copay: "Copay",
  coinsurance: "Coinsurance",
  nonCoveredAmount: "Non-covered amount",
  otherPatientResponsibility: "Other patient responsibility",
  eobPatientResponsibilityShown: "EOB patient responsibility shown",
};

export interface WorksheetResult {
  parsed: Record<WorksheetMoneyField, ParsedMoney>;
  invalidFields: WorksheetMoneyField[];
  missingFields: WorksheetMoneyField[];
  chargeDifference: number | null;
  calculatedEobResponsibility: number | null;
  calculatedVsShownDifference: number | null;
  eobVsProviderBalanceDifference: number | null;
  differenceAfterPatientPayments: number | null;
  questions: string[];
}

function validCents(
  parsed: Record<WorksheetMoneyField, ParsedMoney>,
  field: WorksheetMoneyField,
): number | null {
  const value = parsed[field];
  return value.status === "valid" ? value.cents : null;
}

function difference(a: number | null, b: number | null): number | null {
  return a === null || b === null ? null : a - b;
}

export function calculateWorksheet(values: WorksheetValues): WorksheetResult {
  const parsed = Object.fromEntries(
    WORKSHEET_MONEY_FIELDS.map((field) => [field, parseMoney(values[field])]),
  ) as Record<WorksheetMoneyField, ParsedMoney>;
  const invalidFields = WORKSHEET_MONEY_FIELDS.filter(
    (field) => parsed[field].status === "invalid",
  );
  const missingFields = WORKSHEET_MONEY_FIELDS.filter(
    (field) => parsed[field].status === "missing",
  );

  const providerCharge = validCents(parsed, "providerCharge");
  const eobAmountBilled = validCents(parsed, "eobAmountBilled");
  const responsibilityParts = [
    "deductible",
    "copay",
    "coinsurance",
    "nonCoveredAmount",
    "otherPatientResponsibility",
  ] as const;
  const parsedParts = responsibilityParts.map((field) => validCents(parsed, field));
  const calculatedEobResponsibility = parsedParts.every(
    (amount): amount is number => amount !== null,
  )
    ? parsedParts.reduce((sum, amount) => sum + amount, 0)
    : null;
  const eobShown = validCents(parsed, "eobPatientResponsibilityShown");
  const providerBalance = validCents(parsed, "providerBalanceShown");
  const patientPayment = validCents(parsed, "patientPaymentCredited");

  const chargeDifference = difference(providerCharge, eobAmountBilled);
  const calculatedVsShownDifference = difference(
    calculatedEobResponsibility,
    eobShown,
  );
  const eobVsProviderBalanceDifference = difference(eobShown, providerBalance);
  const differenceAfterPatientPayments =
    providerBalance === null || eobShown === null || patientPayment === null
      ? null
      : providerBalance - (eobShown - patientPayment);

  const questions: string[] = [];
  if (chargeDifference !== null && chargeDifference !== 0) {
    questions.push(
      "Do these documents cover the same claim and service dates, and why do the billed-charge figures differ?",
    );
  }
  if (calculatedVsShownDifference !== null && calculatedVsShownDifference !== 0) {
    questions.push(
      "How did the plan combine the labeled responsibility fields into the patient-responsibility figure shown?",
    );
  }
  if (eobVsProviderBalanceDifference !== null && eobVsProviderBalanceDifference !== 0) {
    questions.push(
      "Has the provider posted the plan payment, adjustments, and every patient payment shown on these documents?",
    );
  }
  if (differenceAfterPatientPayments !== null && differenceAfterPatientPayments !== 0) {
    questions.push(
      "After the entered patient payment, how does the provider reconcile its remaining balance with the EOB responsibility?",
    );
  }
  if (missingFields.length > 0) {
    questions.push(
      "Which blank fields are absent from the documents, and can the provider or plan supply a complete itemized bill or EOB?",
    );
  }
  if (questions.length === 0) {
    questions.push(
      "Do the provider and plan confirm that these figures refer to the same claim and reflect all posted payments and adjustments?",
    );
  }

  return {
    parsed,
    invalidFields,
    missingFields,
    chargeDifference,
    calculatedEobResponsibility,
    calculatedVsShownDifference,
    eobVsProviderBalanceDifference,
    differenceAfterPatientPayments,
    questions,
  };
}

export function worksheetSummary(values: WorksheetValues): string {
  const result = calculateWorksheet(values);
  const display = (value: number | null) =>
    value === null ? "Not available from the entered fields" : formatCents(value);
  return [
    "Medical Bill Reader local bill and EOB worksheet",
    `Charge difference (provider minus EOB): ${display(result.chargeDifference)}`,
    `Calculated EOB responsibility: ${display(result.calculatedEobResponsibility)}`,
    `Calculated responsibility minus EOB figure shown: ${display(result.calculatedVsShownDifference)}`,
    `EOB responsibility minus provider balance: ${display(result.eobVsProviderBalanceDifference)}`,
    `Provider balance minus EOB responsibility after entered patient payment: ${display(result.differenceAfterPatientPayments)}`,
    `Missing fields: ${result.missingFields.length ? result.missingFields.map((field) => WORKSHEET_FIELD_LABELS[field]).join(", ") : "None"}`,
    "Questions to verify:",
    ...result.questions.map((question) => `- ${question}`),
    "A difference is a question to verify, not proof of an error or legal responsibility.",
  ].join("\n");
}
