import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const entitlement = vi.hoisted(() => ({ reserve: vi.fn(), commit: vi.fn(), release: vi.fn() }));
vi.mock("@/lib/entitlement", () => ({ reserveRequestEntitlement: entitlement.reserve, commitEntitlement: entitlement.commit, releaseEntitlement: entitlement.release }));
vi.mock("@/lib/rate-limit", () => ({ enforceRateLimit: vi.fn().mockResolvedValue(true) }));
vi.mock("@/lib/analysis-stats", () => ({ recordAnalysis: vi.fn() }));
import { POST } from "@/app/api/analyze/route";

const validBody = { image: "data:image/png;base64,iVBORw0KGgo=", fileType: "image/png" };
const reservation = { kind: "paid" as const, key: "paid:key", reservationId: "reservation", externalId: "cs_paid" };
function request(body: unknown, cookie?: string, headers?: Record<string, string>) {
  return new NextRequest("https://medicalbillreader.com/api/analyze", { method: "POST", headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}), ...headers }, body: JSON.stringify(body) });
}

describe("POST /api/analyze abuse and entitlement controls", () => {
  beforeEach(() => { vi.clearAllMocks(); entitlement.commit.mockResolvedValue(true); entitlement.release.mockResolvedValue(undefined); });

  it("rejects direct and client-side bypass calls without a server entitlement before AI", async () => {
    entitlement.reserve.mockResolvedValue(null);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request({ ...validBody, freeTierRemaining: 1 }, "medical_bill_reader_usage=fake"));
    expect(response.status).toBe(401);
    expect(ai).not.toHaveBeenCalled();
  });

  it.each([
    [{ image: "data:text/plain;base64,SGVsbG8=", fileType: "text/plain" }, "unsupported"],
    [{ image: "data:image/png;base64,%%%", fileType: "image/png" }, "malformed"],
  ])("rejects %s uploads before AI", async (body) => {
    entitlement.reserve.mockResolvedValue(reservation);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request(body));
    expect(response.status).toBe(400);
    expect(ai).not.toHaveBeenCalled();
    expect(entitlement.release).toHaveBeenCalledOnce();
  });

  it("rejects oversized request bodies before AI", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const ai = vi.spyOn(globalThis, "fetch");
    const response = await POST(request(validBody, undefined, { "content-length": String(15 * 1024 * 1024) }));
    expect(response.status).toBe(400);
    expect(ai).not.toHaveBeenCalled();
  });

  it("releases rather than consumes paid credit when AI fails", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 500 }));
    const response = await POST(request(validBody));
    expect(response.status).toBe(502);
    expect(entitlement.release).toHaveBeenCalledWith(reservation);
    expect(entitlement.commit).not.toHaveBeenCalled();
  });

  it("never writes bill content or model output to logs", async () => {
    entitlement.reserve.mockResolvedValue(reservation);
    const secretBillText = "PATIENT-JANE-SECRET-BASE64";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ error: secretBillText }), { status: 500 }));
    const logger = vi.spyOn(console, "error").mockImplementation(() => undefined);
    await POST(request(validBody));
    expect(JSON.stringify(logger.mock.calls)).not.toContain(secretBillText);
    expect(JSON.stringify(logger.mock.calls)).not.toContain(validBody.image);
  });
});
