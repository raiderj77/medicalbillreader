import { beforeEach, describe, expect, it, vi } from "vitest";
import { getStripe, verifiedStripePriceId } from "@/lib/stripe";

describe("Stripe price mapping validation", () => {
  beforeEach(() => {
    process.env.STRIPE_SECRET_KEY = "sk_test_configured";
    process.env.STRIPE_PRICE_PER_USE = "price_single";
    process.env.STRIPE_PRICE_MONTHLY = "price_monthly";
    vi.restoreAllMocks();
  });

  it("accepts the active $4.99 one-time price", async () => {
    vi.spyOn(getStripe().prices, "retrieve").mockResolvedValue({
      id: "price_single",
      active: true,
      unit_amount: 499,
      currency: "usd",
      recurring: null,
    } as never);
    await expect(verifiedStripePriceId("per-use")).resolves.toBe(
      "price_single",
    );
  });

  it("accepts the active $49 monthly price", async () => {
    vi.spyOn(getStripe().prices, "retrieve").mockResolvedValue({
      id: "price_monthly",
      active: true,
      unit_amount: 4900,
      currency: "usd",
      recurring: { interval: "month" },
    } as never);
    await expect(verifiedStripePriceId("subscription")).resolves.toBe(
      "price_monthly",
    );
  });

  it("fails closed when a configured price has the wrong amount", async () => {
    vi.spyOn(getStripe().prices, "retrieve").mockResolvedValue({
      id: "price_single",
      active: true,
      unit_amount: 999,
      currency: "usd",
      recurring: null,
    } as never);
    await expect(verifiedStripePriceId("per-use")).rejects.toThrow(
      "Stripe price mapping is invalid",
    );
  });
});
