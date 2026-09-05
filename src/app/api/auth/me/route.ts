import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  createSignedUserToken,
  isDiscordConfigured,
  getDiscordAvatarUrl,
  USER_COOKIE_NAME,
} from "@/lib/userAuth";
import { db } from "@/lib/db";
import { DiscordUser } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  let dbUser = null;
  if (user?.id) {
    try {
      dbUser = await db.getUserByDiscordId(user.id);
    } catch {}
  }

  return NextResponse.json({
    success: true,
    user: user
      ? {
          ...user,
          email: dbUser?.email || user.email,
          createdAt: dbUser?.createdAt,
          lastLoginAt: dbUser?.lastLoginAt,
        }
      : null,
    isDiscordConfigured: isDiscordConfigured(),
  });
}

// Quick Discord Login / Link for seamless testing and instant Discord profile connection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = (body.username || "").trim();
    const discordTag = (body.discordTag || "").trim();
    const avatarChoice = body.avatarChoice || "0";

    if (!username) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุชื่อผู้ใช้ Discord" },
        { status: 400 }
      );
    }

    const pseudoId = `discord-${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6)}`;
    const avatarUrl = body.avatarUrl || getDiscordAvatarUrl(pseudoId);

    const user: DiscordUser = {
      id: pseudoId,
      username: username,
      globalName: discordTag ? `${username}#${discordTag}` : username,
      avatarUrl,
      role: "user",
    };

    const token = await createSignedUserToken(user);

    const response = NextResponse.json({
      success: true,
      user,
    });

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");

    response.cookies.set(USER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: proto === "https",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Login failed" },
      { status: 500 }
    );
  }
}
