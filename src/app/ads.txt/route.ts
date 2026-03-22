import { NextResponse } from "next/server";

export async function GET() {
  const body = `google.com, pub-7171402107622932, DIRECT, f08c47fec0942fa0
OWNERDOMAIN=medicalbillreader.com
MANAGERDOMAIN=medicalbillreader.com
`;
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
