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

// Realistic worst-case per-analysis cost (Opus 4.7, a 30-page hospitalization
// itemized bill plus the cached instructions block at full price, max
// output) is about $0.11. 44/month keeps a genuine ~90% margin on the $49
// subscription even if every analysis that month hit that worst case,
// comfortably inside the 85-95% target instead of sitting right at the 85%
// floor.
export const SUBSCRIPTION_MONTHLY_CAP = 44;
