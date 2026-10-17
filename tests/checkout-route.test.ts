import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const stripe = vi.hoisted(() => ({
  checkout: { sessions: { create: vi.fn() } },
}));
const sdk = vi.hoisted(() => ({ get: vi.fn() }));
const prices = vi.hoisted(() => ({
  priceId: vi.fn(async (type: string) =>
    type === "per-use" ? "price_single" : "price_monthly",
  ),
}));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  createBinding: vi.fn(),
  createNonce: vi.fn(),
  discardNonce: vi.fn(),
  nonceHash: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: sdk.get,
  verifiedStripePriceId: prices.priceId,
  SUBSCRIPTION_MONTHLY_CAP: 44,
}));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(true),
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

function request(priceType: string, origin = "https://attacker.example") {
  return new NextRequest("https://medicalbillreader.com/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ priceType }),
  });
}

function rawRequest(body: string, contentLength?: number) {
  return new NextRequest("https://attacker.example/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(contentLength ? { "content-length": String(contentLength) } : {}),
    },
    body,
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sdk.get.mockReturnValue(stripe);
    process.env.ENABLE_SINGLE_ANALYSIS = "true";
    process.env.ENABLE_NEW_SUBSCRIPTIONS = "false";
    process.env.STRIPE_SECRET_KEY = "sk_test_configured";
    process.env.NEXT_PUBLIC_SITE_URL = "https://medicalbillreader.com";
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

  it.each([undefined, "false", "true"])("permanently rejects monthly purchases (%s) before Stripe or nonce", async (setting) => {
    if (setting === undefined) delete process.env.ENABLE_NEW_SUBSCRIPTIONS;
    else process.env.ENABLE_NEW_SUBSCRIPTIONS = setting;
    expect((await POST(request("subscription"))).status).toBe(403);
    expect(prices.priceId).not.toHaveBeenCalled();
    expect(sdk.get).not.toHaveBeenCalled();
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    expect(browserAccess.createNonce).not.toHaveBeenCalled();
  });
  it.each([undefined, "false", "TRUE"])("rejects disabled single purchase (%s) before Stripe or nonce", async (setting) => {
    if (setting === undefined) delete process.env.ENABLE_SINGLE_ANALYSIS;
    else process.env.ENABLE_SINGLE_ANALYSIS = setting;
    delete process.env.STRIPE_SECRET_KEY;
    const response = await POST(request("per-use"));
    expect(response.status).toBe(403);
    expect((await response.json()).error).toContain("not available yet");
    expect(prices.priceId).not.toHaveBeenCalled();
    expect(sdk.get).not.toHaveBeenCalled();
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
    expect(browserAccess.createNonce).not.toHaveBeenCalled();
  });

  it("rejects unknown plan names without creating a Stripe session", async () => {
    const response = await POST(request("free"));
    expect(response.status).toBe(400);
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("rejects malformed and oversized request bodies before Stripe", async () => {
    expect((await POST(rawRequest("not-json"))).status).toBe(400);
    expect((await POST(rawRequest("{}", 2_000))).status).toBe(413);
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it("falls back to the canonical origin when the configured URL is unsafe", async () => {
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
