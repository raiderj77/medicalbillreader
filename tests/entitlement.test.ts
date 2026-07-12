import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const redis = vi.hoisted(() => ({ command: vi.fn() }));
const stripe = vi.hoisted(() => ({
  checkout: { sessions: { retrieve: vi.fn() } },
  paymentIntents: { retrieve: vi.fn(), update: vi.fn() },
  subscriptions: { retrieve: vi.fn(), update: vi.fn() },
}));
vi.mock("@/lib/redis", () => ({ redisCommand: redis.command }));
vi.mock("@/lib/stripe", () => ({
  getStripe: () => stripe,
  SUBSCRIPTION_MONTHLY_CAP: 2,
}));
import {
  classifyCompletedCheckout,
  reserveRequestEntitlement,
} from "@/lib/entitlement";
import { currentMonth, signValue } from "@/lib/security";

function paidRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: { cookie: "mbr_pending_use=cs_paid" },
  });
}
function subscriptionRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: { cookie: "mbr_sub_id=sub_active" },
  });
}
function freeRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie: `mbr_free_entitlement=${signValue(`anonymous:${currentMonth()}`)}`,
    },
  });
}

describe("atomic entitlement reservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stripe.checkout.sessions.retrieve.mockResolvedValue({
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: { mbr_entitlement: "per_use" },
      payment_intent: {
        id: "pi_1",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { refunded: false },
        metadata: { mbr_entitlement: "per_use" },
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValue({
      id: "sub_active",
      status: "active",
      metadata: { mbr_entitlement: "subscription" },
    });
  });

  it("does not allow a paid entitlement to be reserved twice", async () => {
    redis.command.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    expect(await reserveRequestEntitlement(paidRequest())).not.toBeNull();
    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();
  });

  it("allows only one of two simultaneous reservations", async () => {
    let claimed = false;
    redis.command.mockImplementation(async () => {
      if (claimed) return 0;
      claimed = true;
      return 1;
    });
    const results = await Promise.all([
      reserveRequestEntitlement(paidRequest()),
      reserveRequestEntitlement(paidRequest()),
    ]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("enforces subscription usage caps atomically", async () => {
    redis.command
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);
    expect(
      await reserveRequestEntitlement(subscriptionRequest()),
    ).not.toBeNull();
    expect(
      await reserveRequestEntitlement(subscriptionRequest()),
    ).not.toBeNull();
    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
  });

  it("enforces one anonymous free analysis per monthly cookie", async () => {
    redis.command.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    expect(await reserveRequestEntitlement(freeRequest())).not.toBeNull();
    expect(await reserveRequestEntitlement(freeRequest())).toBeNull();
  });

  it("rejects unpaid, expired, or refunded checkout sessions", async () => {
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "unpaid",
      status: "expired",
    });
    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();

    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: { mbr_entitlement: "per_use" },
      payment_intent: {
        id: "pi_refunded",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { refunded: true },
        metadata: { mbr_entitlement: "per_use" },
      },
    });
    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("rejects unrelated payments and cancelled subscriptions", async () => {
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "paid",
      amount_total: 100,
      currency: "usd",
      metadata: {},
      payment_intent: {
        id: "pi_other",
        status: "succeeded",
        amount_received: 100,
        currency: "usd",
        metadata: {},
      },
    });
    expect(await classifyCompletedCheckout("cs_other")).toBeNull();

    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      subscription: "sub_cancelled",
      metadata: { mbr_entitlement: "subscription" },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_cancelled",
      status: "canceled",
      metadata: { mbr_entitlement: "subscription" },
    });
    expect(await classifyCompletedCheckout("cs_cancelled")).toBeNull();
  });
});
