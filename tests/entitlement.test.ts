import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const redis = vi.hoisted(() => ({ command: vi.fn() }));
const stripe = vi.hoisted(() => ({
  checkout: { sessions: { retrieve: vi.fn() } },
  paymentIntents: { retrieve: vi.fn(), update: vi.fn() },
  subscriptions: { retrieve: vi.fn(), update: vi.fn() },
}));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  open: vi.fn(),
}));
vi.mock("@/lib/redis", () => ({ redisCommand: redis.command }));
vi.mock("@/lib/stripe", () => ({
  getStripe: () => stripe,
  SUBSCRIPTION_MONTHLY_CAP: 2,
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  browserBindingFromRequest: browserAccess.fromRequest,
  openStripeAccess: browserAccess.open,
  validCheckoutNonceHash: (value: string) => /^[a-f0-9]{64}$/.test(value),
}));
import {
  classifyCompletedCheckout,
  reserveRequestEntitlement,
} from "@/lib/entitlement";
import { currentMonth, signValue } from "@/lib/security";

function paidRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie:
        "mbr_browser_binding=browser-binding; mbr_pending_use=paid-token",
    },
  });
}
function subscriptionRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie:
        "mbr_browser_binding=browser-binding; mbr_sub_id=subscription-token",
    },
  });
}
function freeRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie: `mbr_free_entitlement=${signValue(`anonymous:${currentMonth()}`)}`,
    },
  });
}
function subscriptionAndFreeRequest(subscriptionToken = "subscription-token") {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie: [
        "mbr_browser_binding=browser-binding",
        `mbr_sub_id=${subscriptionToken}`,
        `mbr_free_entitlement=${signValue(`anonymous:${currentMonth()}`)}`,
      ].join("; "),
    },
  });
}
function paidAndSubscriptionRequest() {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie:
        "mbr_browser_binding=browser-binding; mbr_pending_use=stale-paid-token; mbr_sub_id=subscription-token",
    },
  });
}
function paidAndFreeRequest(paid = "stale-paid-token") {
  return new NextRequest("https://example.com/api/analyze", {
    headers: {
      cookie: [
        "mbr_browser_binding=browser-binding",
        `mbr_pending_use=${paid}`,
        `mbr_free_entitlement=${signValue(`anonymous:${currentMonth()}`)}`,
      ].join("; "),
    },
  });
}

describe("atomic entitlement reservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    browserAccess.fromRequest.mockImplementation(
      (request: NextRequest) =>
        request.cookies.get("mbr_browser_binding")?.value || null,
    );
    browserAccess.open.mockImplementation((token: string, kind: string) => {
      if (kind === "per-use") {
        if (token === "paid-token") return "cs_paid";
        if (token === "stale-paid-token") return "cs_stale";
      }
      if (kind === "subscription" && token === "subscription-token") {
        return "sub_active";
      }
      return null;
    });
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

  it("creates the usage hash before applying its retention TTL", async () => {
    redis.command.mockResolvedValueOnce(1);

    expect(await reserveRequestEntitlement(freeRequest())).not.toBeNull();

    const evalArgs = redis.command.mock.calls[0][0] as unknown[];
    const script = String(evalArgs[1]);
    const createIndex = script.indexOf(
      "redis.call('HSETNX',KEYS[1],'used',0)",
    );
    const expireIndex = script.indexOf(
      "redis.call('EXPIRE',KEYS[1],ARGV[5])",
    );
    expect(createIndex).toBeGreaterThan(-1);
    expect(expireIndex).toBeGreaterThan(createIndex);
    expect(evalArgs.at(-1)).toBe(60 * 60 * 24 * 40);
  });

  it("falls back to a valid free entitlement when a stale subscription is inactive", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_active",
      status: "canceled",
      metadata: { mbr_entitlement: "subscription" },
    });
    redis.command.mockResolvedValueOnce(1);

    const reservation = await reserveRequestEntitlement(
      subscriptionAndFreeRequest(),
    );

    expect(reservation).toMatchObject({ kind: "free" });
    expect(reservation?.key).toContain("mbr:free:");
  });

  it("keeps an active subscription ahead of a simultaneous free entitlement", async () => {
    redis.command.mockResolvedValueOnce(1);

    const reservation = await reserveRequestEntitlement(
      subscriptionAndFreeRequest(),
    );

    expect(reservation).toMatchObject({
      kind: "subscription",
      externalId: "sub_active",
    });
    expect(reservation?.key).toContain("mbr:sub:");
  });

  it("falls through from an already-used paid cookie to a valid subscription", async () => {
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: { mbr_entitlement: "per_use" },
      payment_intent: {
        id: "pi_used",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { refunded: false },
        metadata: { mbr_entitlement: "per_use", used: "true" },
      },
    });
    redis.command.mockResolvedValueOnce(1);

    const reservation = await reserveRequestEntitlement(
      paidAndSubscriptionRequest(),
    );

    expect(reservation).toMatchObject({
      kind: "subscription",
      externalId: "sub_active",
    });
  });

  it("falls through from a malformed paid cookie to a valid free entitlement", async () => {
    redis.command.mockResolvedValueOnce(1);

    const reservation = await reserveRequestEntitlement(
      paidAndFreeRequest("not-a-checkout-session"),
    );

    expect(reservation).toMatchObject({ kind: "free" });
    expect(stripe.checkout.sessions.retrieve).not.toHaveBeenCalled();
  });

  it("does not bypass an active subscription cap with the free entitlement", async () => {
    redis.command.mockResolvedValueOnce(0);

    expect(
      await reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).toBeNull();
    expect(redis.command).toHaveBeenCalledOnce();
  });

  it("classifies only a checkout tied to the expected one-use nonce", async () => {
    const expectedNonce = "a".repeat(64);
    const paidSession = {
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: {
        mbr_entitlement: "per_use",
        mbr_checkout_nonce: expectedNonce,
      },
    };
    stripe.checkout.sessions.retrieve
      .mockResolvedValueOnce(paidSession)
      .mockResolvedValueOnce({
        ...paidSession,
        metadata: {
          ...paidSession.metadata,
          mbr_checkout_nonce: "b".repeat(64),
        },
      });

    expect(
      await classifyCompletedCheckout(
        "cs_expected",
        expectedNonce,
        "per-use",
      ),
    ).toEqual({ type: "per-use" });
    expect(
      await classifyCompletedCheckout(
        "cs_mismatch",
        expectedNonce,
        "per-use",
      ),
    ).toBeNull();
  });

  it("distinguishes a transient Stripe failure from an invalid checkout", async () => {
    stripe.checkout.sessions.retrieve.mockRejectedValueOnce(
      new Error("stripe unavailable"),
    );

    expect(
      await classifyCompletedCheckout(
        "cs_retryable",
        "a".repeat(64),
        "per-use",
      ),
    ).toEqual({ type: "unavailable" });
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
    expect(
      await classifyCompletedCheckout("cs_other", "a".repeat(64), "per-use"),
    ).toBeNull();

    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      subscription: "sub_cancelled",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: "a".repeat(64),
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_cancelled",
      status: "canceled",
      metadata: { mbr_entitlement: "subscription" },
    });
    expect(
      await classifyCompletedCheckout(
        "cs_cancelled",
        "a".repeat(64),
        "subscription",
      ),
    ).toBeNull();
  });
});
