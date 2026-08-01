import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const gpc = request.headers.get("sec-gpc") === "1";

  if (gpc) {
    // The first-party privacy control must be able to read this value after
    // navigation so a browser GPC signal always overrides a saved preference.
    response.cookies.set("empire_gpc", "1", {
      httpOnly: false,
      sameSite: "lax",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
