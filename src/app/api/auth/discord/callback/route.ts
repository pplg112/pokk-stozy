import { NextRequest, NextResponse } from "next/server";
import {
  exchangeDiscordCode,
  fetchDiscordUserProfile,
  createSignedUserToken,
  USER_COOKIE_NAME,
} from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "pokkystozy.xyz";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUri = `${proto}://${host}/api/auth/discord/callback`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");

  let returnUrl = "/";
  if (stateRaw) {
    try {
      const parsed = JSON.parse(Buffer.from(stateRaw, "base64url").toString("utf-8"));
      if (parsed && typeof parsed.returnUrl === "string" && parsed.returnUrl.startsWith("/")) {
        returnUrl = parsed.returnUrl;
      }
    } catch {}
  }

  if (!code) {
    return NextResponse.redirect(new URL(`${returnUrl}?auth_error=no_code`, request.url));
  }

  const accessToken = await exchangeDiscordCode(code, redirectUri);
  if (!accessToken) {
    return NextResponse.redirect(new URL(`${returnUrl}?auth_error=exchange_failed`, request.url));
  }

  const user = await fetchDiscordUserProfile(accessToken);
  if (!user) {
    return NextResponse.redirect(new URL(`${returnUrl}?auth_error=profile_failed`, request.url));
  }

  const token = await createSignedUserToken(user);

  const response = NextResponse.redirect(new URL(`${returnUrl}?auth_success=1`, request.url));
  response.cookies.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}
