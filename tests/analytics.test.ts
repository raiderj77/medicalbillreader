import { afterEach, describe, expect, it, vi } from "vitest";
import {
  analysisFailureCategory,
  trackConversion,
} from "@/lib/analytics";

describe("privacy-safe conversion analytics", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("emits every required revenue-funnel event", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    const events = [
      "upload_started",
      "upload_completed",
      "analysis_started",
      "analysis_failed",
      "upgrade_prompt_viewed",
      "checkout_started",
      "checkout_cancelled",
      "purchase_completed",
      "analysis_delivered",
      "payment_failed",
    ] as const;

    for (const event of events) trackConversion(event);

    expect(gtag.mock.calls.map((call) => call[1])).toEqual(events);
  });

  it("records only coarse approved analysis outcome dimensions", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackConversion("analysis_failed", {
      access_type: "per-use",
      failure_stage: "analysis",
      failure_category: "provider_timeout",
      error_message: "private provider response",
      file_name: "patient-name-bill.pdf",
    } as never);

    expect(gtag).toHaveBeenCalledWith("event", "analysis_failed", {
      access_type: "per-use",
      failure_stage: "analysis",
      failure_category: "provider_timeout",
    });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("private provider");
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("patient-name");
  });

  it("drops unapproved parameter values", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackConversion("analysis_failed", {
      access_type: "patient account",
      failure_stage: "raw error",
      failure_category: "diagnosis text",
      file_type: "patient/name",
      plan: "enterprise",
    } as never);

    expect(gtag).toHaveBeenCalledWith("event", "analysis_failed", {});
  });

  it("maps response statuses to non-sensitive failure categories", () => {
    expect(analysisFailureCategory(400)).toBe("invalid_file");
    expect(analysisFailureCategory(401)).toBe("entitlement_required");
    expect(analysisFailureCategory(429)).toBe("rate_limited");
    expect(analysisFailureCategory(502)).toBe("provider_rejected");
    expect(analysisFailureCategory(503)).toBe("service_unavailable");
    expect(analysisFailureCategory(504)).toBe("provider_timeout");
    expect(analysisFailureCategory(418)).toBe("unexpected");
  });

  it("sends only approved event parameters and never bill or identity fields", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackConversion("analysis_delivered", {
      plan: "per-use",
      file_type: "application/pdf",
      patient_name: "Jane Secret",
      bill_text: "private diagnosis",
    } as never);

    expect(gtag).toHaveBeenCalledWith("event", "analysis_delivered", {
      plan: "per-use",
      file_type: "application/pdf",
    });
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("Jane Secret");
    expect(JSON.stringify(gtag.mock.calls)).not.toContain("private diagnosis");
  });
});
