import { NextRequest, NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { StoreUnavailableError } from "@/lib/redis";
import { clientIp, currentMonth, randomToken, signValue, verifySignedValue } from "@/lib/security";

export async function POST(request: NextRequest) {
  try {
    const existing = request.cookies.get("mbr_free_entitlement")?.value;
    if (existing && verifySignedValue(existing)?.endsWith(`:${currentMonth()}`)) return NextResponse.json({ ready: true });
    const allowed = await enforceRateLimit("free-issue-v2", `${clientIp(request.headers)}:${currentMonth()}`, 20, 60 * 60 * 24 * 32);
    if (!allowed) return NextResponse.json({ error: "Free access could not be issued from this network right now." }, { status: 429 });
    const response = NextResponse.json({ ready: true });
    response.cookies.set("mbr_free_entitlement", signValue(`${randomToken()}:${currentMonth()}`), { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 40 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof StoreUnavailableError ? "Analysis access is temporarily unavailable." : "Free access could not be issued." }, { status: 503 });
  }
}
