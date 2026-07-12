import { NextRequest, NextResponse } from "next/server";
import { recordAnalysis } from "@/lib/analysis-stats";
import { BILL_ANALYSIS_INSTRUCTIONS, buildBillAnalysisPrompt } from "@/lib/bill-analysis-prompt";
import { commitEntitlement, releaseEntitlement, reserveRequestEntitlement, type EntitlementReservation } from "@/lib/entitlement";
import { enforceRateLimit } from "@/lib/rate-limit";
import { StoreUnavailableError } from "@/lib/redis";
import { clientIp, safeSecurityLog } from "@/lib/security";
import { readLimitedJson, UploadValidationError, validateUpload } from "@/lib/upload-validation";

export const maxDuration = 30;
export const runtime = "nodejs";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  let reservation: EntitlementReservation | null = null;
  try {
    if (!(await enforceRateLimit("analyze-ip", clientIp(request.headers), 10, 60))) return errorResponse("Too many analysis requests. Please wait and try again.", 429);

    reservation = await reserveRequestEntitlement(request);
    if (!reservation) return errorResponse("A valid analysis entitlement is required.", 401);

    if (!(await enforceRateLimit("analyze-entitlement", reservation.key, 3, 60))) {
      await releaseEntitlement(reservation);
      reservation = null;
      return errorResponse("This analysis entitlement is being used too quickly. Please wait and try again.", 429);
    }

    const upload = validateUpload(await readLimitedJson(request));
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("anthropic_not_configured");
    const fileContent = upload.mediaType === "application/pdf"
      ? { type: "document", source: { type: "base64", media_type: upload.mediaType, data: upload.data } }
      : { type: "image", source: { type: "base64", media_type: upload.mediaType, data: upload.data } };

    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-beta": "pdfs-2024-09-25" },
      body: JSON.stringify({ model: "claude-opus-4-20250514", max_tokens: 2000, temperature: 0, messages: [{ role: "user", content: [{ type: "text", text: BILL_ANALYSIS_INSTRUCTIONS, cache_control: { type: "ephemeral" } }, { type: "text", text: buildBillAnalysisPrompt() }, fileContent] }] }),
    });

    if (!aiResponse.ok) {
      const failure = (await aiResponse.json().catch(() => null)) as { error?: { type?: string } } | null;
      const category = failure?.error?.type?.replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "unknown";
      safeSecurityLog(`anthropic_request_failed_${aiResponse.status}_${category}`);
      await releaseEntitlement(reservation); reservation = null;
      return errorResponse("The analysis service could not process this file. Your paid credit was not used.", 502);
    }
    const data = (await aiResponse.json()) as { content?: Array<{ text?: string }> };
    const result = data.content?.[0]?.text;
    if (!result) {
      await releaseEntitlement(reservation); reservation = null;
      return errorResponse("The analysis service returned an incomplete response. Your paid credit was not used.", 502);
    }
    if (!(await commitEntitlement(reservation))) return errorResponse("The analysis could not be finalized safely. Please contact support.", 503);
    const kind = reservation.kind; reservation = null;
    recordAnalysis({ fileType: upload.mediaType });
    const response = NextResponse.json({ result }, { headers: { "Cache-Control": "no-store" } });
    if (kind === "paid") response.cookies.set("mbr_pending_use", "", { maxAge: 0, path: "/" });
    return response;
  } catch (error) {
    if (reservation) { try { await releaseEntitlement(reservation); } catch { safeSecurityLog("entitlement_release_failed"); } }
    if (error instanceof UploadValidationError) return errorResponse(error.message, 400);
    if (error instanceof StoreUnavailableError) return errorResponse("Analysis access is temporarily unavailable.", 503);
    safeSecurityLog("analysis_route_failed");
    return errorResponse("The analysis could not be completed. Your paid credit was not used.", 500);
  }
}
