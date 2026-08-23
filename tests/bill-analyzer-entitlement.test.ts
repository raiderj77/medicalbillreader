import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { requestAnalysisWithAccessFallback } from "@/lib/analyze-access";
import { syntheticBillAnalysisReport } from "./bill-analysis-fixture";

const analyzer = readFileSync("src/components/BillAnalyzer.tsx", "utf8");

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("BillAnalyzer entitlement bootstrap", () => {
  it("uses the server-authorized subscription before requesting free access", async () => {
    const report = syntheticBillAnalysisReport();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ report }));

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      true,
    );

    expect(result.data.report).toEqual(report);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      "/api/analyze",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("does not let failed free issuance block a returning pay-per-use credit", async () => {
    const report = syntheticBillAnalysisReport();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "Free issue limited" }, 429))
      .mockResolvedValueOnce(jsonResponse({ report }));

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      false,
    );

    expect(result.data.report).toEqual(report);
    expect(result.freeAccessError).toBe("Free issue limited");
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/api/entitlement/free",
      "/api/analyze",
    ]);
  });

  it("falls back to free access when a subscription hint is stale", async () => {
    const report = syntheticBillAnalysisReport();
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "Entitlement required" }, 401))
      .mockResolvedValueOnce(jsonResponse({ ready: true }))
      .mockResolvedValueOnce(jsonResponse({ report }));

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      true,
    );

    expect(result.data.report).toEqual(report);
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/api/analyze",
      "/api/entitlement/free",
      "/api/analyze",
    ]);
  });

  it("does not request free access when paid verification is retryable", async () => {
    const fetcher = vi.fn().mockResolvedValueOnce(
      jsonResponse(
        { error: "Paid analysis access is temporarily unavailable." },
        503,
      ),
    );

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      true,
    );

    expect(result.response.status).toBe(503);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      "/api/analyze",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("keeps the component wired to the paid-first fallback helper", () => {
    expect(analyzer).toContain("requestAnalysisWithAccessFallback(");
    expect(analyzer).toContain("if (freeAccessError)");
    expect(analyzer).not.toContain("if (!justPaidRef.current) {");
    expect(analyzer).toContain("ANALYZER_REVIEW_STATUS.label");
    expect(analyzer).toContain("No independent");
  });
});
