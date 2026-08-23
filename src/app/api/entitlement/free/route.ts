import { NextRequest, NextResponse } from "next/server";
import { getProductConfig } from "@/config/product";
import { enforceRateLimit } from "@/lib/rate-limit";
import { StoreUnavailableError } from "@/lib/redis";
import { clientIp, currentMonth, randomToken, signValue, verifySignedValue } from "@/lib/security";

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export async function POST(request: NextRequest) {
  try {
    if (!getProductConfig().features.singleAnalysis)
      return json({ error: "Single-document analysis is not available." }, 503);

    const existing = request.cookies.get("mbr_free_entitlement")?.value;
    if (existing && verifySignedValue(existing)?.endsWith(`:${currentMonth()}`)) return json({ ready: true });
    const allowed = await enforceRateLimit("free-issue-v2", `${clientIp(request.headers)}:${currentMonth()}`, 20, 60 * 60 * 24 * 32);
    if (!allowed) return json({ error: "Free access could not be issued from this network right now." }, 429);
    const response = json({ ready: true });
    response.cookies.set("mbr_free_entitlement", signValue(`${randomToken()}:${currentMonth()}`), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 40 });
    return response;
  } catch (error) {
    return json({ error: error instanceof StoreUnavailableError ? "Analysis access is temporarily unavailable." : "Free access could not be issued." }, 503);
  }
}
