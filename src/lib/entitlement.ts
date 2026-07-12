import { getStripe } from "./stripe";
import type Stripe from "stripe";
import type { NextRequest } from "next/server";
import { redisCommand } from "./redis";
import {
  currentMonth,
  opaqueHash,
  randomToken,
  verifySignedValue,
} from "./security";
import { SUBSCRIPTION_MONTHLY_CAP } from "./stripe";

const RESERVE_SCRIPT = `redis.call('ZREMRANGEBYSCORE',KEYS[2],'-inf',ARGV[3]) local used=tonumber(redis.call('HGET',KEYS[1],'used') or '0') local reserved=redis.call('ZCARD',KEYS[2]) if used+reserved>=tonumber(ARGV[1]) then return 0 end redis.call('ZADD',KEYS[2],ARGV[4],ARGV[2]) if tonumber(ARGV[5])>0 then redis.call('EXPIRE',KEYS[1],ARGV[5]) end redis.call('EXPIRE',KEYS[2],600) return 1`;
const COMMIT_SCRIPT = `if redis.call('ZREM',KEYS[2],ARGV[1])==0 then return 0 end redis.call('HINCRBY',KEYS[1],'used',1) return 1`;
const RELEASE_SCRIPT = `return redis.call('ZREM',KEYS[2],ARGV[1])`;

export type EntitlementReservation = {
  kind: "paid" | "subscription" | "free";
  key: string;
  reservationId: string;
  externalId?: string;
};
async function reserve(
  key: string,
  cap: number,
  kind: EntitlementReservation["kind"],
  externalId?: string,
  usageTtl = 60 * 60 * 24 * 40,
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
  return accepted === 1 ? { kind, key, reservationId, externalId } : null;
}

export async function reserveRequestEntitlement(
  request: NextRequest,
): Promise<EntitlementReservation | null> {
  const paid = request.cookies.get("mbr_pending_use")?.value;
  if (paid) {
    if (!(await checkPerUseSessionAvailable(paid))) return null;
    return reserve(`mbr:paid:${opaqueHash(paid)}`, 1, "paid", paid, 0);
  }
  const subscription = request.cookies.get("mbr_sub_id")?.value;
  if (subscription) {
    if (!(await verifyActiveSubscription(subscription))) return null;
    return reserve(
      `mbr:sub:${opaqueHash(subscription)}:${currentMonth()}`,
      SUBSCRIPTION_MONTHLY_CAP,
      "subscription",
      subscription,
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
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.latest_charge"],
    });

    if (
      session.mode !== "payment" ||
      session.payment_status !== "paid" ||
      session.metadata?.mbr_entitlement !== "per_use" ||
      session.amount_total !== 499 ||
      session.currency !== "usd"
    ) {
      return false;
    }

    const paymentIntent = session.payment_intent as
      Stripe.PaymentIntent | string | null;

    if (!paymentIntent || typeof paymentIntent === "string") {
      return false;
    }

    const latestCharge = paymentIntent.latest_charge;
    const refunded =
      typeof latestCharge === "object" && latestCharge !== null
        ? latestCharge.refunded
        : false;
    return (
      paymentIntent.status === "succeeded" &&
      paymentIntent.amount_received === 499 &&
      paymentIntent.currency === "usd" &&
      paymentIntent.metadata?.mbr_entitlement === "per_use" &&
      paymentIntent.metadata?.used !== "true" &&
      paymentIntent.metadata?.refunded !== "true" &&
      !refunded
    );
  } catch (err) {
    console.error("checkPerUseSessionAvailable error:", err);
    return false;
  }
}

// Marks a pay-per-use session as consumed. Only call this after an analysis
// has actually succeeded, so a transient failure (e.g. the AI call erroring
// out) does not burn the customer's paid credit.
export async function consumePerUseSession(sessionId: string): Promise<void> {
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
  } catch (err) {
    console.error("consumePerUseSession error:", err);
  }
}

// Confirms a subscription is still active. Called on every analysis so a
// cancelled or past-due subscription stops working immediately, no local
// record of billing status is kept anywhere.
export async function verifyActiveSubscription(
  subscriptionId: string,
): Promise<boolean> {
  const stripe = getStripe();
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return (
      subscription.metadata?.mbr_entitlement === "subscription" &&
      (subscription.status === "active" || subscription.status === "trialing")
    );
  } catch (err) {
    console.error("verifyActiveSubscription error:", err);
    return false;
  }
}

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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
  const stripe = getStripe();
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const usageMonth = subscription.metadata?.usage_month;
    const usageCount =
      usageMonth === currentMonthKey()
        ? parseInt(subscription.metadata?.usage_count || "0", 10)
        : 0;
    return usageCount < monthlyCap;
  } catch (err) {
    console.error("checkSubscriptionCapAvailable error:", err);
    return false;
  }
}

// Marks one analysis as used against the subscriber's monthly cap. Only
// call this after an analysis has actually succeeded, matching the
// per-use session's consume-after-success behavior.
export async function incrementSubscriptionUsage(
  subscriptionId: string,
): Promise<void> {
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
  } catch (err) {
    console.error("incrementSubscriptionUsage error:", err);
  }
}

// Called right after Stripe redirects back from Checkout. Determines what
// kind of purchase just happened, purely by asking Stripe, so we know which
// cookie to set.
export async function classifyCompletedCheckout(
  sessionId: string,
): Promise<
  { type: "per-use" } | { type: "subscription"; subscriptionId: string } | null
> {
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (
      session.mode === "payment" &&
      session.payment_status === "paid" &&
      session.metadata?.mbr_entitlement === "per_use" &&
      session.amount_total === 499 &&
      session.currency === "usd"
    ) {
      return { type: "per-use" };
    }

    if (
      session.mode === "subscription" &&
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
  } catch (err) {
    console.error("classifyCompletedCheckout error:", err);
    return null;
  }
}
