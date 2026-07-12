import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const entitlement = vi.hoisted(() => ({ classify: vi.fn() }));
vi.mock("@/lib/entitlement", () => ({
  classifyCompletedCheckout: entitlement.classify,
}));

import { GET } from "@/app/api/checkout/confirm/route";

describe("GET /api/checkout/confirm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("never grants an entitlement for a missing, failed, or cancelled session", async () => {
    entitlement.classify.mockResolvedValue(null);
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_unpaid",
      ),
    );
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://medicalbillreader.com/pricing?payment=error",
    );
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("sets a secure HttpOnly one-use cookie only after server verification", async () => {
    entitlement.classify.mockResolvedValue({ type: "per-use" });
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_paid",
      ),
    );
    const cookie = response.headers.get("set-cookie") || "";
    expect(cookie).toContain("mbr_pending_use=cs_paid");
    expect(cookie.toLowerCase()).toContain("httponly");
    expect(cookie.toLowerCase()).toContain("secure");
  });

  it("sets subscription authorization from the verified Stripe subscription", async () => {
    entitlement.classify.mockResolvedValue({
      type: "subscription",
      subscriptionId: "sub_verified",
    });
    const response = await GET(
      new NextRequest(
        "https://medicalbillreader.com/api/checkout/confirm?session_id=cs_sub",
      ),
    );
    expect(response.headers.get("set-cookie")).toContain(
      "mbr_sub_id=sub_verified",
    );
  });
});
