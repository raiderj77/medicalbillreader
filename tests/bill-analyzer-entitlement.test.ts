import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { requestAnalysisWithAccessFallback } from "@/lib/analyze-access";

const analyzer = readFileSync("src/components/BillAnalyzer.tsx", "utf8");

function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("BillAnalyzer entitlement bootstrap", () => {
  it("uses the server-authorized subscription before requesting free access", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ result: "subscription result" }));

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      true,
    );

    expect(result.data.result).toBe("subscription result");
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith(
      "/api/analyze",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("does not let failed free issuance block a returning pay-per-use credit", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "Free issue limited" }, 429))
      .mockResolvedValueOnce(jsonResponse({ result: "paid result" }));

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      false,
    );

    expect(result.data.result).toBe("paid result");
    expect(result.freeAccessError).toBe("Free issue limited");
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/api/entitlement/free",
      "/api/analyze",
    ]);
  });

  it("falls back to free access when a subscription hint is stale", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "Entitlement required" }, 401))
      .mockResolvedValueOnce(jsonResponse({ ready: true }))
      .mockResolvedValueOnce(jsonResponse({ result: "free result" }));

    const result = await requestAnalysisWithAccessFallback(
      fetcher,
      { image: "data", fileType: "image/png", processingAcknowledged: true },
      true,
    );

    expect(result.data.result).toBe("free result");
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/api/analyze",
      "/api/entitlement/free",
      "/api/analyze",
    ]);
  });

  it("keeps the component wired to the paid-first fallback helper", () => {
    expect(analyzer).toContain("requestAnalysisWithAccessFallback(");
    expect(analyzer).toContain("if (freeAccessError)");
    expect(analyzer).not.toContain("if (!justPaidRef.current) {");
  });
});
