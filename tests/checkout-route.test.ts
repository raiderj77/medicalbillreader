import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const stripe = vi.hoisted(() => ({
  checkout: { sessions: { create: vi.fn() } },
}));
const prices = vi.hoisted(() => ({
  priceId: vi.fn(async (type: string) =>
    type === "per-use" ? "price_single" : "price_monthly",
  ),
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

  it("rejects new subscriptions before creating checkout state", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const response = await POST(request("subscription"));
    expect(response.status).toBe(410);
    expect(await response.json()).toEqual({
      error: "New monthly subscriptions are not available.",
    });
    expect(browserAccess.createBinding).not.toHaveBeenCalled();
    expect(browserAccess.createNonce).not.toHaveBeenCalled();
    expect(rateLimit.enforce).not.toHaveBeenCalled();
    expect(prices.priceId).not.toHaveBeenCalled();
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
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
