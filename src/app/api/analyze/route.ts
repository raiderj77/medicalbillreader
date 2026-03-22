import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
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
        model: "claude-opus-4-5",
        max_tokens: 2000,
        messages: [{ role: "user", content: [ fileContent, { type: "text", text: `You are a medical billing expert. Analyze this medical bill and explain it in plain English. Use these sections:\n\n## What This Bill Is For\n## Breakdown of Charges\n## What You Owe\n## ⚠️ Potential Issues to Review\n## What To Do Next` }]}],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("Anthropic API error:", JSON.stringify(err));
      return NextResponse.json({ error: "Failed to analyze bill." }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ result: data.content?.[0]?.text || "Unable to analyze." });
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
