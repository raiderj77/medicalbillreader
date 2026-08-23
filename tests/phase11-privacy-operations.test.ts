import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const requiredDocs = [
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

function document(path: (typeof requiredDocs)[number]): string {
  return readFileSync(path, "utf8");
}

describe("Truthmode Phase 11 privacy operations", () => {
  it("ships every exact required document path with review status", () => {
    for (const path of requiredDocs) {
      expect(existsSync(path), path).toBe(true);
      expect(document(path), path).toContain("Last reviewed: 2026-08-23");
      expect(document(path), path).toMatch(/unknown|pending|not legal advice/i);
    }
  });

  it("maps every required health-data flow without claiming zero retention", () => {
    const dataMap = document("docs/consumer-health-data-data-map.md");
    for (const stage of [
      "Browser file selection",
      "Browser preview",
      "Redaction flow",
      "Request to Vercel",
      "Vercel function memory",
      "Anthropic API processing",
      "Report return",
      "Browser report display",
      "Entitlement cookies",
      "HMAC security keys",
      "Stripe payment records",
      "Upstash records",
      "Vercel request metadata",
      "Support email",
      "Privacy-request email",
      "Existing logs",
      "Backups",
      "External vendor retention",
    ]) {
      expect(dataMap, stage).toContain(stage);
    }
    expect(dataMap).toMatch(/unknown[\s\S]{0,100}not (?:proof of )?zero/i);
  });

  it("records every required processor and contract field as unknown when unverified", () => {
    const register = document("docs/processor-register.md");

    for (const processor of [
      "## Anthropic",
      "## Vercel",
      "## Upstash",
      "## Stripe",
      "## Domain provider",
      "## Email provider",
      "## GitHub",
      "## Monitoring and support providers",
    ]) {
      expect(register, processor).toContain(processor);
    }

    for (const field of [
      "Service/purpose",
      "Data categories",
      "Document content received",
      "Report content received",
      "Payment data received",
      "Current agreement",
      "DPA status",
      "BAA status",
      "ZDR status",
      "Retention terms",
      "Subprocessors",
      "Security documentation",
      "Breach-notification terms",
      "Deletion process",
      "Owner review date",
    ]) {
      expect(register, field).toContain(field);
    }
    expect(register).toContain(
      "Do not state that an agreement, DPA, BAA, zero-data-retention term",
    );
  });

  it("covers request, incident, HBNR, Washington, vendor, and annual gates", () => {
    const request = document("docs/privacy-request-runbook.md");
    expect(request).toContain("## 2. Safe opening and acknowledgement");
    expect(request).toContain("## 3. Identity verification");
    expect(request).toContain("## 5. Minimum authorized data-location search");
    expect(request).toContain("## 8. Appeal");
    expect(request).toContain("## 9. Minimum necessary request log");

    const incident = document("docs/health-data-incident-response-plan.md");
    for (const topic of [
      "Detection and triage",
      "Immediate containment",
      "Access revocation",
      "Secret rotation",
      "Vendor notification",
      "Data-flow investigation",
      "Legal and contractual assessment",
      "FTC Health Breach Notification Rule assessment",
      "State breach-law assessment",
      "Consumer-notification assessment",
      "Evidence preservation",
      "Remediation and verification",
      "Post-incident review",
      "Contacts and authority placeholders",
    ]) {
      expect(incident, topic).toContain(topic);
    }
    expect(incident).toContain("No legal notification deadline is stated here");

    expect(document("docs/health-breach-notification-assessment.md")).toContain(
      "No automated notice",
    );
    expect(document("docs/washington-my-health-my-data-checklist.md")).toContain(
      "Do not claim Washington My Health My Data compliance",
    );
    expect(document("docs/vendor-contract-review-checklist.md")).toMatch(
      /does not authorize a\s+purchase, BAA, DPA/,
    );
    expect(document("docs/annual-health-data-review.md")).toContain(
      "synthetic non-health fixtures only",
    );
  });
});
