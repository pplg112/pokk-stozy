import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "pokky_admin_token";
const SECRET_TOKEN = "pokky_admin_session_pgm2551dd";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin, excluding /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token || token !== SECRET_TOKEN) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
