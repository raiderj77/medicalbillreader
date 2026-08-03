import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const redis = vi.hoisted(() => ({ command: vi.fn() }));
vi.mock("@/lib/redis", () => ({ redisCommand: redis.command }));

import {
  BROWSER_BINDING_COOKIE,
  browserBindingCookieValue,
  browserBindingFromRequest,
  checkoutNoncePurchaseType,
  completeCheckoutNonce,
  createBrowserBinding,
  createCheckoutNonce,
  openStripeAccess,
  sealStripeAccess,
} from "@/lib/stripe-browser-access";

describe("browser-bound Stripe access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts only an untampered signed browser binding", () => {
    const issued = createBrowserBinding();
    const valid = new NextRequest("https://medicalbillreader.com", {
      headers: {
        cookie: `${BROWSER_BINDING_COOKIE}=${issued.cookieValue}`,
      },
    });
    const tampered = new NextRequest("https://medicalbillreader.com", {
      headers: {
        cookie: `${BROWSER_BINDING_COOKIE}=${issued.cookieValue}x`,
      },
    });

    expect(browserBindingFromRequest(valid)).toBe(issued.binding);
    expect(browserBindingFromRequest(tampered)).toBeNull();
    expect(browserBindingCookieValue(issued.binding)).toBe(issued.cookieValue);
  });

  it("seals Stripe IDs into opaque authenticated tokens bound to one browser", () => {
    const firstBrowser = createBrowserBinding().binding;
    const otherBrowser = createBrowserBinding().binding;
    const token = sealStripeAccess(
      "subscription",
      "sub_verified",
      firstBrowser,
      3_600,
    );

    expect(token).not.toContain("sub_verified");
    expect(openStripeAccess(token, "subscription", firstBrowser)).toBe(
      "sub_verified",
    );
    expect(openStripeAccess(token, "subscription", otherBrowser)).toBeNull();
    expect(openStripeAccess(token, "per-use", firstBrowser)).toBeNull();
    expect(openStripeAccess(`${token.slice(0, -1)}x`, "subscription", firstBrowser)).toBeNull();
    expect(openStripeAccess("sub_verified", "subscription", firstBrowser)).toBeNull();
  });

  it("rejects an expired opaque entitlement even if its cookie was retained", () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-08-02T00:00:00Z"));
      const browser = createBrowserBinding().binding;
      const token = sealStripeAccess("per-use", "cs_paid", browser, 60);

      vi.setSystemTime(new Date("2026-08-02T00:01:01Z"));
      expect(openStripeAccess(token, "per-use", browser)).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("retains checkout state beyond Stripe's 24-hour default and safely reissues a completed return", async () => {
    let stored: string | null = null;
    redis.command.mockImplementation(async (command: unknown[]) => {
      if (command[0] === "SET") {
        stored = String(command[2]);
        return "OK";
      }
      if (command[0] === "GET") return stored;
      if (command[0] === "EVAL") {
        const pendingValue = String(command[4]);
        const completedValue = String(command[5]);
        if (stored === pendingValue) {
          stored = completedValue;
          return 1;
        }
        if (stored === completedValue) return 2;
        return 0;
      }
      return null;
    });

    const originatingBrowser = createBrowserBinding().binding;
    const otherBrowser = createBrowserBinding().binding;
    const nonce = await createCheckoutNonce(
      originatingBrowser,
      "subscription",
    );

    const setCommand = redis.command.mock.calls[0][0] as unknown[];
    expect(setCommand.slice(-2)).toEqual(["EX", 60 * 60 * 25]);
    expect(
      await checkoutNoncePurchaseType(
        nonce,
        originatingBrowser,
        "cs_paid",
      ),
    ).toBe("subscription");
    expect(
      await checkoutNoncePurchaseType(nonce, otherBrowser, "cs_paid"),
    ).toBeNull();

    expect(
      await completeCheckoutNonce(
        nonce,
        otherBrowser,
        "cs_paid",
        "subscription",
      ),
    ).toBe(false);
    expect(
      await completeCheckoutNonce(
        nonce,
        originatingBrowser,
        "cs_paid",
        "subscription",
      ),
    ).toBe(true);
    expect(stored).not.toContain("cs_paid");
    expect(
      await checkoutNoncePurchaseType(
        nonce,
        originatingBrowser,
        "cs_paid",
      ),
    ).toBe("subscription");
    expect(
      await checkoutNoncePurchaseType(
        nonce,
        originatingBrowser,
        "cs_other",
      ),
    ).toBeNull();
    expect(
      await completeCheckoutNonce(
        nonce,
        originatingBrowser,
        "cs_paid",
        "subscription",
      ),
    ).toBe(true);
    expect(
      await completeCheckoutNonce(
        nonce,
        originatingBrowser,
        "cs_other",
        "subscription",
      ),
    ).toBe(false);
    expect(stored).not.toBeNull();
  });

  it("rejects invalid values before accessing Redis", async () => {
    expect(
      await checkoutNoncePurchaseType(
        "not-a-nonce",
        createBrowserBinding().binding,
        "cs_paid",
      ),
    ).toBeNull();
    expect(
      await completeCheckoutNonce(
        "not-a-nonce",
        createBrowserBinding().binding,
        "cs_paid",
        "per-use",
      ),
    ).toBe(false);
    expect(redis.command).not.toHaveBeenCalled();
    expect(() => browserBindingCookieValue("invalid")).toThrow(
      "Invalid browser binding",
    );
  });
});
