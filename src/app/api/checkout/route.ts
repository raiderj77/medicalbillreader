import { NextRequest, NextResponse } from "next/server";

const NO_STORE = { "Cache-Control": "no-store" };

export function POST(request: NextRequest) {
  void request;
  return NextResponse.json(
    {
      error:
        "New paid checkout is temporarily unavailable while we verify payment setup. No payment was started.",
    },
    { status: 503, headers: NO_STORE },
  );
}
