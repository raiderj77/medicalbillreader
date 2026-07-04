import { getStripe } from "./stripe";
import type Stripe from "stripe";

// Checks that a pay-per-use Checkout Session was actually paid and has not
// already been consumed, WITHOUT consuming it. Called before we spend any
// Anthropic tokens. Stripe's own metadata is the only state we store, there
// is no local database.
export async function checkPerUseSessionAvailable(
  sessionId: string
): Promise<boolean> {
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.mode !== "payment" || session.payment_status !== "paid") {
      return false;
    }

    const paymentIntent = session.payment_intent as
      | Stripe.PaymentIntent
      | string
      | null;

    if (!paymentIntent || typeof paymentIntent === "string") {
      return false;
    }

    return paymentIntent.metadata?.used !== "true";
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
      | Stripe.PaymentIntent
      | string
      | null;

    if (paymentIntent && typeof paymentIntent !== "string") {
      await stripe.paymentIntents.update(paymentIntent.id, {
        metadata: { used: "true" },
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
  subscriptionId: string
): Promise<boolean> {
  const stripe = getStripe();
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription.status === "active" || subscription.status === "trialing";
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
  monthlyCap: number
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
  subscriptionId: string
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
  sessionId: string
): Promise<
  { type: "per-use" } | { type: "subscription"; subscriptionId: string } | null
> {
  const stripe = getStripe();
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode === "payment" && session.payment_status === "paid") {
      return { type: "per-use" };
    }

    if (session.mode === "subscription" && typeof session.subscription === "string") {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      if (subscription.status === "active" || subscription.status === "trialing") {
        return { type: "subscription", subscriptionId: subscription.id };
      }
    }

    return null;
  } catch (err) {
    console.error("classifyCompletedCheckout error:", err);
    return null;
  }
}
