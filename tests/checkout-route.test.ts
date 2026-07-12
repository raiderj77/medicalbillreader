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

vi.mock("@/lib/stripe", () => ({
  getStripe: () => stripe,
  verifiedStripePriceId: prices.priceId,
  SUBSCRIPTION_MONTHLY_CAP: 44,
}));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: vi.fn().mockResolvedValue(true),
}));

import { POST } from "@/app/api/checkout/route";

function request(priceType: string, origin = "https://attacker.example") {
  return new NextRequest("https://medicalbillreader.com/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", origin },
    body: JSON.stringify({ priceType }),
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
  });

  it("creates only the mapped $4.99 entitlement checkout on the trusted origin", async () => {
    const response = await POST(request("per-use"));
    expect(response.status).toBe(200);
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_single", quantity: 1 }],
        metadata: { mbr_entitlement: "per_use" },
        success_url: expect.stringMatching(
          /^https:\/\/medicalbillreader\.com\//,
        ),
        cancel_url: "https://medicalbillreader.com/pricing?payment=cancelled",
      }),
    );
  });

  it("creates only the mapped $49 subscription with the server cap", async () => {
    const response = await POST(request("subscription"));
    expect(response.status).toBe(200);
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_monthly", quantity: 1 }],
        metadata: { mbr_entitlement: "subscription" },
        subscription_data: {
          metadata: { mbr_entitlement: "subscription", monthly_cap: "44" },
        },
      }),
    );
  });

  it("rejects unknown plan names without creating a Stripe session", async () => {
    const response = await POST(request("free"));
    expect(response.status).toBe(400);
    expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
  });
});
