import { NextRequest, NextResponse } from "next/server";
import { recordAnalysis } from "@/lib/analysis-stats";
import {
  BILL_ANALYSIS_INSTRUCTIONS,
  buildBillAnalysisPrompt,
} from "@/lib/bill-analysis-prompt";
import {
  checkPerUseSessionAvailable,
  consumePerUseSession,
  verifyActiveSubscription,
  checkSubscriptionCapAvailable,
  incrementSubscriptionUsage,
} from "@/lib/entitlement";
import { SUBSCRIPTION_MONTHLY_CAP } from "@/lib/stripe";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    // Entitlement check. Paid analyses are verified against Stripe directly,
    // there is no local database of purchases or subscribers. Requests with
    // neither cookie fall through unchanged (the existing client-side free
    // tier gate). The per-use session is only checked (not consumed) here,
    // it's marked used after the analysis actually succeeds below, so a
    // transient failure doesn't burn the customer's paid credit.
    const pendingUseSessionId = req.cookies.get("mbr_pending_use")?.value;
    const subscriptionId = req.cookies.get("mbr_sub_id")?.value;

    if (pendingUseSessionId) {
      const available = await checkPerUseSessionAvailable(pendingUseSessionId);
      if (!available) {
        return NextResponse.json(
          {
            error:
              "This payment could not be verified or has already been used. Please purchase a new analysis.",
          },
          { status: 402 }
        );
      }
    } else if (subscriptionId) {
      const active = await verifyActiveSubscription(subscriptionId);
      if (!active) {
        return NextResponse.json(
          {
            error:
              "Your subscription is not active. Please check your billing or resubscribe.",
          },
          { status: 402 }
        );
      }
      const withinCap = await checkSubscriptionCapAvailable(
        subscriptionId,
        SUBSCRIPTION_MONTHLY_CAP
      );
      if (!withinCap) {
        return NextResponse.json(
          {
            error: `You've used all ${SUBSCRIPTION_MONTHLY_CAP} analyses included in your plan this month. Your limit resets next calendar month, or you can purchase a one-time analysis for $4.99 in the meantime.`,
          },
          { status: 402 }
        );
      }
    }

    const { image, fileType } = await req.json();
    if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

    const base64Data = image.split(",")[1];
    const isPDF = fileType === "application/pdf";

    const fileContent = isPDF
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64Data } }
      : { type: "image", source: { type: "base64", media_type: fileType || "image/jpeg", data: base64Data } };

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
      },
      body: JSON.stringify({
        model: "claude-opus-4-7",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: BILL_ANALYSIS_INSTRUCTIONS,
                cache_control: { type: "ephemeral" },
              },
              { type: "text", text: buildBillAnalysisPrompt() },
              fileContent,
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Anthropic API error:", err?.error?.type || "unknown");
      return NextResponse.json({ error: "Failed to analyze bill." }, { status: 500 });
    }

    const data = await response.json();
    const resultText = data.content?.[0]?.text || "Unable to analyze.";
    try {
      recordAnalysis({ fileType: fileType || "unknown", resultText });
    } catch {}

    if (pendingUseSessionId) {
      // Only mark the session consumed now that the analysis actually
      // succeeded.
      await consumePerUseSession(pendingUseSessionId);
    } else if (subscriptionId) {
      await incrementSubscriptionUsage(subscriptionId);
    }

    const jsonResponse = NextResponse.json({ result: resultText });
    if (pendingUseSessionId) {
      // Clear the cookie so this session can't be replayed against another
      // request.
      jsonResponse.cookies.set("mbr_pending_use", "", { maxAge: 0, path: "/" });
    }
    return jsonResponse;
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
