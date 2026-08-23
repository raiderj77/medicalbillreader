"use client";

import { FormEvent, useState } from "react";
import { flushSync } from "react-dom";

const PRIVACY_EMAIL = "privacy@medicalbillreader.com";

const requestTypes = [
  { value: "access", label: "Access or confirmation" },
  { value: "correction", label: "Correction" },
  { value: "deletion", label: "Deletion" },
  { value: "withdrawal", label: "Withdraw permission for future processing" },
  { value: "appeal", label: "Appeal a previous privacy decision" },
  { value: "payment-record", label: "Payment or refund record request" },
] as const;

export type PrivacyRequestType = (typeof requestTypes)[number]["value"];

export interface PrivacyRequestDraft {
  name: string;
  email: string;
  requestType: PrivacyRequestType;
  paymentReference: string;
  explanation: string;
}

function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function requestTypeLabel(requestType: PrivacyRequestType): string {
  return (
    requestTypes.find((option) => option.value === requestType)?.label ??
    "Privacy request"
  );
}

export function privacyRequestNeedsPaymentReference(
  requestType: PrivacyRequestType,
): boolean {
  return requestType === "payment-record";
}

export function createPrivacyRequestMailto(draft: PrivacyRequestDraft): string {
  const lines = [
    `Name: ${singleLine(draft.name)}`,
    `Email: ${singleLine(draft.email)}`,
    `Request type: ${requestTypeLabel(draft.requestType)}`,
  ];

  if (
    privacyRequestNeedsPaymentReference(draft.requestType) &&
    singleLine(draft.paymentReference)
  ) {
    lines.push(
      `Stripe payment reference: ${singleLine(draft.paymentReference)}`,
    );
  }

  lines.push(
    "",
    "General non-health explanation:",
    draft.explanation.trim(),
    "",
    "I did not attach or include a medical bill, EOB, diagnosis, treatment information, insurance identifier, or other health information.",
  );

  const subject = `Privacy Request: ${requestTypeLabel(draft.requestType)}`;
  return `mailto:${PRIVACY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}

export default function PrivacyRequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestType, setRequestType] =
    useState<PrivacyRequestType>("access");
  const [paymentReference, setPaymentReference] = useState("");
  const [explanation, setExplanation] = useState("");

  const needsPaymentReference =
    privacyRequestNeedsPaymentReference(requestType);

  function openEmailDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const mailto = createPrivacyRequestMailto({
      name,
      email,
      requestType,
      paymentReference: needsPaymentReference ? paymentReference : "",
      explanation,
    });

    // Clear application-held values before handing the draft to the user's
    // mail application. The site does not submit, log, or persist this form.
    flushSync(() => {
      setName("");
      setEmail("");
      setRequestType("access");
      setPaymentReference("");
      setExplanation("");
    });

    window.location.assign(mailto);
  }

  return (
    <form
      className="space-y-5 rounded-xl border border-slate-300 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950/50"
      autoComplete="off"
      onSubmit={openEmailDraft}
    >
      <div>
        <label
          htmlFor="privacy-request-name"
          className="block font-semibold text-slate-950 dark:text-white"
        >
          Name
        </label>
        <input
          id="privacy-request-name"
          name="name"
          type="text"
          required
          maxLength={120}
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="privacy-request-email"
          className="block font-semibold text-slate-950 dark:text-white"
        >
          Email
        </label>
        <input
          id="privacy-request-email"
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="off"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="privacy-request-type"
          className="block font-semibold text-slate-950 dark:text-white"
        >
          Request type
        </label>
        <select
          id="privacy-request-type"
          name="requestType"
          value={requestType}
          onChange={(event) =>
            setRequestType(event.target.value as PrivacyRequestType)
          }
          className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        >
          {requestTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {needsPaymentReference ? (
        <div>
          <label
            htmlFor="privacy-request-payment-reference"
            className="block font-semibold text-slate-950 dark:text-white"
          >
            Stripe payment reference (optional)
          </label>
          <p id="payment-reference-help" className="mt-1 text-sm">
            Include only a Stripe receipt or payment reference if it is needed
            to locate the payment record. Never enter a card number, bank detail,
            bill account number, or insurance identifier.
          </p>
          <input
            id="privacy-request-payment-reference"
            name="paymentReference"
            type="text"
            maxLength={200}
            autoComplete="off"
            aria-describedby="payment-reference-help"
            value={paymentReference}
            onChange={(event) => setPaymentReference(event.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
          />
        </div>
      ) : null}

      <div>
        <label
          htmlFor="privacy-request-explanation"
          className="block font-semibold text-slate-950 dark:text-white"
        >
          General non-health explanation (optional)
        </label>
        <p id="privacy-explanation-help" className="mt-1 text-sm">
          Explain the request in general terms only. Do not include medical,
          billing, insurance, identity, or payment details.
        </p>
        <textarea
          id="privacy-request-explanation"
          name="explanation"
          rows={5}
          maxLength={1000}
          autoComplete="off"
          aria-describedby="privacy-explanation-help"
          value={explanation}
          onChange={(event) => setExplanation(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-400 bg-white px-3 py-2 text-slate-950 dark:border-slate-600 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div className="rounded-lg border border-sky-300 bg-sky-50 p-4 text-sm text-sky-950 dark:border-sky-800 dark:bg-sky-950/30 dark:text-sky-100">
        Selecting the button opens a prefilled draft in your mail app. Medical
        Bill Reader does not receive or send it automatically. Review the draft,
        remove any sensitive information, and choose Send in your mail app.
      </div>

      <button
        type="submit"
        className="rounded-lg bg-teal-800 px-5 py-3 font-semibold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500"
      >
        Open email draft — does not send
      </button>
    </form>
  );
}
