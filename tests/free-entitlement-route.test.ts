import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: vi.fn().mockResolvedValue(true) }));
import { POST } from "@/app/api/entitlement/free/route";
import { verifySignedValue } from "@/lib/security";

describe("server-issued free entitlement", () => {
  it("issues a signed Secure HttpOnly cookie without medical or account data", async () => {
    const response = await POST(new NextRequest("https://medicalbillreader.com/api/entitlement/free", { method: "POST", headers: { "x-forwarded-for": "203.0.113.1" } }));
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("mbr_free_entitlement=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=strict");
    const encoded = setCookie.match(/mbr_free_entitlement=([^;]+)/)?.[1];
    expect(encoded && verifySignedValue(decodeURIComponent(encoded))).toMatch(/^[A-Za-z0-9_-]+:\d{4}-\d{2}$/);
  });
});
