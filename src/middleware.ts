import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { evaluateWafRules } from "@/lib/waf";

export async function middleware(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "127.0.0.1";

  // 1. Edge WAF Engine: Honeypot traps, SQLi/LFI/RCE inspection, IP Jail & Malicious Bot blocking
  const wafResult = evaluateWafRules(request, clientIp);
  if (wafResult.blocked) {
    return new NextResponse(wafResult.reason || "Forbidden: Request blocked by security firewall.", {
      status: wafResult.status || 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Firewall-Block": "Active-Defense",
      },
    });
  }

  const { pathname } = request.nextUrl;

  // 2. Protect /admin routes, excluding /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(token, clientIp);

    if (!isValid) {
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
