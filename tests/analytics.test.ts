import { afterEach, describe, expect, it, vi } from "vitest";
import { trackConversion } from "@/lib/analytics";

describe("privacy-safe conversion analytics", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("emits every required revenue-funnel event", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    const events = [
      "upload_started",
      "upload_completed",
      "checkout_started",
      "checkout_cancelled",
      "purchase_completed",
      "analysis_delivered",
      "payment_failed",
    ] as const;

    for (const event of events) trackConversion(event);

    expect(gtag.mock.calls.map((call) => call[1])).toEqual(events);
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
