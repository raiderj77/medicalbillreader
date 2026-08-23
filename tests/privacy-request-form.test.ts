import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyRequestPage from "@/app/privacy-request/page";
import {
  createPrivacyRequestMailto,
  privacyRequestNeedsPaymentReference,
} from "@/components/PrivacyRequestForm";

const component = readFileSync(
  "src/components/PrivacyRequestForm.tsx",
  "utf8",
);
const page = readFileSync("src/app/privacy-request/page.tsx", "utf8");

describe("privacy-request intake", () => {
  it("renders the exact health-data warning and only approved field types", () => {
    const html = renderToStaticMarkup(createElement(PrivacyRequestPage));

    expect(html).toContain(
      "Do not attach a medical bill, EOB, diagnosis, treatment information, insurance identifier, or other health information.",
    );
    expect(html).toContain('name="name"');
    expect(html).toContain('name="email"');
    expect(html).toContain('name="requestType"');
    expect(html).toContain('name="explanation"');
    expect(component).toContain('name="paymentReference"');
    expect(html).not.toContain('type="file"');
    expect(component).not.toMatch(/name="(bill|eob|diagnosis|treatment|insurance|claim|member|account)"/i);
  });

  it("shows the payment reference only for a payment-record request", () => {
    expect(privacyRequestNeedsPaymentReference("payment-record")).toBe(true);
    expect(privacyRequestNeedsPaymentReference("access")).toBe(false);
    expect(privacyRequestNeedsPaymentReference("deletion")).toBe(false);
  });

  it("creates a draft for the user's mail app without sending it", () => {
    const mailto = createPrivacyRequestMailto({
      name: "Synthetic Requester",
      email: "requester@example.invalid",
      requestType: "payment-record",
      paymentReference: "synthetic-reference",
      explanation: "Please confirm the categories of records retained.",
    });
    const decoded = decodeURIComponent(mailto);

    expect(decoded).toContain("mailto:privacy@medicalbillreader.com?");
    expect(decoded).toContain("Privacy Request: Payment or refund record request");
    expect(decoded).toContain("Stripe payment reference: synthetic-reference");
    expect(decoded).toContain("General non-health explanation:");
    expect(component).toContain("window.location.assign(mailto)");
    expect(component).toContain("does not receive or send it automatically");
  });

  it("has no site submission, analytics, persistence, or page-URL state", () => {
    const combined = `${page}\n${component}`;

    for (const prohibited of [
      "fetch(",
      "XMLHttpRequest",
      "sendBeacon",
      "FormData",
      "localStorage",
      "sessionStorage",
      "indexedDB",
      "document.cookie",
      "URLSearchParams",
      "window.location.search",
      "history.pushState",
      "history.replaceState",
      "gtag(",
      "dataLayer",
      "analytics.track",
    ]) {
      expect(combined, prohibited).not.toContain(prohibited);
    }

    expect(component).not.toMatch(/<form[^>]+action=/);
    expect(component).not.toMatch(/<form[^>]+method=/);
    expect(component).toContain('autoComplete="off"');
  });
});
