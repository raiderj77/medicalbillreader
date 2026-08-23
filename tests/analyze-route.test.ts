import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { anthropicReportEnvelope, syntheticBillAnalysisReport } from "./bill-analysis-fixture";

const entitlement = vi.hoisted(() => ({
  reserve: vi.fn(),
  commit: vi.fn(),
  release: vi.fn(),
  TemporarilyUnavailableError: class extends Error {},
}));
vi.mock("@/lib/entitlement", () => ({
  reserveRequestEntitlement: entitlement.reserve,
  commitEntitlement: entitlement.commit,
  releaseEntitlement: entitlement.release,
  EntitlementTemporarilyUnavailableError:
    entitlement.TemporarilyUnavailableError,
}));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(true),
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  BROWSER_BINDING_COOKIE: "mbr_browser_binding",
  browserBindingCookieValue: vi.fn(() => "signed-browser-binding"),
  sealStripeAccess: vi.fn(() => "opaque-subscription-token"),
}));

import { OPTIONS, POST } from "@/app/api/analyze/route";
import { RequestTimeoutError } from "@/lib/fetch-with-timeout";
import { MAX_PROVIDER_RESPONSE_BYTES } from "@/lib/bill-analysis-output";

const validBody = {
  image:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  fileType: "image/png",
  processingAcknowledged: true,
};
const reservation = {
  kind: "paid" as const,
  key: "paid:key",
  reservationId: "reservation",
  externalId: "cs_paid",
};

function request(
  body: unknown,
  cookie?: string,
  headers?: Record<string, string>,
) {
  return new NextRequest("https://medicalbillreader.com/api/analyze", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://medicalbillreader.com",
      host: "medicalbillreader.com",
      ...(cookie ? { cookie } : {}),
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function providerResponse(body: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

describe("POST /api/analyze structured safety and entitlement controls", () => {
  afterEach(() => vi.unstubAllEnvs());

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = "https://medicalbillreader.com";
    entitlement.commit.mockResolvedValue(true);
    entitlement.release.mockResolvedValue(undefined);
  });

  it("rejects direct bypass calls without server entitlement before AI", async () => {
    entitlement.reserve.mockResolvedValue(null);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(
      request(
        { ...validBody, freeTierRemaining: 1 },
        "medical_bill_reader_usage=fake",
      ),
    );
    expect(response.status).toBe(401);
    expect(ai).not.toHaveBeenCalled();
  });

  it("fails closed before entitlement or AI when single analysis is disabled", async () => {
    vi.stubEnv("ENABLE_SINGLE_ANALYSIS", "false");
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request(validBody));
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(entitlement.reserve).not.toHaveBeenCalled();
    expect(ai).not.toHaveBeenCalled();
  });

  it("passes the legacy-support policy to entitlement authority", async () => {
    vi.stubEnv("ENABLE_EXISTING_SUBSCRIPTION_SUPPORT", "false");
    entitlement.reserve.mockResolvedValue(null);
    const response = await POST(request(validBody));
    expect(response.status).toBe(401);
    expect(entitlement.reserve).toHaveBeenCalledWith(
      expect.any(NextRequest),
      false,
    );
  });

  it("rejects foreign origins and non-JSON requests before entitlement state", async () => {
    const ai = vi.spyOn(globalThis, "fetch");
    const foreign = await POST(
      request(validBody, undefined, { origin: "https://attacker.example" }),
    );
    const wrongType = await POST(
      request(validBody, undefined, { "content-type": "text/plain" }),
    );
    expect(foreign.status).toBe(403);
    expect(wrongType.status).toBe(415);
    expect(entitlement.reserve).not.toHaveBeenCalled();
    expect(ai).not.toHaveBeenCalled();
  });

  it("does not permit cross-origin OPTIONS access", () => {
    const response = OPTIONS();
    expect(response.status).toBe(405);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("returns retryable no-store response when paid verification is unavailable", async () => {
    entitlement.reserve.mockRejectedValue(
      new entitlement.TemporarilyUnavailableError(),
    );
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request(validBody));
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(ai).not.toHaveBeenCalled();
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it.each([
    [
      {
        image: "data:text/plain;base64,SGVsbG8=",
        fileType: "text/plain",
        processingAcknowledged: true,
      },
    ],
    [
      {
        image: "data:image/png;base64,%%%",
        fileType: "image/png",
        processingAcknowledged: true,
      },
    ],
  ])("rejects invalid uploads before AI", async (body) => {
    entitlement.reserve.mockResolvedValue(reservation);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(ai).not.toHaveBeenCalled();
    expect(entitlement.release).toHaveBeenCalledOnce();
  });

  it("requires affirmative processing acknowledgement", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(
      request({ ...validBody, processingAcknowledged: false }),
    );
    expect(response.status).toBe(400);
    expect(ai).not.toHaveBeenCalled();
    expect(entitlement.release).toHaveBeenCalledOnce();
  });

  it("rejects oversized request bodies before AI", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(
      request(validBody, undefined, {
        "content-length": String(15 * 1024 * 1024),
      }),
    );
    expect(response.status).toBe(400);
    expect(ai).not.toHaveBeenCalled();
  });

  it("uses GA JSON schema output and keeps the attachment before task text", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const ai = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(providerResponse(anthropicReportEnvelope()));

    const response = await POST(request(validBody));
    expect(response.status).toBe(200);
    expect((await response.json()).report).toEqual(syntheticBillAnalysisReport());

    const init = ai.mock.calls[0][1] as RequestInit;
    const body = JSON.parse(String(init.body)) as {
      model: string;
      output_config: { format: { type: string; schema: { additionalProperties: boolean } } };
      messages: Array<{ content: Array<{ type?: string; text?: string }> }>;
      tools?: unknown;
      cache_control?: unknown;
    };
    expect(body.model).toBe("claude-sonnet-4-6");
    expect(body.output_config.format.type).toBe("json_schema");
    expect(body.output_config.format.schema.additionalProperties).toBe(false);
    expect(body.messages[0].content[0].type).toBe("image");
    expect(body.messages[0].content[1].text).toContain(
      "untrusted source data",
    );
    expect(body).not.toHaveProperty("tools");
    expect(body).not.toHaveProperty("cache_control");
    expect(JSON.stringify(body)).not.toContain("file_id");
  });

  it("fails closed before entitlement when the configured model has no reviewed price ceiling", async () => {
    vi.stubEnv("ANTHROPIC_MODEL", "unreviewed-model");
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request(validBody));
    expect(response.status).toBe(503);
    expect(entitlement.reserve).not.toHaveBeenCalled();
    expect(ai).not.toHaveBeenCalled();
  });

  it("releases the credit when reported usage exceeds the reviewed cost ceiling", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const envelope = {
      ...anthropicReportEnvelope(),
      usage: { input_tokens: 100_000, output_tokens: 2_000 },
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(providerResponse(envelope));
    const response = await POST(request(validBody));
    expect(response.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it("releases the credit when the provider reports a different model", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      providerResponse({
        ...anthropicReportEnvelope(),
        model: "different-provider-model",
      }),
    );
    const response = await POST(request(validBody));
    expect(response.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it.each([
    {
      ...anthropicReportEnvelope(),
      stop_reason: "max_tokens",
    },
    {
      ...anthropicReportEnvelope(),
      stop_reason: "refusal",
      content: [{ type: "text", text: "I cannot comply" }],
    },
    {
      ...anthropicReportEnvelope(),
      content: [{ type: "text", text: JSON.stringify({ documentType: {} }) }],
    },
    {
      ...anthropicReportEnvelope(),
      content: [{ type: "text", text: "## Arbitrary Markdown" }],
    },
  ])("releases credit for an invalid structured provider result", async (body) => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(providerResponse(body));
    const response = await POST(request(validBody));
    expect(response.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it("rejects a provider body with a lookalike JSON media type", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      providerResponse(anthropicReportEnvelope(), 200, {
        "content-type": "application/jsonp",
      }),
    );
    const response = await POST(request(validBody));
    expect(response.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it("scrubs identifiers and discards unsupported image page numbers before delivery", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const report = syntheticBillAnalysisReport();
    const unsafeReport = {
      ...report,
      documentSummary: "Contact jane@example.test about the synthetic source.",
      visibleFields: [
        {
          field: "Account number",
          value: "ABC123456",
          category: "other",
          page: 99,
          visibleText: "Account number: ABC123456",
          evidenceQuality: "clear",
          explanation: "A labeled identifier is visible.",
          limitation: null,
        },
      ],
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      providerResponse(anthropicReportEnvelope(unsafeReport as never)),
    );

    const response = await POST(request(validBody));
    const delivered = JSON.stringify(await response.json());
    expect(response.status).toBe(200);
    expect(delivered).not.toContain("jane@example.test");
    expect(delivered).not.toContain("ABC123456");
    expect(delivered).toContain("[identifier redacted]");
    expect(delivered).toContain('"page":null');
  });

  it("releases rather than consumes credit for provider failure or rate limit", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      providerResponse({ error: { type: "overloaded_error" } }, 500),
    );
    const failure = await POST(request(validBody));
    expect(failure.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);

    vi.clearAllMocks();
    entitlement.reserve.mockResolvedValue(reservation);
    entitlement.release.mockResolvedValue(undefined);
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      providerResponse({ error: { type: "rate_limit_error" } }, 429),
    );
    const limited = await POST(request(validBody));
    expect(limited.status).toBe(503);
    expect(limited.headers.get("retry-after")).toBe("60");
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it("releases credit for timeout and oversized provider JSON", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new RequestTimeoutError(),
    );
    const timeout = await POST(request(validBody));
    expect(timeout.status).toBe(504);
    expect(entitlement.commit).not.toHaveBeenCalled();

    vi.clearAllMocks();
    entitlement.reserve.mockResolvedValue(reservation);
    entitlement.release.mockResolvedValue(undefined);
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      providerResponse(anthropicReportEnvelope(), 200, {
        "content-length": String(MAX_PROVIDER_RESPONSE_BYTES + 1),
      }),
    );
    const oversized = await POST(request(validBody));
    expect(oversized.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it("never writes upload or provider content to logs", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const secret = "SYNTHETIC-SECRET-PROVIDER-TEXT";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      providerResponse({ error: { type: secret } }, 500),
    );
    const logger = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await POST(request(validBody));
    expect(JSON.stringify(logger.mock.calls)).not.toContain(secret);
    expect(JSON.stringify(logger.mock.calls)).not.toContain(validBody.image);
    expect(logger).toHaveBeenCalledWith(
      "[security] anthropic_request_server_failed",
    );
  });

  it("renews verified subscription access after a safe report", async () => {
    entitlement.reserve.mockResolvedValue({
      ...reservation,
      kind: "subscription",
      externalId: "sub_active",
      browserBinding: "browser-binding",
    });
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      providerResponse(anthropicReportEnvelope()),
    );
    const response = await POST(
      request(validBody, "mbr_pending_use=cs_stale; mbr_sub_id=sub_active"),
    );
    const cookie = response.headers.get("set-cookie") || "";
    expect(response.status).toBe(200);
    expect(cookie).toContain("mbr_sub_id=opaque-subscription-token");
    expect(cookie).toContain("mbr_sub_active=1");
    expect(cookie).toContain("mbr_browser_binding=signed-browser-binding");
    expect(cookie).toContain("mbr_pending_use=");
  });

  it("preserves the portal token after non-subscription analysis", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      providerResponse(anthropicReportEnvelope()),
    );
    const response = await POST(
      request(
        validBody,
        "mbr_sub_id=opaque-subscription-token; mbr_sub_active=1",
      ),
    );
    const cookie = response.headers.get("set-cookie") || "";
    expect(response.status).toBe(200);
    expect(cookie).not.toContain("mbr_sub_id=");
    expect(cookie).toContain("mbr_sub_active=");
    expect(cookie).toContain("Max-Age=0");
  });
});
