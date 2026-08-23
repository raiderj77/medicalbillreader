import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const stripe = vi.hoisted(() => ({
  checkout: { sessions: { create: vi.fn() } },
}));
const prices = vi.hoisted(() => ({
  priceId: vi.fn(async () => "price_single"),
}));
const rateLimit = vi.hoisted(() => ({
  enforce: vi.fn().mockResolvedValue(true),
}));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  createBinding: vi.fn(),
  createNonce: vi.fn(),
  discardNonce: vi.fn(),
  nonceHash: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => stripe,
  verifiedStripePriceId: prices.priceId,
}));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: rateLimit.enforce,
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  BROWSER_BINDING_COOKIE: "mbr_browser_binding",
  browserBindingFromRequest: browserAccess.fromRequest,
  createBrowserBinding: browserAccess.createBinding,
  createCheckoutNonce: browserAccess.createNonce,
  discardCheckoutNonce: browserAccess.discardNonce,
  checkoutNonceHash: browserAccess.nonceHash,
}));

import { POST } from "@/app/api/checkout/route";

const TRUSTED_ORIGIN = "https://medicalbillreader.com";

function request(
  priceType: string,
  headers: Record<string, string> = {},
  url = TRUSTED_ORIGIN + "/api/checkout",
) {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: TRUSTED_ORIGIN,
      host: "medicalbillreader.com",
      ...headers,
    },
    body: JSON.stringify({ priceType }),
  });
}

function rawRequest(body: string, contentLength?: number) {
  return new NextRequest(TRUSTED_ORIGIN + "/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: TRUSTED_ORIGIN,
      host: "medicalbillreader.com",
      ...(contentLength ? { "content-length": String(contentLength) } : {}),
    },
    body,
  });
}

function chunkedRawRequest(chunks: string[]) {
  const encoder = new TextEncoder();
  let index = 0;
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (index >= chunks.length) {
        controller.close();
        return;
      }
      controller.enqueue(encoder.encode(chunks[index]));
      index += 1;
    },
  });
  return new NextRequest(TRUSTED_ORIGIN + "/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: TRUSTED_ORIGIN,
      host: "medicalbillreader.com",
    },
    body,
    duplex: "half",
  });
}

function expectNoCheckoutStateChange() {
  expect(rateLimit.enforce).not.toHaveBeenCalled();
  expect(browserAccess.createBinding).not.toHaveBeenCalled();
  expect(browserAccess.createNonce).not.toHaveBeenCalled();
  expect(prices.priceId).not.toHaveBeenCalled();
  expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_configured";
    process.env.NEXT_PUBLIC_SITE_URL = TRUSTED_ORIGIN;
    delete process.env.ENABLE_SINGLE_ANALYSIS;
    stripe.checkout.sessions.create.mockResolvedValue({
      url: "https://checkout.stripe.com/test",
    });
    browserAccess.fromRequest.mockReturnValue(null);
    browserAccess.createBinding.mockReturnValue({
      binding: "browser-binding",
      cookieValue: "signed-browser-binding",
    });
    browserAccess.createNonce.mockResolvedValue("checkout-nonce");
    browserAccess.nonceHash.mockReturnValue("a".repeat(64));
    browserAccess.discardNonce.mockResolvedValue(undefined);
  });

  it("creates only the mapped $4.99 entitlement checkout on the trusted origin", async () => {
    const response = await POST(request("per-use"));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
    expect(prices.priceId).toHaveBeenCalledWith("per-use");
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{ price: "price_single", quantity: 1 }],
        metadata: {
          mbr_entitlement: "per_use",
          mbr_checkout_nonce: "a".repeat(64),
        },
        success_url: expect.stringMatching(
          /^https:\/\/medicalbillreader\.com\/api\/checkout\/confirm\?nonce=checkout-nonce&session_id=/,
        ),
        cancel_url: "https://medicalbillreader.com/pricing?payment=cancelled",
      }),
    );
    expect(response.headers.get("set-cookie")).toContain(
      "mbr_browser_binding=signed-browser-binding",
    );
  });

  it("rejects new subscription checkout before state or provider work", async () => {
    const response = await POST(request("subscription"));
    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({
      error: "New monthly subscriptions are not available.",
    });
    expectNoCheckoutStateChange();
  });

  it("rejects comparison checkout before state or provider work", async () => {
    const response = await POST(request("comparison"));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: "Bill and EOB comparison checkout is not available yet.",
    });
    expectNoCheckoutStateChange();

    vi.clearAllMocks();
    expect((await POST(request("bill-eob-comparison"))).status).toBe(409);
    expectNoCheckoutStateChange();
  });

  it("rejects unknown plan names before state or provider work", async () => {
    expect((await POST(request("free"))).status).toBe(400);
    expectNoCheckoutStateChange();
  });

  it("rejects malformed and oversized request bodies before state or provider work", async () => {
    expect((await POST(rawRequest("not-json"))).status).toBe(400);
    expectNoCheckoutStateChange();

    vi.clearAllMocks();
    expect((await POST(rawRequest("null"))).status).toBe(400);
    expect((await POST(rawRequest('{"priceType":"per-use","amount":1}'))).status).toBe(400);
    expectNoCheckoutStateChange();

    vi.clearAllMocks();
    expect(
      (await POST(request("per-use", { "content-length": "not-a-number" })))
        .status,
    ).toBe(400);
    expectNoCheckoutStateChange();

    vi.clearAllMocks();
    expect((await POST(rawRequest("{}", 2_000))).status).toBe(413);
    expectNoCheckoutStateChange();
  });

  it("stops a chunked request as soon as its streamed body exceeds 1 KiB", async () => {
    const response = await POST(
      chunkedRawRequest([
        '{"priceType":"per-use","padding":"',
        "x".repeat(1_024),
        '"}',
      ]),
    );

    expect(response.status).toBe(413);
    expect(await response.json()).toEqual({
      error: "Checkout request is too large.",
    });
    expectNoCheckoutStateChange();
  });

  it("requires JSON and exact same-origin URL, Origin, and Host with no CORS grant", async () => {
    const badContentType = await POST(
      request("per-use", { "content-type": "text/plain" }),
    );
    expect(badContentType.status).toBe(415);
    expect(badContentType.headers.get("access-control-allow-origin")).toBeNull();

    const badOrigin = await POST(
      request("per-use", { origin: "https://attacker.example" }),
    );
    expect(badOrigin.status).toBe(403);

    const badHost = await POST(
      request("per-use", { host: "attacker.example" }),
    );
    expect(badHost.status).toBe(403);

    const badUrl = await POST(
      request(
        "per-use",
        { host: "medicalbillreader.com", origin: TRUSTED_ORIGIN },
        "https://attacker.example/api/checkout",
      ),
    );
    expect(badUrl.status).toBe(403);
    expectNoCheckoutStateChange();
  });

  it("fails closed before state or provider work when the single sale is disabled", async () => {
    process.env.ENABLE_SINGLE_ANALYSIS = "false";
    expect((await POST(request("per-use"))).status).toBe(503);
    expectNoCheckoutStateChange();
  });

  it("fails closed on an invalid feature flag", async () => {
    process.env.ENABLE_SINGLE_ANALYSIS = "yes";
    expect((await POST(request("per-use"))).status).toBe(500);
    expectNoCheckoutStateChange();
  });

  it("falls back to the canonical origin when configured redirect input is unsafe", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://attacker.example/path";
    await POST(request("per-use"));
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        success_url: expect.stringMatching(
          /^https:\/\/medicalbillreader\.com\//,
        ),
      }),
    );
  });

  it("deletes the pending nonce when Stripe checkout creation fails", async () => {
    stripe.checkout.sessions.create.mockRejectedValue(new Error("Stripe down"));
    expect((await POST(request("per-use"))).status).toBe(500);
    expect(browserAccess.discardNonce).toHaveBeenCalledWith("checkout-nonce");
  });
});
