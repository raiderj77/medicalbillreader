import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const redis = vi.hoisted(() => ({ command: vi.fn() }));
const stripe = vi.hoisted(() => ({
  checkout: { sessions: { retrieve: vi.fn() } },
  paymentIntents: { update: vi.fn() },
  subscriptions: { retrieve: vi.fn(), update: vi.fn() },
}));
vi.mock("@/lib/redis", () => ({ redisCommand: redis.command }));
vi.mock("@/lib/stripe", () => ({ getStripe: () => stripe, SUBSCRIPTION_MONTHLY_CAP: 2 }));
import { reserveRequestEntitlement } from "@/lib/entitlement";
import { currentMonth, signValue } from "@/lib/security";

function paidRequest() { return new NextRequest("https://example.com/api/analyze", { headers: { cookie: "mbr_pending_use=cs_paid" } }); }
function subscriptionRequest() { return new NextRequest("https://example.com/api/analyze", { headers: { cookie: "mbr_sub_id=sub_active" } }); }
function freeRequest() { return new NextRequest("https://example.com/api/analyze", { headers: { cookie: `mbr_free_entitlement=${signValue(`anonymous:${currentMonth()}`)}` } }); }

describe("atomic entitlement reservations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    stripe.checkout.sessions.retrieve.mockResolvedValue({ mode: "payment", payment_status: "paid", payment_intent: { id: "pi_1", metadata: {} } });
    stripe.subscriptions.retrieve.mockResolvedValue({ id: "sub_active", status: "active", metadata: {} });
  });

  it("does not allow a paid entitlement to be reserved twice", async () => {
    redis.command.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    expect(await reserveRequestEntitlement(paidRequest())).not.toBeNull();
    expect(await reserveRequestEntitlement(paidRequest())).toBeNull();
  });

  it("allows only one of two simultaneous reservations", async () => {
    let claimed = false;
    redis.command.mockImplementation(async () => { if (claimed) return 0; claimed = true; return 1; });
    const results = await Promise.all([reserveRequestEntitlement(paidRequest()), reserveRequestEntitlement(paidRequest())]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("enforces subscription usage caps atomically", async () => {
    redis.command.mockResolvedValueOnce(1).mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    expect(await reserveRequestEntitlement(subscriptionRequest())).not.toBeNull();
    expect(await reserveRequestEntitlement(subscriptionRequest())).not.toBeNull();
    expect(await reserveRequestEntitlement(subscriptionRequest())).toBeNull();
  });

  it("enforces one anonymous free analysis per monthly cookie", async () => {
    redis.command.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    expect(await reserveRequestEntitlement(freeRequest())).not.toBeNull();
    expect(await reserveRequestEntitlement(freeRequest())).toBeNull();
  });
});
