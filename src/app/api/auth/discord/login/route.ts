import { NextRequest, NextResponse } from "next/server";
import { getDiscordOAuthUrl, isDiscordConfigured, generateSignedOAuthState } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

/**
 * Endpoint: GET /api/auth/discord/login
 * Initiates the Discord OAuth2 authorization flow.
 * Creates a signed CSRF state with timestamp and target returnUrl,
 * then redirects the user's browser to Discord's official consent screen.
 */
export async function GET(request: NextRequest) {
  // Dynamically resolve origin from proxy headers or host header
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "pokkystozy.xyz";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUri = `${proto}://${host}/api/auth/discord/callback`;

  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Check if Discord OAuth2 credentials are configured
  if (!isDiscordConfigured()) {
    if (searchParams.get("format") === "json") {
      return NextResponse.json({
        success: false,
        configured: false,
        error: "Discord OAuth2 credentials not yet configured.",
        redirectUri,
      });
    }
    return NextResponse.redirect(
      new URL(`/login?error=not_configured&returnUrl=${encodeURIComponent(returnUrl)}`, request.url)
    );
  }

  // Generate cryptographically signed state (HMAC-SHA256) to prevent CSRF attacks
  const state = await generateSignedOAuthState(returnUrl);
  const authUrl = getDiscordOAuthUrl(redirectUri, state);

  if (searchParams.get("format") === "json") {
    return NextResponse.json({ success: true, url: authUrl });
  }

  return NextResponse.redirect(authUrl);
}
