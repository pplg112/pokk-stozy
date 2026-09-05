import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN } from "@/lib/auth";

const MALICIOUS_BOT_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /dirbuster/i,
  /nmap/i,
  /acunetix/i,
  /masscan/i,
  /wpscan/i,
  /hydra/i,
  /metasploit/i,
  /havij/i,
  /zgrab/i,
  /nessus/i,
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // 1. Block known hacking tools and vulnerability scanner bots
  if (userAgent && MALICIOUS_BOT_PATTERNS.some((pattern) => pattern.test(userAgent))) {
    return new NextResponse("Forbidden: Automated vulnerability scanning is prohibited.", {
      status: 403,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const { pathname } = request.nextUrl;

  // 2. Protect /admin, excluding /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || token !== ADMIN_SECRET_TOKEN) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|css|js|ico|html)$).*)",
  ],
};
