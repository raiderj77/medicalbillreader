import { getStripe, PRICES, SUBSCRIPTION_MONTHLY_CAP } from "./stripe";
import type Stripe from "stripe";
import type { NextRequest } from "next/server";
import { redisCommand } from "./redis";
import {
  currentMonth,
  opaqueHash,
  randomToken,
  safeSecurityLog,
  verifySignedValue,
} from "./security";
import { isStripeId } from "./stripe-identifiers";
import {
  browserBindingFromRequest,
  openStripeAccess,
  validCheckoutNonceHash,
} from "./stripe-browser-access";

const RESERVE_SCRIPT = `redis.call('ZREMRANGEBYSCORE',KEYS[2],'-inf',ARGV[3]) local used=tonumber(redis.call('HGET',KEYS[1],'used') or '0') local reserved=redis.call('ZCARD',KEYS[2]) if used+reserved>=tonumber(ARGV[1]) then return 0 end redis.call('ZADD',KEYS[2],ARGV[4],ARGV[2]) redis.call('HSETNX',KEYS[1],'used',0) if tonumber(ARGV[5])>0 then redis.call('EXPIRE',KEYS[1],ARGV[5]) end redis.call('EXPIRE',KEYS[2],600) return 1`;
const COMMIT_SCRIPT = `if redis.call('ZREM',KEYS[2],ARGV[1])==0 then return 0 end redis.call('HINCRBY',KEYS[1],'used',1) return 1`;
const RELEASE_SCRIPT = `return redis.call('ZREM',KEYS[2],ARGV[1])`;
const PAID_REPLAY_TTL_SECONDS = 60 * 60 * 24 * 370;

export class EntitlementTemporarilyUnavailableError extends Error {
  constructor() {
    super("Entitlement verification is temporarily unavailable");
    this.name = "EntitlementTemporarilyUnavailableError";
  }
}

async function hasAvailablePerUsePayment(
  session: Stripe.Checkout.Session,
  stripe: ReturnType<typeof getStripe>,
): Promise<boolean> {
  const validSession =
    session.mode === "payment" &&
    session.payment_status === "paid" &&
    session.metadata?.mbr_entitlement === "per_use" &&
    session.amount_total === PRICES.perUse.amount &&
    session.currency === PRICES.perUse.currency;
  if (!validSession) return false;

  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") {
    throw new EntitlementTemporarilyUnavailableError();
  }

  const validPayment =
    paymentIntent.status === "succeeded" &&
    paymentIntent.amount_received === PRICES.perUse.amount &&
    paymentIntent.currency === PRICES.perUse.currency &&
    paymentIntent.metadata?.mbr_entitlement === "per_use" &&
    paymentIntent.metadata?.used !== "true";
  if (!validPayment) return false;

  const latestCharge = paymentIntent.latest_charge;
  if (!latestCharge || typeof latestCharge === "string") {
    throw new EntitlementTemporarilyUnavailableError();
  }
  if (
    typeof latestCharge.id !== "string" ||
    !latestCharge.id.startsWith("ch_") ||
    typeof latestCharge.refunded !== "boolean"
  ) {
    throw new EntitlementTemporarilyUnavailableError();
  }

  // Derive access from current Refund objects rather than webhook delivery or
  // mutable metadata. A completed full refund revokes access; a full refund
  // still in flight freezes access; terminal failures restore access only
  // after the Charge also reports that it is not fully refunded.
  let successfullyRefunded = 0;
  let inFlightRefund = 0;
  for await (const refund of stripe.refunds.list({
    charge: latestCharge.id,
    limit: 100,
  })) {
    if (!Number.isSafeInteger(refund.amount) || refund.amount <= 0) {
      throw new EntitlementTemporarilyUnavailableError();
    }
    if (refund.status === "succeeded") {
      successfullyRefunded += refund.amount;
      if (successfullyRefunded >= PRICES.perUse.amount) return false;
      continue;
    }
    if (
      refund.status === "pending" ||
      refund.status === "requires_action"
    ) {
      inFlightRefund += refund.amount;
      continue;
    }
    if (
      refund.status !== "failed" &&
      refund.status !== "canceled"
    ) {
      throw new EntitlementTemporarilyUnavailableError();
    }
  }
  if (successfullyRefunded + inFlightRefund >= PRICES.perUse.amount) {
    throw new EntitlementTemporarilyUnavailableError();
  }
  if (
    latestCharge.refunded &&
    successfullyRefunded < PRICES.perUse.amount
  ) {
    // The aggregate Charge and its current Refund objects disagree. Do not
    // grant or permanently revoke access until Stripe returns a coherent view.
    throw new EntitlementTemporarilyUnavailableError();
  }
  return true;
}

export type EntitlementReservation = {
  kind: "paid" | "subscription" | "free";
  key: string;
  reservationId: string;
  externalId?: string;
  accessToken?: string;
  browserBinding?: string;
};
async function reserve(
  key: string,
  cap: number,
  kind: EntitlementReservation["kind"],
  externalId?: string,
  usageTtl = 60 * 60 * 24 * 40,
  accessToken?: string,
  browserBinding?: string,
): Promise<EntitlementReservation | null> {
  const reservationId = randomToken();
  const now = Date.now();
  const accepted = await redisCommand<number>([
    "EVAL",
    RESERVE_SCRIPT,
    2,
    key,
    `${key}:reservations`,
    cap,
    reservationId,
    now,
    now + 2 * 60 * 1000,
    usageTtl,
  ]);
  return accepted === 1
    ? { kind, key, reservationId, externalId, accessToken, browserBinding }
    : null;
}

export async function reserveRequestEntitlement(
  request: NextRequest,
): Promise<EntitlementReservation | null> {
  const browserBinding = browserBindingFromRequest(request);
  const paidToken = request.cookies.get("mbr_pending_use")?.value;
  const paid =
    browserBinding && paidToken
      ? openStripeAccess(paidToken, "per-use", browserBinding)
      : null;
  if (
    paid &&
    (await checkPerUseSessionAvailable(paid))
  ) {
    const paidReservation = await reserve(
      `mbr:paid:${opaqueHash(paid)}`,
      1,
      "paid",
      paid,
      PAID_REPLAY_TTL_SECONDS,
      paidToken,
      browserBinding || undefined,
    );
    if (paidReservation) return paidReservation;
  }
  const subscriptionToken = request.cookies.get("mbr_sub_id")?.value;
  const subscription =
    browserBinding && subscriptionToken
      ? openStripeAccess(subscriptionToken, "subscription", browserBinding)
      : null;
  if (
    subscription &&
    (await verifyActiveSubscription(subscription))
  ) {
    // An active subscription keeps priority over the free allowance, including
    // when its monthly cap is exhausted. Inactive or stale subscription cookies
    // fall through so they cannot mask an otherwise valid free entitlement.
    return reserve(
      `mbr:sub:${opaqueHash(subscription)}:${currentMonth()}`,
      SUBSCRIPTION_MONTHLY_CAP,
      "subscription",
      subscription,
      60 * 60 * 24 * 40,
      subscriptionToken,
      browserBinding || undefined,
    );
  }
  const signedFree = request.cookies.get("mbr_free_entitlement")?.value;
  if (!signedFree) return null;
  const free = verifySignedValue(signedFree);
  if (!free) return null;
  const [token, month] = free.split(":");
  if (!token || month !== currentMonth()) return null;
  return reserve(`mbr:free:${opaqueHash(token)}:${month}`, 1, "free");
}

export async function commitEntitlement(
  reservation: EntitlementReservation,
): Promise<boolean> {
  const committed = await redisCommand<number>([
    "EVAL",
    COMMIT_SCRIPT,
    2,
    reservation.key,
    `${reservation.key}:reservations`,
    reservation.reservationId,
  ]);
  if (committed === 1 && reservation.kind === "paid" && reservation.externalId)
    await consumePerUseSession(reservation.externalId);
  if (
    committed === 1 &&
    reservation.kind === "subscription" &&
    reservation.externalId
  )
    await incrementSubscriptionUsage(reservation.externalId);
  return committed === 1;
}
export async function releaseEntitlement(
  reservation: EntitlementReservation,
): Promise<void> {
  await redisCommand<number>([
    "EVAL",
    RELEASE_SCRIPT,
    2,
    reservation.key,
    `${reservation.key}:reservations`,
    reservation.reservationId,
  ]);
}

// Checks that a pay-per-use Checkout Session was actually paid and has not
// already been consumed, WITHOUT consuming it. Called before we spend any
// Anthropic tokens. Stripe's own metadata is the only state we store, there
// is no local database.
export async function checkPerUseSessionAvailable(
  sessionId: string,
): Promise<boolean> {
  if (!isStripeId(sessionId, "cs_")) return false;
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge"],
    });

    return await hasAvailablePerUsePayment(session, stripe);
  } catch (error) {
    safeSecurityLog("stripe_per_use_check_failed");
    if (error instanceof EntitlementTemporarilyUnavailableError) throw error;
    throw new EntitlementTemporarilyUnavailableError();
  }
}

// Marks a pay-per-use session as consumed. Only call this after an analysis
// has actually succeeded, so a transient failure (e.g. the AI call erroring
// out) does not burn the customer's paid credit.
export async function consumePerUseSession(sessionId: string): Promise<void> {
  if (!isStripeId(sessionId, "cs_")) return;
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
    const paymentIntent = session.payment_intent as
      Stripe.PaymentIntent | string | null;

    if (paymentIntent && typeof paymentIntent !== "string") {
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: { ...paymentIntent.metadata, used: "true" },
      });
    }
  } catch {
    safeSecurityLog("stripe_per_use_consume_failed");
  }
}

// Confirms a subscription is still active. Called on every analysis so a
// cancelled or past-due subscription stops working immediately, no local
// record of billing status is kept anywhere.
export async function verifyActiveSubscription(
  subscriptionId: string,
): Promise<boolean> {
  if (!isStripeId(subscriptionId, "sub_")) return false;
  const stripe = getStripe();
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return (
      subscription.metadata?.mbr_entitlement === "subscription" &&
      (subscription.status === "active" || subscription.status === "trialing")
    );
  } catch {
    safeSecurityLog("stripe_subscription_check_failed");
    return false;
  }
}

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Checks whether an active subscriber still has analyses left in their
// monthly cap, WITHOUT consuming one. The count lives in the subscription's
// own Stripe metadata (usage_month / usage_count), reset on the calendar
// month rather than the exact billing-cycle anchor day, so this doesn't
// depend on Stripe API version specifics for period boundaries. Still no
// local database, Stripe is the only place this number is stored.
export async function checkSubscriptionCapAvailable(
  subscriptionId: string,
  monthlyCap: number,
): Promise<boolean> {
  if (!isStripeId(subscriptionId, "sub_")) return false;
  const stripe = getStripe();
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const usageMonth = subscription.metadata?.usage_month;
    const usageCount =
      usageMonth === currentMonthKey()
        ? parseInt(subscription.metadata?.usage_count || "0", 10)
        : 0;
    return usageCount < monthlyCap;
  } catch {
    safeSecurityLog("stripe_subscription_cap_check_failed");
    return false;
  }
}

// Marks one analysis as used against the subscriber's monthly cap. Only
// call this after an analysis has actually succeeded, matching the
// per-use session's consume-after-success behavior.
export async function incrementSubscriptionUsage(
  subscriptionId: string,
): Promise<void> {
  if (!isStripeId(subscriptionId, "sub_")) return;
  const stripe = getStripe();
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const month = currentMonthKey();
    const usageCount =
      subscription.metadata?.usage_month === month
        ? parseInt(subscription.metadata?.usage_count || "0", 10)
        : 0;

    await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        ...subscription.metadata,
        usage_month: month,
        usage_count: String(usageCount + 1),
      },
    });
  } catch {
    safeSecurityLog("stripe_subscription_usage_update_failed");
  }
}

// Called right after Stripe redirects back from Checkout. Determines what
// kind of purchase just happened, purely by asking Stripe, so we know which
// cookie to set.
export async function classifyCompletedCheckout(
  sessionId: string,
  checkoutNonce: string,
  expectedPurchaseType: "per-use" | "subscription",
): Promise<
  | { type: "per-use" }
  | { type: "subscription"; subscriptionId: string }
  | { type: "unavailable" }
  | null
> {
  if (
    !isStripeId(sessionId, "cs_") ||
    !validCheckoutNonceHash(checkoutNonce)
  ) {
    return null;
  }
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge"],
    });

    if (
      expectedPurchaseType === "per-use" &&
      session.metadata?.mbr_checkout_nonce === checkoutNonce &&
      (await hasAvailablePerUsePayment(session, stripe))
    ) {
      return { type: "per-use" };
    }

    if (
      session.mode === "subscription" &&
      expectedPurchaseType === "subscription" &&
      session.metadata?.mbr_entitlement === "subscription" &&
      session.metadata?.mbr_checkout_nonce === checkoutNonce &&
      typeof session.subscription === "string"
    ) {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription,
      );
      if (
        subscription.metadata?.mbr_entitlement === "subscription" &&
        (subscription.status === "active" || subscription.status === "trialing")
      ) {
        return { type: "subscription", subscriptionId: subscription.id };
      }
    }

    return null;
  } catch {
    safeSecurityLog("stripe_checkout_classification_failed");
    return { type: "unavailable" };
  }
}
