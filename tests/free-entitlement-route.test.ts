import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: vi.fn().mockResolvedValue(true) }));
import { POST } from "@/app/api/entitlement/free/route";
import { verifySignedValue } from "@/lib/security";

describe("server-issued free entitlement", () => {
  afterEach(() => vi.unstubAllEnvs());

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


  it("does not issue free access when single analysis is disabled", async () => {
    vi.stubEnv("ENABLE_SINGLE_ANALYSIS", "false");
    const response = await POST(
      new NextRequest("https://medicalbillreader.com/api/entitlement/free", {
        method: "POST",
      }),
    );
    expect(response.status).toBe(503);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
