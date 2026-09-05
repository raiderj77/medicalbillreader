import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const stripe = vi.hoisted(() => ({
  checkout: { sessions: { create: vi.fn() } },
}));
const prices = vi.hoisted(() => ({ priceId: vi.fn() }));
const rateLimit = vi.hoisted(() => ({ enforce: vi.fn() }));
const browserAccess = vi.hoisted(() => ({
  fromRequest: vi.fn(),
  createBinding: vi.fn(),
  createNonce: vi.fn(),
  discardNonce: vi.fn(),
  nonceHash: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  getStripe: () => stripe,
  verifiedStripePriceId: prices.priceId,
}));
vi.mock("@/lib/rate-limit", () => ({
  enforceRateLimit: rateLimit.enforce,
}));
vi.mock("@/lib/stripe-browser-access", () => ({
  browserBindingFromRequest: browserAccess.fromRequest,
  createBrowserBinding: browserAccess.createBinding,
  createCheckoutNonce: browserAccess.createNonce,
  discardCheckoutNonce: browserAccess.discardNonce,
  checkoutNonceHash: browserAccess.nonceHash,
}));

import { POST } from "@/app/api/checkout/route";

const MESSAGE =
  "New paid checkout is temporarily unavailable while we verify payment setup. No payment was started.";

function request(body: string, contentLength?: number) {
  return new NextRequest("https://medicalbillreader.com/api/checkout", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(contentLength ? { "content-length": String(contentLength) } : {}),
    },
    body,
  });
}

async function expectUnavailable(response: Response) {
  expect(response.status).toBe(503);
  expect(response.headers.get("cache-control")).toBe("no-store");
  expect(response.headers.get("location")).toBeNull();
  expect(response.headers.get("set-cookie")).toBeNull();
  expect(await response.json()).toEqual({ error: MESSAGE });
}

function expectNoCheckoutWork() {
  expect(rateLimit.enforce).not.toHaveBeenCalled();
  expect(browserAccess.fromRequest).not.toHaveBeenCalled();
  expect(browserAccess.createBinding).not.toHaveBeenCalled();
  expect(browserAccess.createNonce).not.toHaveBeenCalled();
  expect(browserAccess.discardNonce).not.toHaveBeenCalled();
  expect(browserAccess.nonceHash).not.toHaveBeenCalled();
  expect(prices.priceId).not.toHaveBeenCalled();
  expect(stripe.checkout.sessions.create).not.toHaveBeenCalled();
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ["single-analysis", JSON.stringify({ priceType: "per-use" })],
    ["monthly", JSON.stringify({ priceType: "subscription" })],
    ["unknown", JSON.stringify({ priceType: "free" })],
    ["malformed", "not-json"],
    ["oversized", JSON.stringify({ value: "x".repeat(2_000) })],
  ])("fails closed for %s requests without starting checkout", async (_name, body) => {
    await expectUnavailable(await POST(request(body, body.length)));
    expectNoCheckoutWork();
  });

  it("does not inspect the request before returning the unavailable response", async () => {
    const poisonRequest = new Proxy({} as NextRequest, {
      get() {
        throw new Error("checkout request was inspected");
      },
    });

    await expectUnavailable(POST(poisonRequest));
    expectNoCheckoutWork();
  });
});
