import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const redis = vi.hoisted(() => ({ command: vi.fn() }));
const stripe = vi.hoisted(() => ({
  webhooks: { constructEvent: vi.fn() },
  paymentIntents: { retrieve: vi.fn(), update: vi.fn() },
}));

vi.mock("@/lib/redis", () => ({ redisCommand: redis.command }));
vi.mock("@/lib/stripe", () => ({ getStripe: () => stripe }));

import { POST } from "@/app/api/stripe/webhook/route";

function request(body = "signed-payload") {
  return new NextRequest("https://medicalbillreader.com/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": "test-signature" },
    body,
  });
}

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    stripe.paymentIntents.retrieve.mockResolvedValue({
      id: "pi_paid",
      metadata: { mbr_entitlement: "per_use" },
    });
  });

  it("rejects an invalid signature before processing", async () => {
    stripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("invalid");
    });
    const response = await POST(request());
    expect(response.status).toBe(400);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("processes a refund once and revokes the paid entitlement", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      id: "evt_refund",
      type: "refund.created",
      data: { object: { payment_intent: "pi_paid" } },
    });
    redis.command
      .mockResolvedValueOnce("OK")
      .mockResolvedValueOnce("OK")
      .mockResolvedValueOnce(null);

    expect((await POST(request())).status).toBe(200);
    expect(stripe.paymentIntents.update).toHaveBeenCalledWith("pi_paid", {
      metadata: { mbr_entitlement: "per_use", refunded: "true" },
    });

    expect((await POST(request())).status).toBe(200);
    expect(stripe.paymentIntents.update).toHaveBeenCalledTimes(1);
  });

  it("releases the idempotency lock when processing fails so Stripe can retry", async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      id: "evt_retry",
      type: "charge.refunded",
      data: { object: { payment_intent: "pi_paid" } },
    });
    redis.command.mockResolvedValueOnce("OK").mockResolvedValueOnce(1);
    stripe.paymentIntents.retrieve.mockRejectedValue(new Error("temporary"));

    expect((await POST(request())).status).toBe(500);
    expect(redis.command).toHaveBeenLastCalledWith([
      "DEL",
      expect.stringContaining("mbr:stripe:event:"),
    ]);
  });
});
