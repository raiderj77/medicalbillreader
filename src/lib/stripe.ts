import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

export const PRICES = {
  perUse: {
    amount: 499,
    currency: "usd",
    label: "$4.99 per bill",
  },
  monthly: {
    amount: 4900,
    currency: "usd",
    label: "$49/month, up to 44 bills",
  },
} as const;

export type PurchaseType = "per-use" | "subscription";

export function stripePriceId(type: PurchaseType): string {
  const value =
    type === "per-use"
      ? process.env.STRIPE_PRICE_PER_USE
      : process.env.STRIPE_PRICE_MONTHLY;
  if (!value?.startsWith("price_")) {
    throw new Error(`Stripe price is not configured for ${type}`);
  }
  return value;
}

export async function verifiedStripePriceId(
  type: PurchaseType,
): Promise<string> {
  const id = stripePriceId(type);
  const price = await getStripe().prices.retrieve(id);
  const expected = type === "per-use" ? PRICES.perUse : PRICES.monthly;
  const recurringIsValid =
    type === "per-use"
      ? price.recurring === null
      : price.recurring?.interval === "month" &&
        price.recurring.interval_count === 1;
  if (
    !price.active ||
    price.unit_amount !== expected.amount ||
    price.currency !== expected.currency ||
    !recurringIsValid
  ) {
    throw new Error(`Stripe price mapping is invalid for ${type}`);
  }
  return id;
}

// This is the published product limit and is enforced server-side. Revisit it
// whenever the model, token limit, Stripe price, or observed unit cost changes;
// do not rely on a hard-coded margin estimate in source comments.
export const SUBSCRIPTION_MONTHLY_CAP = 44;
