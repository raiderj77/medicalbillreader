import { existsSync, readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import PrivacyRequestPage from "@/app/privacy-request/page";

const requestPagePath = "src/app/privacy-request/page.tsx";
const requestPage = readFileSync(requestPagePath, "utf8");
const requestFormPath = "src/components/PrivacyRequestForm.tsx";
const requestForm = readFileSync(requestFormPath, "utf8");
const privacyDocs = [
  "docs/privacy/data-map.md",
  "docs/privacy/retention-schedule.md",
  "docs/privacy/privacy-request-sop.md",
  "docs/privacy/consumer-health-data-incident-response.md",
  "docs/privacy/washington-mhmda-action-register.md",
  "docs/privacy/vendor-annual-review-checklist.md",
  "docs/processor-contract-status.md",
  "docs/consumer-health-data-data-map.md",
  "docs/processor-register.md",
  "docs/data-retention-matrix.md",
  "docs/privacy-request-runbook.md",
  "docs/health-data-incident-response-plan.md",
  "docs/health-breach-notification-assessment.md",
  "docs/washington-my-health-my-data-checklist.md",
  "docs/vendor-contract-review-checklist.md",
  "docs/annual-health-data-review.md",
] as const;

describe("privacy operations", () => {
  it("uses a client-only, no-site-storage privacy-request form", () => {
    const rendered = renderToStaticMarkup(createElement(PrivacyRequestPage));

    expect(rendered).toContain("Privacy Request");
    expect(rendered).toContain("Do not send sensitive details");
    expect(rendered).toContain("save values in browser storage");
    expect(rendered).toContain("does not receive or send it automatically");
    expect(rendered).toContain("<form");
    expect(rendered).toContain('name="name"');
    expect(rendered).toContain('name="email"');
    expect(rendered).toContain('name="requestType"');
    expect(rendered).toContain('name="explanation"');

    for (const prohibitedApi of [
      "fetch(",
      "XMLHttpRequest",
      "FormData",
      "localStorage",
      "sessionStorage",
      "document.cookie",
      "URLSearchParams",
    ]) {
      expect(`${requestPage}\n${requestForm}`, prohibitedApi).not.toContain(
        prohibitedApi,
      );
    }
  });

  it("never asks the requester for prohibited sensitive content", () => {
    const intake = `${requestPage}\n${requestForm}`;
    expect(intake).toContain("Do not include an identity document or sensitive locator");
    expect(intake).toContain("Never enter a card number, bank detail");
    expect(intake).toContain("Do not attach a medical bill, EOB, diagnosis");
    expect(intake).not.toMatch(/enter your (account|claim|member)/i);
    expect(intake).not.toMatch(/provide your (account|claim|member)/i);
    expect(intake).not.toMatch(/attach your (bill|eob|report)/i);
  });

  it("ships each required operating document with an explicit unknown boundary", () => {
    for (const path of privacyDocs) {
      expect(existsSync(path), path).toBe(true);
      const contents = readFileSync(path, "utf8");
      expect(contents, path).toContain("Last reviewed: 2026-08-23");
      expect(contents, path).toMatch(/unknown|unverified|pending|not legal advice/i);
    }
  });

  it("keeps HBNR and Washington decisions counsel-gated", () => {
    const incident = readFileSync(
      "docs/privacy/consumer-health-data-incident-response.md",
      "utf8",
    );
    const washington = readFileSync(
      "docs/privacy/washington-mhmda-action-register.md",
      "utf8",
    );

    expect(incident).toContain(
      "https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule",
    );
    expect(incident).toContain("unauthorized disclosure");
    expect(incident).toContain("requires counsel");
    expect(incident).toContain("No automated notice");
    expect(washington).toContain(
      "https://app.leg.wa.gov/RCW/default.aspx?cite=19.373&full=true",
    );
    expect(washington).toContain("Legal design unresolved");
    expect(washington).toContain("Processor contracts");
    expect(washington).toContain("Do not claim");
  });

  it("records processor BAA and retention status without overclaiming", () => {
    const register = readFileSync(
      "docs/processor-contract-status.md",
      "utf8",
    );

    expect(register).toContain("Account unverified");
    expect(register).toContain("BAA/ZDR/HIPAA-ready status blocked");
    expect(register).toContain("no Vercel BAA or HIPAA claim");
    expect(register).toContain("Do not call the service zero-retention");
    expect(register).toContain("public offerings do not prove");
  });
});
