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

// $4.99 per-use and $49/month unlimited mirror ContractExtract's pricing for
// brand consistency. A medical bill analysis costs a few cents in Anthropic
// API usage (Opus 4.7, short bill image plus a cached instructions block,
// well under $0.10 even uncached), so both tiers clear the 75-90% margin
// target comfortably even before caching discounts.
export const PRICES = {
  perUse: {
    amount: 499,
    currency: "usd",
    label: "$4.99 per bill",
  },
  monthly: {
    amount: 4900,
    currency: "usd",
    label: "$49/month unlimited",
  },
} as const;
