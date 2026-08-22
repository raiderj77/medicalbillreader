import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const redis = vi.hoisted(() => ({ command: vi.fn() }));
const stripe = vi.hoisted(() => ({
  checkout: { sessions: { retrieve: vi.fn() } },
  invoicePayments: { list: vi.fn() },
  paymentIntents: { retrieve: vi.fn(), update: vi.fn() },
  refunds: { list: vi.fn() },
  subscriptions: { retrieve: vi.fn(), update: vi.fn() },
}));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  open: vi.fn(),
}));
vi.mock("@/lib/redis", () => ({ redisCommand: redis.command }));
vi.mock("@/lib/stripe", () => ({
  getStripe: () => stripe,
  PRICES: {
    perUse: { amount: 499, currency: "usd", label: "$4.99 per bill" },
    monthly: { amount: 4900, currency: "usd", label: "$49/month" },
  },
  stripePriceId: (type: string) =>
    type === "subscription" ? "price_monthly" : "price_per_use",
  SUBSCRIPTION_MONTHLY_CAP: 2,
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  browserBindingFromRequest: browserAccess.fromRequest,
  openStripeAccess: browserAccess.open,
  validCheckoutNonceHash: (value: string) => /^[a-f0-9]{64}$/.test(value),
}));
import {
  classifyCompletedCheckout,
  EntitlementTemporarilyUnavailableError,
  reserveRequestEntitlement,
} from "@/lib/entitlement";
import { currentMonth, signValue } from "@/lib/security";

function refundList(
  ...refunds: Array<{ id: string; amount: number; status: string | null }>
) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const refund of refunds) yield refund;
    },
  };
}

function stripeList<T>(...items: T[]) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const item of items) yield item;
    },
  };
}

function activeSubscription(
  overrides: Record<string, unknown> = {},
) {
  const now = Math.floor(Date.now() / 1000);
  const periodStart = now - 60 * 60;
  const periodEnd = now + 60 * 60 * 24 * 29;
  return {
    id: "sub_active",
    status: "active",
    pause_collection: null,
    collection_method: "charge_automatically",
    currency: "usd",
    metadata: { mbr_entitlement: "subscription" },
    items: {
      has_more: false,
      data: [
        {
          id: "si_monthly",
          subscription: "sub_active",
          quantity: 1,
          current_period_start: periodStart,
          current_period_end: periodEnd,
          price: {
            id: "price_monthly",
            currency: "usd",
            unit_amount: 4900,
            recurring: { interval: "month", interval_count: 1 },
          },
        },
      ],
    },
    latest_invoice: {
      id: "in_current",
      status: "paid",
      billing_reason: "subscription_cycle",
      collection_method: "charge_automatically",
      currency: "usd",
      amount_due: 4900,
      amount_paid: 4900,
      amount_remaining: 0,
      amount_overpaid: 0,
      pre_payment_credit_notes_amount: 0,
      post_payment_credit_notes_amount: 0,
      total: 4900,
      parent: {
        type: "subscription_details",
        subscription_details: {
          subscription: "sub_active",
          metadata: { mbr_entitlement: "subscription" },
        },
      },
      lines: {
        has_more: false,
        data: [
          {
            id: "il_current",
            amount: 4900,
            currency: "usd",
            quantity: 1,
            period: { start: periodStart, end: periodEnd },
            parent: {
              type: "subscription_item_details",
              subscription_item_details: {
                proration: false,
                subscription: "sub_active",
                subscription_item: "si_monthly",
              },
            },
            pricing: {
              type: "price_details",
              price_details: { price: "price_monthly" },
            },
          },
        ],
      },
    },
    ...overrides,
  };
}

function paidSubscriptionInvoicePayment(
  overrides: Record<string, unknown> = {},
) {
  return {
    id: "inpay_current",
    status: "paid",
    invoice: "in_current",
    amount_paid: 4900,
    amount_requested: 4900,
    currency: "usd",
    is_default: true,
    payment: {
      type: "payment_intent",
      payment_intent: {
        id: "pi_subscription",
        status: "succeeded",
        amount: 4900,
        amount_received: 4900,
        currency: "usd",
        latest_charge: {
          id: "ch_subscription",
          payment_intent: "pi_subscription",
          paid: true,
          captured: true,
          disputed: false,
          amount: 4900,
          amount_captured: 4900,
          amount_refunded: 0,
          refunded: false,
          currency: "usd",
          payment_method_details: { type: "card" },
        },
      },
    },
    ...overrides,
  };
}

function subscriptionWithInvoice(overrides: Record<string, unknown>) {
  const subscription = activeSubscription();
  return {
    ...subscription,
    latest_invoice: {
      ...subscription.latest_invoice,
      ...overrides,
    },
  };
}

function invoicePaymentWithCharge(
  chargeOverrides: Record<string, unknown>,
) {
  const invoicePayment = paidSubscriptionInvoicePayment();
  const paymentIntent = invoicePayment.payment.payment_intent;
  return {
    ...invoicePayment,
    payment: {
      ...invoicePayment.payment,
      payment_intent: {
        ...paymentIntent,
        latest_charge: {
          ...paymentIntent.latest_charge,
          ...chargeOverrides,
        },
      },
    },
  };
}

function subscriptionRefund(
  status: string | null,
  amount = 4900,
) {
  return {
    id: `re_${status || "unknown"}`,
    amount,
    status,
    currency: "usd",
    charge: "ch_subscription",
    payment_intent: "pi_subscription",
  };
}

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
    stripe.refunds.list.mockReturnValue(refundList());
    stripe.invoicePayments.list.mockReturnValue(
      stripeList(paidSubscriptionInvoicePayment()),
    );
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
        latest_charge: { id: "ch_paid", refunded: false },
        metadata: { mbr_entitlement: "per_use" },
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValue(activeSubscription());
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

  it.each([
    "trialing",
    "past_due",
    "canceled",
    "unpaid",
    "paused",
    "incomplete_expired",
  ])("does not authorize a %s subscription for analysis", async (status) => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_active",
      status,
      metadata: { mbr_entitlement: "subscription" },
    });

    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
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

  it("keeps an active cancel-at-period-end subscription eligible through its paid period", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce(activeSubscription({
      cancel_at_period_end: true,
    }));
    redis.command.mockResolvedValueOnce(1);

    expect(await reserveRequestEntitlement(subscriptionRequest())).toMatchObject({
      kind: "subscription",
      externalId: "sub_active",
    });
  });

  it("does not authorize an active subscription without MBR metadata", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_active",
      status: "active",
      metadata: {},
    });

    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("does not authorize an active subscription with payment collection paused", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_active",
      status: "active",
      pause_collection: { behavior: "void", resumes_at: null },
      metadata: { mbr_entitlement: "subscription" },
    });

    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("keeps an incomplete subscription retryable without free fallback", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_active",
      status: "incomplete",
      metadata: { mbr_entitlement: "subscription" },
    });

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("freezes an unsupported send-invoice subscription", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce(
      activeSubscription({ collection_method: "send_invoice" }),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("freezes an unsupported configured subscription Price", async () => {
    const subscription = activeSubscription();
    subscription.items.data[0].price.id = "price_other";
    stripe.subscriptions.retrieve.mockResolvedValueOnce(subscription);

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("freezes a mismatched current subscription amount", async () => {
    const subscription = activeSubscription();
    subscription.items.data[0].price.unit_amount = 4800;
    stripe.subscriptions.retrieve.mockResolvedValueOnce(subscription);

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("treats a current-period boundary mismatch as temporarily unavailable", async () => {
    const subscription = activeSubscription();
    subscription.items.data[0].current_period_end =
      Math.floor(Date.now() / 1000) - 1;
    stripe.subscriptions.retrieve.mockResolvedValueOnce(subscription);

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("does not fall through to free access when Subscription retrieval fails", async () => {
    stripe.subscriptions.retrieve.mockRejectedValueOnce(
      new Error("synthetic Stripe outage"),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each(["open", "draft", null])(
    "temporarily freezes an active subscription while its current invoice is %s",
    async (status) => {
      stripe.subscriptions.retrieve.mockResolvedValueOnce(
        subscriptionWithInvoice({ status }),
      );

      await expect(
        reserveRequestEntitlement(subscriptionAndFreeRequest()),
      ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
      expect(redis.command).not.toHaveBeenCalled();
      expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
    },
  );

  it("treats a missing current invoice as temporarily unavailable", async () => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce(
      activeSubscription({ latest_invoice: null }),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each([
    "pre_payment_credit_notes_amount",
    "post_payment_credit_notes_amount",
  ])("freezes a current invoice with nonzero %s", async (field) => {
    stripe.subscriptions.retrieve.mockResolvedValueOnce(
      subscriptionWithInvoice({ [field]: 100 }),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each(["uncollectible", "void"])(
    "denies an active subscription whose current invoice is %s",
    async (status) => {
      stripe.subscriptions.retrieve.mockResolvedValueOnce(
        subscriptionWithInvoice({ status }),
      );

      expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
      expect(redis.command).not.toHaveBeenCalled();
    },
  );

  it("denies a fully refunded current subscription payment", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        invoicePaymentWithCharge({ refunded: true, amount_refunded: 4900 }),
      ),
    );
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(subscriptionRefund("succeeded")),
    );

    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("freezes a successful partial subscription refund for owner review", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(invoicePaymentWithCharge({ amount_refunded: 100 })),
    );
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(subscriptionRefund("succeeded", 100)),
    );
    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("denies multiple successful partial refunds that total the full payment", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        invoicePaymentWithCharge({ refunded: true, amount_refunded: 4900 }),
      ),
    );
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(
        subscriptionRefund("succeeded", 2000),
        subscriptionRefund("succeeded", 2900),
      ),
    );

    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("temporarily freezes a full subscription refund that is still pending", async () => {
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(subscriptionRefund("pending")),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each(["failed", "canceled"])(
    "keeps access after a terminal %s subscription refund",
    async (status) => {
      stripe.refunds.list.mockReturnValueOnce(
        stripeList(subscriptionRefund(status)),
      );
      redis.command.mockResolvedValueOnce(1);

      expect(await reserveRequestEntitlement(subscriptionRequest())).toMatchObject({
        kind: "subscription",
      });
    },
  );

  it("treats missing paid InvoicePayment state as temporarily unavailable", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(stripeList());

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("freezes an unsupported InvoicePayment payment-record shape", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        paidSubscriptionInvoicePayment({
          payment: {
            type: "payment_record",
            payment_record: "payrec_synthetic",
          },
        }),
      ),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.refunds.list).not.toHaveBeenCalled();
  });

  it("treats an unexpanded subscription PaymentIntent as retryable", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        paidSubscriptionInvoicePayment({
          payment: {
            type: "payment_intent",
            payment_intent: "pi_subscription",
          },
        }),
      ),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("treats an unexpanded subscription Charge as retryable", async () => {
    const invoicePayment = paidSubscriptionInvoicePayment();
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList({
        ...invoicePayment,
        payment: {
          ...invoicePayment.payment,
          payment_intent: {
            ...invoicePayment.payment.payment_intent,
            latest_charge: "ch_subscription",
          },
        },
      }),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("freezes multiple paid InvoicePayments for the unsupported fixed-card shape", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        paidSubscriptionInvoicePayment(),
        paidSubscriptionInvoicePayment({ id: "inpay_second" }),
      ),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.refunds.list).not.toHaveBeenCalled();
  });

  it("freezes a non-card subscription charge", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        invoicePaymentWithCharge({
          payment_method_details: { type: "us_bank_account" },
        }),
      ),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(stripe.refunds.list).not.toHaveBeenCalled();
  });

  it("denies an unsupported disputed subscription charge", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(invoicePaymentWithCharge({ disputed: true })),
    );

    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("treats a missing Charge dispute flag as temporarily unavailable", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(invoicePaymentWithCharge({ disputed: undefined })),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("fails temporarily closed when current subscription refund state is unavailable", async () => {
    stripe.refunds.list.mockImplementationOnce(() => ({
      async *[Symbol.asyncIterator]() {
        throw new Error("synthetic Stripe outage");
      },
    }));

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("fails temporarily closed for an unknown subscription refund status", async () => {
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(subscriptionRefund("unexpected")),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("fails temporarily closed when subscription Charge and Refund state disagree", async () => {
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(invoicePaymentWithCharge({ amount_refunded: 100 })),
    );

    await expect(
      reserveRequestEntitlement(subscriptionAndFreeRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
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
        latest_charge: { id: "ch_used", refunded: false },
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
      payment_intent: {
        id: "pi_expected",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { id: "ch_paid", refunded: false },
        metadata: { mbr_entitlement: "per_use" },
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
        latest_charge: { id: "ch_refunded", refunded: true },
        metadata: { mbr_entitlement: "per_use" },
      },
    });
    stripe.refunds.list.mockReturnValueOnce(
      refundList({ id: "re_refunded", amount: 499, status: "succeeded" }),
    );
    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("ignores stale refund metadata when Stripe shows no full refund", async () => {
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: { mbr_entitlement: "per_use" },
      payment_intent: {
        id: "pi_stale_marker",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { id: "ch_stale_marker", refunded: false },
        metadata: { mbr_entitlement: "per_use", refunded: "true" },
      },
    });
    redis.command.mockResolvedValueOnce(1);

    expect(await reserveRequestEntitlement(paidRequest())).toMatchObject({
      kind: "paid",
    });
    expect(stripe.refunds.list).toHaveBeenCalledWith({
      charge: "ch_stale_marker",
      limit: 100,
    });
  });

  it("keeps an unused analysis available after a successful partial refund", async () => {
    stripe.refunds.list.mockReturnValueOnce(
      refundList({ id: "re_partial", amount: 100, status: "succeeded" }),
    );
    redis.command.mockResolvedValueOnce(1);

    expect(await reserveRequestEntitlement(paidRequest())).toMatchObject({
      kind: "paid",
    });
  });

  it("freezes access when successful and pending refunds together cover the full payment", async () => {
    stripe.refunds.list.mockReturnValueOnce(
      refundList(
        { id: "re_partial", amount: 100, status: "succeeded" },
        { id: "re_pending", amount: 399, status: "pending" },
      ),
    );

    await expect(
      reserveRequestEntitlement(paidAndFreeRequest("paid-token")),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("denies multiple successful refunds that total the full payment", async () => {
    const expectedNonce = "a".repeat(64);
    const fullyRefundedSession = {
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: {
        mbr_entitlement: "per_use",
        mbr_checkout_nonce: expectedNonce,
      },
      payment_intent: {
        id: "pi_fully_refunded",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { id: "ch_fully_refunded", refunded: true },
        metadata: { mbr_entitlement: "per_use" },
      },
    };
    stripe.checkout.sessions.retrieve.mockResolvedValue(fullyRefundedSession);
    stripe.refunds.list
      .mockReturnValueOnce(
        refundList(
          { id: "re_first", amount: 200, status: "succeeded" },
          { id: "re_second", amount: 299, status: "succeeded" },
        ),
      )
      .mockReturnValueOnce(
        refundList({ id: "re_full", amount: 499, status: "succeeded" }),
      );

    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();
    expect(
      await classifyCompletedCheckout(
        "cs_refunded",
        expectedNonce,
        "per-use",
      ),
    ).toBeNull();
    expect(stripe.refunds.list).toHaveBeenCalledWith({
      charge: "ch_fully_refunded",
      limit: 100,
    });
  });

  it.each(["pending", "requires_action"])(
    "temporarily freezes an unused analysis for a %s full refund",
    async (status) => {
      stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
        mode: "payment",
        payment_status: "paid",
        amount_total: 499,
        currency: "usd",
        metadata: { mbr_entitlement: "per_use" },
        payment_intent: {
          id: `pi_${status}`,
          status: "succeeded",
          amount_received: 499,
          currency: "usd",
          latest_charge: { id: `ch_${status}`, refunded: false },
          metadata: { mbr_entitlement: "per_use" },
        },
      });
      stripe.refunds.list.mockReturnValueOnce(
        refundList({ id: `re_${status}`, amount: 499, status }),
      );

      await expect(
        reserveRequestEntitlement(paidAndFreeRequest("paid-token")),
      ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
      expect(redis.command).not.toHaveBeenCalled();
    },
  );

  it.each([null, "unexpected"])(
    "fails temporarily closed for an unknown refund status (%s)",
    async (status) => {
      stripe.refunds.list.mockReturnValueOnce(
        refundList({ id: "re_unknown", amount: 499, status }),
      );

      await expect(
        reserveRequestEntitlement(paidRequest()),
      ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
      expect(redis.command).not.toHaveBeenCalled();
    },
  );

  it("fails temporarily closed when Charge and Refund state disagree", async () => {
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: { mbr_entitlement: "per_use" },
      payment_intent: {
        id: "pi_incoherent",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { id: "ch_incoherent", refunded: true },
        metadata: { mbr_entitlement: "per_use" },
      },
    });

    await expect(
      reserveRequestEntitlement(paidRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("consumes auto-paginated refund results before deciding access", async () => {
    const firstPageEquivalent = Array.from({ length: 100 }, (_, index) => ({
      id: `re_cent_${index}`,
      amount: 1,
      status: "succeeded",
    }));
    stripe.refunds.list.mockReturnValueOnce(
      refundList(
        ...firstPageEquivalent,
        { id: "re_later_page", amount: 399, status: "succeeded" },
      ),
    );

    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each(["failed", "canceled"])(
    "restores an unused analysis after a %s full refund",
    async (status) => {
      stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
        mode: "payment",
        payment_status: "paid",
        amount_total: 499,
        currency: "usd",
        metadata: { mbr_entitlement: "per_use" },
        payment_intent: {
          id: `pi_${status}`,
          status: "succeeded",
          amount_received: 499,
          currency: "usd",
          latest_charge: { id: `ch_${status}`, refunded: false },
          metadata: { mbr_entitlement: "per_use" },
        },
      });
      stripe.refunds.list.mockReturnValueOnce(
        refundList({ id: `re_${status}`, amount: 499, status }),
      );
      redis.command.mockResolvedValueOnce(1);

      expect(await reserveRequestEntitlement(paidRequest())).toMatchObject({
        kind: "paid",
      });
    },
  );

  it("keeps access frozen until Charge agrees that a failed full refund did not complete", async () => {
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: { mbr_entitlement: "per_use" },
      payment_intent: {
        id: "pi_failed_incoherent",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { id: "ch_failed_incoherent", refunded: true },
        metadata: { mbr_entitlement: "per_use" },
      },
    });
    stripe.refunds.list.mockReturnValueOnce(
      refundList({ id: "re_failed", amount: 499, status: "failed" }),
    );

    await expect(
      reserveRequestEntitlement(paidRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(redis.command).not.toHaveBeenCalled();
  });

  it("fails closed when expanded charge or refund state is unavailable", async () => {
    const expectedNonce = "a".repeat(64);
    const unavailableRefundSession = {
      mode: "payment",
      payment_status: "paid",
      amount_total: 499,
      currency: "usd",
      metadata: {
        mbr_entitlement: "per_use",
        mbr_checkout_nonce: expectedNonce,
      },
      payment_intent: {
        id: "pi_unavailable_refunds",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: { id: "ch_unavailable_refunds", refunded: true },
        metadata: { mbr_entitlement: "per_use" },
      },
    };
    stripe.checkout.sessions.retrieve
      .mockResolvedValueOnce({
        ...unavailableRefundSession,
        payment_intent: {
          ...unavailableRefundSession.payment_intent,
          latest_charge: "ch_not_expanded",
        },
      })
      .mockResolvedValueOnce(unavailableRefundSession);
    stripe.refunds.list.mockImplementationOnce(() => {
      throw new Error("Stripe unavailable");
    });

    await expect(
      reserveRequestEntitlement(paidRequest()),
    ).rejects.toBeInstanceOf(EntitlementTemporarilyUnavailableError);
    expect(
      await classifyCompletedCheckout(
        "cs_unavailable",
        expectedNonce,
        "per-use",
      ),
    ).toEqual({ type: "unavailable" });
    expect(redis.command).not.toHaveBeenCalled();
  });

  it.each([
    ["PaymentIntent", "pi_not_expanded"],
    [
      "Charge",
      {
        id: "pi_charge_not_expanded",
        status: "succeeded",
        amount_received: 499,
        currency: "usd",
        latest_charge: "ch_not_expanded",
        metadata: { mbr_entitlement: "per_use" },
      },
    ],
  ])(
    "treats an unexpanded %s as retryable during checkout confirmation",
    async (_resource, paymentIntent) => {
      const expectedNonce = "a".repeat(64);
      stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
        mode: "payment",
        payment_status: "paid",
        amount_total: 499,
        currency: "usd",
        metadata: {
          mbr_entitlement: "per_use",
          mbr_checkout_nonce: expectedNonce,
        },
        payment_intent: paymentIntent,
      });

      expect(
        await classifyCompletedCheckout(
          "cs_unexpanded",
          expectedNonce,
          "per-use",
        ),
      ).toEqual({ type: "unavailable" });
      expect(stripe.refunds.list).not.toHaveBeenCalled();
    },
  );

  it("accepts only a paid Checkout session backed by an active MBR subscription", async () => {
    const nonce = "a".repeat(64);
    const checkoutSession = {
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_active",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    };
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce(checkoutSession);

    expect(
      await classifyCompletedCheckout("cs_subscription", nonce, "subscription"),
    ).toEqual({ type: "subscription", subscriptionId: "sub_active" });
    expect(stripe.subscriptions.retrieve).toHaveBeenCalledWith("sub_active", {
      expand: ["latest_invoice"],
    });
    expect(stripe.invoicePayments.list).toHaveBeenCalledWith({
      invoice: "in_current",
      status: "paid",
      limit: 100,
      expand: ["data.payment.payment_intent.latest_charge"],
    });

    for (const paymentStatus of ["unpaid", "no_payment_required"]) {
      stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
        ...checkoutSession,
        payment_status: paymentStatus,
      });
      expect(
        await classifyCompletedCheckout(
          "cs_subscription",
          nonce,
          "subscription",
        ),
      ).toBeNull();
    }
    expect(stripe.subscriptions.retrieve).toHaveBeenCalledTimes(1);
  });

  it("does not confirm a fully refunded subscription Checkout", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_active",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.invoicePayments.list.mockReturnValueOnce(
      stripeList(
        invoicePaymentWithCharge({ refunded: true, amount_refunded: 4900 }),
      ),
    );
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(subscriptionRefund("succeeded")),
    );

    expect(
      await classifyCompletedCheckout("cs_refunded", nonce, "subscription"),
    ).toBeNull();
  });

  it("keeps an in-flight subscription refund confirmation retryable", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_active",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.refunds.list.mockReturnValueOnce(
      stripeList(subscriptionRefund("requires_action")),
    );

    expect(
      await classifyCompletedCheckout("cs_pending", nonce, "subscription"),
    ).toEqual({ type: "unavailable" });
  });

  it("keeps a Checkout-to-current-invoice mismatch retryable", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_active",
      invoice: "in_checkout_other",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });

    expect(
      await classifyCompletedCheckout("cs_mismatch", nonce, "subscription"),
    ).toEqual({ type: "unavailable" });
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
  });

  it("keeps a paid subscription Checkout with no invoice retryable", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_active",
      invoice: null,
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });

    expect(
      await classifyCompletedCheckout("cs_no_invoice", nonce, "subscription"),
    ).toEqual({ type: "unavailable" });
    expect(stripe.subscriptions.retrieve).not.toHaveBeenCalled();
  });

  it("keeps a paid subscription Checkout retryable when Stripe returns no current invoice", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_active",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce(
      activeSubscription({ latest_invoice: null }),
    );

    expect(
      await classifyCompletedCheckout(
        "cs_missing_current_invoice",
        nonce,
        "subscription",
      ),
    ).toEqual({ type: "unavailable" });
    expect(stripe.invoicePayments.list).not.toHaveBeenCalled();
  });

  it.each([
    "trialing",
    "past_due",
    "canceled",
    "unpaid",
    "paused",
    "incomplete_expired",
  ])("does not confirm a %s subscription", async (status) => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_ineligible",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_ineligible",
      status,
      metadata: { mbr_entitlement: "subscription" },
    });

    expect(
      await classifyCompletedCheckout("cs_subscription", nonce, "subscription"),
    ).toBeNull();
  });

  it("does not confirm an active subscription without MBR metadata", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_unrelated",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_unrelated",
      status: "active",
      metadata: {},
    });

    expect(
      await classifyCompletedCheckout("cs_subscription", nonce, "subscription"),
    ).toBeNull();
  });

  it("keeps an incomplete subscription Checkout retryable", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_incomplete",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_incomplete",
      status: "incomplete",
      metadata: { mbr_entitlement: "subscription" },
    });

    expect(
      await classifyCompletedCheckout("cs_incomplete", nonce, "subscription"),
    ).toEqual({ type: "unavailable" });
  });

  it("does not confirm an active subscription with payment collection paused", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_paused_collection",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.subscriptions.retrieve.mockResolvedValueOnce({
      id: "sub_paused_collection",
      status: "active",
      pause_collection: { behavior: "keep_as_draft", resumes_at: null },
      metadata: { mbr_entitlement: "subscription" },
    });

    expect(
      await classifyCompletedCheckout("cs_subscription", nonce, "subscription"),
    ).toBeNull();
  });

  it("keeps subscription checkout confirmation retryable when Stripe verification fails", async () => {
    const nonce = "a".repeat(64);
    stripe.checkout.sessions.retrieve.mockResolvedValueOnce({
      mode: "subscription",
      payment_status: "paid",
      subscription: "sub_unavailable",
      invoice: "in_current",
      metadata: {
        mbr_entitlement: "subscription",
        mbr_checkout_nonce: nonce,
      },
    });
    stripe.subscriptions.retrieve.mockRejectedValueOnce(
      new Error("Stripe unavailable"),
    );

    expect(
      await classifyCompletedCheckout("cs_subscription", nonce, "subscription"),
    ).toEqual({ type: "unavailable" });
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
      payment_status: "paid",
      subscription: "sub_cancelled",
      invoice: "in_current",
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
