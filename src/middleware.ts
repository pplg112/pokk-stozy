import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import { evaluateWafRules } from "@/lib/waf";

function isAllowedHost(hostHeader: string | null): boolean {
  if (!hostHeader) return true;
  const host = hostHeader.split(":")[0].toLowerCase();
  return (
    host === "pokkystozy.xyz" ||
    host === "www.pokkystozy.xyz" ||
    host.endsWith(".vercel.app") ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1"
  );
}

function isAllowedOrigin(originHeader: string | null): boolean {
  if (!originHeader) return true;
  try {
    const parsed = new URL(originHeader);
    const host = parsed.hostname.toLowerCase();
    return (
      host === "pokkystozy.xyz" ||
      host === "www.pokkystozy.xyz" ||
      host.endsWith(".vercel.app") ||
      host === "localhost" ||
      host === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  // 1. Host Header Poisoning Defense
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!isAllowedHost(host)) {
    return new NextResponse("Bad Request: Untrusted Host Header", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // 2. CSRF & Cross-Origin State-Mutation Defense
  const method = request.method.toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    const origin = request.headers.get("origin");
    if (origin && !isAllowedOrigin(origin)) {
      return new NextResponse("Forbidden: Cross-Origin Request Blocked (CSRF Protection)", {
        status: 403,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }

  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded
    ? forwarded.split(",")[0].trim()
    : request.headers.get("x-real-ip") || "127.0.0.1";

  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
  const isAdmin = await verifySessionToken(token, clientIp);

  // 3. Edge WAF Engine: Honeypots, SQLi/LFI/RCE inspection, IP Jail & Malicious Bot blocking
  // Verified Admin sessions bypass WAF inspection (Admin Whitelist)
  if (!isAdmin) {
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
  }

  // 4. Protect /admin routes, excluding /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAdmin) {
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
