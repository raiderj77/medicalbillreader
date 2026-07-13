import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const gpc = request.headers.get('sec-gpc') === '1'
  if (gpc) {
    // empire_gpc is readable by the first-party privacy control so it can honor
    // the browser signal after navigation.
    // httpOnly: false is intentional ,  the consent banner JS must read this value.
    response.cookies.set('empire_gpc', '1', {
      httpOnly: false,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    })
  }
  return response
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
