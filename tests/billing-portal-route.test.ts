import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const stripe = vi.hoisted(() => ({
  subscriptions: { retrieve: vi.fn() },
  billingPortal: { sessions: { create: vi.fn() } },
}));
vi.mock("@/lib/stripe", () => ({ getStripe: () => stripe }));

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
  });

  it("rejects browser requests without a server-issued subscription cookie", async () => {
    expect((await POST(request())).status).toBe(401);
    expect(stripe.billingPortal.sessions.create).not.toHaveBeenCalled();
  });

  it("creates a portal only for a verified Medical Bill Reader subscription", async () => {
    stripe.subscriptions.retrieve.mockResolvedValue({
      customer: "cus_verified",
      metadata: { mbr_entitlement: "subscription" },
    });
    stripe.billingPortal.sessions.create.mockResolvedValue({
      url: "https://billing.stripe.com/session/test",
    });

    const response = await POST(request("mbr_sub_id=sub_verified"));
    expect(response.status).toBe(200);
    expect(stripe.billingPortal.sessions.create).toHaveBeenCalledWith({
      customer: "cus_verified",
      return_url: "https://medicalbillreader.com/pricing",
    });
  });
});
