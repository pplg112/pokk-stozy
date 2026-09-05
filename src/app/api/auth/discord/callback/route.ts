import { NextRequest, NextResponse } from "next/server";
import {
  exchangeDiscordCode,
  fetchDiscordUserProfile,
  createSignedUserToken,
  verifySignedOAuthState,
  USER_COOKIE_NAME,
} from "@/lib/userAuth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Endpoint: GET /api/auth/discord/callback
 * Full Discord OAuth2 callback handler:
 * 1. Inspects query params for OAuth errors (e.g. user denied authorization)
 * 2. Verifies cryptographic CSRF state token and extracts target returnUrl
 * 3. Exchanges authorization code for an access token using server-side client_secret
 * 4. Fetches user profile from Discord API (id, username, global_name, avatar, email)
 * 5. Upserts/links the user into our database with discord_id as the UNIQUE KEY
 * 6. Generates a signed Web Crypto HMAC-SHA256 JWT session token
 * 7. Sets HttpOnly, Secure session cookie and redirects user to target destination
 */
export async function GET(request: NextRequest) {
  // Dynamically resolve origin for redirect URI validation
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "pokkystozy.xyz";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUri = `${proto}://${host}/api/auth/discord/callback`;

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const oauthError = searchParams.get("error");
  const oauthErrorDesc = searchParams.get("error_description");

  // Verify and unpack signed state to obtain the intended returnUrl
  const stateCheck = await verifySignedOAuthState(stateRaw);
  const returnUrl = stateCheck.returnUrl || "/";

  // 1. Handle OAuth2 error (e.g. user denied authorization or consent cancelled)
  if (oauthError) {
    console.warn("Discord OAuth2 error received:", oauthError, oauthErrorDesc);
    const friendlyMsg = oauthError === "access_denied"
      ? "คุณได้ยกเลิกการให้สิทธิ์เชื่อมต่อบัญชี Discord"
      : (oauthErrorDesc || "การเข้าสู่ระบบผ่าน Discord ถูกปฏิเสธ");

    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(oauthError)}&message=${encodeURIComponent(friendlyMsg)}&returnUrl=${encodeURIComponent(returnUrl)}`,
        request.url
      )
    );
  }

  // 2. Validate CSRF state
  if (!stateCheck.valid) {
    console.error("Invalid or expired OAuth state token");
    return NextResponse.redirect(
      new URL(
        `/login?error=state_mismatch&message=${encodeURIComponent("คำขอนี้หมดอายุหรือไม่ถูกต้องตามมาตรการความปลอดภัย (CSRF Protection) กรุณาลองใหม่อีกครั้ง")}&returnUrl=${encodeURIComponent(returnUrl)}`,
        request.url
      )
    );
  }

  // 3. Ensure authorization code is present
  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/login?error=no_code&message=${encodeURIComponent("ไม่พบ Authorization Code จาก Discord")}&returnUrl=${encodeURIComponent(returnUrl)}`,
        request.url
      )
    );
  }

  // 4. Exchange authorization code for Discord access token (client_secret kept strictly on backend)
  const accessToken = await exchangeDiscordCode(code, redirectUri);
  if (!accessToken) {
    return NextResponse.redirect(
      new URL(
        `/login?error=exchange_failed&message=${encodeURIComponent("โทเค็นยืนยันตัวตนหมดอายุหรือไม่ถูกต้อง กรุณากดลองเข้าสู่ระบบใหม่อีกครั้ง")}&returnUrl=${encodeURIComponent(returnUrl)}`,
        request.url
      )
    );
  }

  // 5. Fetch user profile from Discord API (identify, email)
  const discordUser = await fetchDiscordUserProfile(accessToken);
  if (!discordUser) {
    return NextResponse.redirect(
      new URL(
        `/login?error=profile_failed&message=${encodeURIComponent("ไม่สามารถดึงข้อมูลบัญชีจาก Discord ได้ กรุณาลองใหม่อีกครั้ง")}&returnUrl=${encodeURIComponent(returnUrl)}`,
        request.url
      )
    );
  }

  // 6. Upsert user into our database system using discord_id as the UNIQUE KEY
  const appUser = await db.upsertDiscordUser({
    discordId: discordUser.id,
    username: discordUser.username,
    globalName: discordUser.globalName,
    email: discordUser.email,
    avatar: discordUser.avatar,
    avatarUrl: discordUser.avatarUrl,
    role: discordUser.role || "user",
  });

  // 7. Create Signed JWT Session Token (HMAC-SHA256 via Web Crypto API)
  const token = await createSignedUserToken({
    id: appUser.discordId,
    username: appUser.username,
    globalName: appUser.globalName,
    email: appUser.email,
    avatarUrl: appUser.avatarUrl,
    role: appUser.role,
  });

  // 8. Redirect destination: Return to the referring page or /login with success indicator
  const redirectTarget = returnUrl && returnUrl !== "/" && returnUrl !== "/login"
    ? (returnUrl.includes("?") ? `${returnUrl}&auth_success=1` : `${returnUrl}?auth_success=1`)
    : "/login?auth_success=1";

  const response = NextResponse.redirect(new URL(redirectTarget, request.url));

  // 9. Attach HttpOnly, Secure session cookie (valid 30 days)
  response.cookies.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  });

  return response;
}
