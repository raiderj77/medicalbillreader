import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const stripe = vi.hoisted(() => ({
  subscriptions: { retrieve: vi.fn() },
  billingPortal: { sessions: { create: vi.fn() } },
}));
const rateLimit = vi.hoisted(() => ({ enforce: vi.fn() }));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  open: vi.fn(),
  seal: vi.fn(),
  bindingCookie: vi.fn(),
}));
vi.mock("@/lib/stripe", () => ({ getStripe: () => stripe }));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: rateLimit.enforce,
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  BROWSER_BINDING_COOKIE: "mbr_browser_binding",
  browserBindingCookieValue: browserAccess.bindingCookie,
  browserBindingFromRequest: browserAccess.fromRequest,
  openStripeAccess: browserAccess.open,
  sealStripeAccess: browserAccess.seal,
}));

import { POST } from "@/app/api/billing-portal/route";

function request(cookie?: string) {
  return new NextRequest("https://medicalbillreader.com/api/billing-portal", {
    method: "POST",
    headers: cookie ? { cookie } : undefined,
  });
}

describe("POST /api/billing-portal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_configured";
    process.env.NEXT_PUBLIC_SITE_URL = "https://medicalbillreader.com";
    rateLimit.enforce.mockResolvedValue(true);
    browserAccess.fromRequest.mockReturnValue("browser-binding");
    browserAccess.open.mockReturnValue("sub_verified");
    browserAccess.seal.mockReturnValue("renewed-subscription-token");
    browserAccess.bindingCookie.mockReturnValue("signed-browser-binding");
  });

  it("rejects browser requests without a server-issued subscription cookie", async () => {
    const response = await POST(request());
    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(stripe.billingPortal.sessions.create).not.toHaveBeenCalled();
  });

  it("rejects forged or stale opaque subscription tokens before Stripe", async () => {
    browserAccess.open.mockReturnValue(null);
    expect((await POST(request("mbr_sub_id=forged-token"))).status).toBe(401);
    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled();
  });

  it("creates a portal without renewing paid-access cookies", async () => {
    stripe.subscriptions.retrieve.mockResolvedValue({
      id: "sub_verified",
      customer: "cus_verified",
      status: "active",
      cancel_at_period_end: true,
      metadata: { mbr_entitlement: "subscription" },
    });
    stripe.billingPortal.sessions.create.mockResolvedValue({
      url: "https://billing.stripe.com/session/test",
    });

    const response = await POST(request("mbr_sub_id=opaque-subscription-token"));
    expect(response.status).toBe(200);
    expect(browserAccess.open).toHaveBeenCalledWith(
      "opaque-subscription-token",
      "subscription",
      "browser-binding",
    );
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: "cus_verified",
      return_url: "https://medicalbillreader.com/pricing",
    });
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(browserAccess.seal).not.toHaveBeenCalled();
    expect(browserAccess.bindingCookie).not.toHaveBeenCalled();
  });

  it.each(["canceled", "trialing"])(
    "keeps portal access for a %s subscription without renewing entitlement cookies",
    async (status) => {
      stripe.subscriptions.retrieve.mockResolvedValue({
        id: "sub_verified",
        customer: "cus_verified",
        status,
        metadata: { mbr_entitlement: "subscription" },
      });
      stripe.billingPortal.sessions.create.mockResolvedValue({
        url: "https://billing.stripe.com/session/test",
      });

      const response = await POST(
        request("mbr_sub_id=opaque-subscription-token"),
      );

      expect(response.status).toBe(200);
      expect(stripe.billingPortal.sessions.create).toHaveBeenCalledOnce();
      expect(response.headers.get("set-cookie")).toBeNull();
    },
  );

  it("keeps portal access while collection is paused without renewing entitlement cookies", async () => {
    stripe.subscriptions.retrieve.mockResolvedValue({
      id: "sub_verified",
      customer: "cus_verified",
      status: "active",
      pause_collection: { behavior: "void", resumes_at: null },
      metadata: { mbr_entitlement: "subscription" },
    });
    stripe.billingPortal.sessions.create.mockResolvedValue({
      url: "https://billing.stripe.com/session/test",
    });

    const response = await POST(
      request("mbr_sub_id=opaque-subscription-token"),
    );

    expect(response.status).toBe(200);
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledOnce();
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it.each([
    [{}, "cus_verified"],
    [{ mbr_entitlement: "subscription" }, null],
  ])(
    "rejects a subscription with invalid metadata or customer",
    async (metadata, customer) => {
      stripe.subscriptions.retrieve.mockResolvedValue({
        id: "sub_verified",
        customer,
        status: "active",
        metadata,
      });

      const response = await POST(
        request("mbr_sub_id=opaque-subscription-token"),
      );

      expect(response.status).toBe(401);
      expect(stripe.billingPortal.sessions.create).not.toHaveBeenCalled();
    },
  );

  it("rate-limits portal creation before any Stripe call", async () => {
    rateLimit.enforce.mockResolvedValue(false);

    const response = await POST(
      request("mbr_sub_id=opaque-subscription-token"),
    );

    expect(response.status).toBe(429);
    expect(browserAccess.open).not.toHaveBeenCalled();
    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled();
    expect(stripe.billingPortal.sessions.create).not.toHaveBeenCalled();
  });

  it("returns a retryable error when Subscription retrieval fails", async () => {
    stripe.subscriptions.retrieve.mockRejectedValueOnce(
      new Error("synthetic Stripe outage"),
    );

    const response = await POST(
      request("mbr_sub_id=opaque-subscription-token"),
    );

    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(stripe.billingPortal.sessions.create).not.toHaveBeenCalled();
  });

  it("returns a retryable error when portal-session creation fails", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_verified",
      customer: "cus_verified",
      status: "canceled",
      metadata: { mbr_entitlement: "subscription" },
    });
    stripe.billingPortal.sessions.create.mockRejectedValueOnce(
      new Error("synthetic Stripe outage"),
    );

    const response = await POST(
      request("mbr_sub_id=opaque-subscription-token"),
    );

    expect(response.status).toBe(502);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
});
