import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const entitlement = vi.hoisted(() => ({ classify: vi.fn() }));
const rateLimit = vi.hoisted(() => ({ enforce: vi.fn() }));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  peekNonce: vi.fn(),
  completeNonce: vi.fn(),
  nonceHash: vi.fn(),
  seal: vi.fn(),
  bindingCookie: vi.fn(),
  validNonce: vi.fn(),
}));
vi.mock("@/lib/entitlement", () => ({
  classifyCompletedCheckout: entitlement.classify,
}));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: rateLimit.enforce,
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  BROWSER_BINDING_COOKIE: "mbr_browser_binding",
  browserBindingCookieValue: browserAccess.bindingCookie,
  browserBindingFromRequest: browserAccess.fromRequest,
  checkoutNoncePurchaseType: browserAccess.peekNonce,
  completeCheckoutNonce: browserAccess.completeNonce,
  checkoutNonceHash: browserAccess.nonceHash,
  sealStripeAccess: browserAccess.seal,
  validCheckoutNonce: browserAccess.validNonce,
}));

import { GET } from "@/app/api/checkout/confirm/route";
import { StoreUnavailableError } from "@/lib/redis";

describe("GET /api/checkout/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SITE_URL = "https://medicalbillreader.com";
    rateLimit.enforce.mockResolvedValue(true);
    browserAccess.fromRequest.mockReturnValue("browser-binding");
    browserAccess.peekNonce.mockResolvedValue("per-use");
    browserAccess.completeNonce.mockResolvedValue(true);
    browserAccess.nonceHash.mockReturnValue("a".repeat(64));
    browserAccess.seal.mockReturnValue("opaque-paid-token");
    browserAccess.bindingCookie.mockReturnValue("signed-browser-binding");
    browserAccess.validNonce.mockReturnValue(true);
  });

  it("never grants an entitlement for a missing, failed, or cancelled session", async () => {
    entitlement.classify.mockResolvedValue(null);
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_unpaid&nonce=checkout-nonce",
      ),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://medicalbillreader.com/pricing?payment=error",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(browserAccess.completeNonce).not.toHaveBeenCalled();
  });

  it("rejects malformed Stripe identifiers before calling Stripe", async () => {
    const response = await GET(
      new NextRequest(
        "https://attacker.example/api/checkout/confirm?session_id=bad%0Aid&nonce=checkout-nonce",
      ),
    );
    expect(response.headers.get("location")).toBe(
      "https://medicalbillreader.com/pricing?payment=error",
    );
    expect(entitlement.classify).not.toHaveBeenCalled();
  });

  it("sets a secure HttpOnly one-use cookie only after server verification", async () => {
    entitlement.classify.mockResolvedValue({ type: "per-use" });
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce",
      ),
    );
    const cookie = response.headers.get("set-cookie") || "";
    expect(cookie).toContain("mbr_pending_use=opaque-paid-token");
    expect(cookie).not.toContain("cs_paid");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("secure");
    expect(cookie).toContain("Max-Age=86400");
    expect(cookie).toContain("mbr_browser_binding=signed-browser-binding");
  });

  it("sets subscription authorization from the verified Stripe subscription", async () => {
    browserAccess.peekNonce.mockResolvedValue("subscription");
    browserAccess.seal.mockReturnValue("opaque-subscription-token");
    entitlement.classify.mockResolvedValue({
      type: "subscription",
      subscriptionId: "sub_verified",
    });
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_sub&nonce=checkout-nonce",
      ),
    );
    const cookie = response.headers.get("set-cookie") || "";
    expect(cookie).toContain("mbr_sub_id=opaque-subscription-token");
    expect(cookie).not.toContain("sub_verified");
    expect(cookie).toContain("Max-Age=34560000");
  });

  it("rate-limits confirmation before any Stripe classification", async () => {
    rateLimit.enforce.mockResolvedValue(false);

    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce",
      ),
    );

    expect(response.status).toBe(429);
    expect(entitlement.classify).not.toHaveBeenCalled();
    expect(browserAccess.peekNonce).not.toHaveBeenCalled();
    expect(browserAccess.completeNonce).not.toHaveBeenCalled();
  });

  it("rejects a missing browser nonce before Stripe", async () => {
    browserAccess.peekNonce.mockResolvedValue(null);

    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce",
      ),
    );

    expect(response.headers.get("location")).toContain("payment=error");
    expect(entitlement.classify).not.toHaveBeenCalled();
    expect(browserAccess.completeNonce).not.toHaveBeenCalled();
  });

  it("keeps the confirmation URL usable during a transient Stripe failure", async () => {
    entitlement.classify
      .mockResolvedValueOnce({ type: "unavailable" })
      .mockResolvedValueOnce({ type: "per-use" });
    const url =
      "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce";

    const failed = await GET(new NextRequest(url));
    expect(failed.status).toBe(503);
    expect(failed.headers.get("retry-after")).toBe("15");
    expect(await failed.text()).toContain(
      "session_id=cs_paid&amp;nonce=checkout-nonce&amp;retry=1",
    );
    expect(browserAccess.completeNonce).not.toHaveBeenCalled();

    const retried = await GET(new NextRequest(url));
    expect(retried.headers.get("location")).toBe(
      "https://medicalbillreader.com/?payment=success#analyzer",
    );
    expect(browserAccess.peekNonce).toHaveBeenCalledTimes(2);
    expect(browserAccess.completeNonce).toHaveBeenCalledOnce();
  });

  it.each([
    ["rate limit", () => rateLimit.enforce.mockRejectedValueOnce(new StoreUnavailableError())],
    ["nonce lookup", () => browserAccess.peekNonce.mockRejectedValueOnce(new StoreUnavailableError())],
    ["nonce completion", () => {
      entitlement.classify.mockResolvedValue({ type: "per-use" });
      browserAccess.completeNonce.mockRejectedValueOnce(
        new StoreUnavailableError(),
      );
    }],
  ])("preserves the paid return when Redis fails during %s", async (_phase, fail) => {
    fail();
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce",
      ),
    );

    expect(response.status).toBe(503);
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(await response.text()).toContain(
      "session_id=cs_paid&amp;nonce=checkout-nonce&amp;retry=1",
    );
  });

  it("prepares the entitlement response before recording completion", async () => {
    entitlement.classify.mockResolvedValue({ type: "per-use" });

    await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce",
      ),
    );

    expect(browserAccess.seal).toHaveBeenCalledOnce();
    expect(browserAccess.completeNonce).toHaveBeenCalledOnce();
    expect(browserAccess.seal.mock.invocationCallOrder[0]).toBeLessThan(
      browserAccess.completeNonce.mock.invocationCallOrder[0],
    );
  });

  it("reissues paid access for the same completed browser and session", async () => {
    entitlement.classify.mockResolvedValue({ type: "per-use" });
    const url =
      "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce";

    const first = await GET(new NextRequest(url));
    const retry = await GET(new NextRequest(url));

    expect(first.headers.get("set-cookie")).toContain("mbr_pending_use=");
    expect(retry.headers.get("set-cookie")).toContain("mbr_pending_use=");
    expect(browserAccess.completeNonce).toHaveBeenCalledTimes(2);
  });

  it("does not return a prepared token when completion state mismatches", async () => {
    entitlement.classify.mockResolvedValue({ type: "per-use" });
    browserAccess.completeNonce.mockResolvedValue(false);

    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid&nonce=checkout-nonce",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://medicalbillreader.com/pricing?payment=error",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
