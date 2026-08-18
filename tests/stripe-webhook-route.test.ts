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

function request(body = "signed-payload", contentLength?: number) {
  return new NextRequest("https://medicalbillreader.com/api/stripe/webhook", {
    method: "POST",
    headers: {
      "stripe-signature": "test-signature",
      ...(contentLength === undefined
        ? {}
        : { "content-length": String(contentLength) }),
    },
    body,
  });
}

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  });

  it("rejects an invalid signature before processing", async () => {
    stripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error("invalid");
    });
    const response = await POST(request());
    expect(response.status).toBe(400);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("rejects declared and streamed oversized bodies before signature verification", async () => {
    expect((await POST(request("small", 256 * 1024 + 1))).status).toBe(413);
    expect(
      (await POST(request("x".repeat(256 * 1024 + 1)))).status,
    ).toBe(413);
    expect(stripe.webhooks.constructEvent).not.toHaveBeenCalled();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each([
    [
      "refund.created",
      { payment_intent: "pi_paid", status: "pending", amount: 499 },
    ],
    [
      "refund.updated",
      { payment_intent: "pi_paid", status: "succeeded", amount: 499 },
    ],
    [
      "refund.failed",
      { payment_intent: "pi_paid", status: "failed", amount: 499 },
    ],
    [
      "charge.refunded",
      {
        payment_intent: "pi_paid",
        refunded: false,
        amount_refunded: 100,
      },
    ],
  ])(
    "acknowledges signed %s events and duplicates without mutating entitlement state",
    async (type, object) => {
      stripe.webhooks.constructEvent.mockReturnValue({
        id: "evt_refund",
        type,
        data: { object },
      });

      expect((await POST(request())).status).toBe(200);
      expect((await POST(request())).status).toBe(200);
      expect(stripe.paymentIntents.retrieve).not.toHaveBeenCalled();
      expect(stripe.paymentIntents.update).not.toHaveBeenCalled();
      expect(redis.command).not.toHaveBeenCalled();
    },
  );
});
