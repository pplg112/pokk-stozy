import { NextRequest, NextResponse } from "next/server";
import { getDiscordOAuthUrl, isDiscordConfigured } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "pokkystozy.xyz";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUri = `${proto}://${host}/api/auth/discord/callback`;

  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get("returnUrl") || "/";
  const state = Buffer.from(JSON.stringify({ returnUrl })).toString("base64url");

  if (!isDiscordConfigured()) {
    return NextResponse.json({
      success: false,
      configured: false,
      error: "Discord OAuth2 credentials not yet configured. Please use Quick Login.",
      redirectUri,
    });
  }

  const authUrl = getDiscordOAuthUrl(redirectUri, state);
  if (searchParams.get("format") === "json") {
    return NextResponse.json({ success: true, url: authUrl });
  }

  return NextResponse.redirect(authUrl);
}
