import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  isDiscordConfigured,
} from "@/lib/userAuth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  let dbUser = null;
  if (user?.id) {
    try {
      dbUser = await db.getUserByDiscordId(user.id);
      // Auto-upsert into persistent storage if missing or first load after migration
      if (!dbUser) {
        dbUser = await db.upsertDiscordUser({
          discordId: user.id,
          username: user.username,
          globalName: user.globalName,
          email: user.email,
          avatar: user.avatar,
          avatarUrl: user.avatarUrl,
          role: user.role,
        });
      }
    } catch (e) {
      console.error("Failed to sync user in /api/auth/me:", e);
    }
  }

  return NextResponse.json({
    success: true,
    user: user
      ? {
          ...user,
          role: dbUser?.role || user.role,
          email: dbUser?.email || user.email,
          createdAt: dbUser?.createdAt,
          lastLoginAt: dbUser?.lastLoginAt,
        }
      : null,
    isDiscordConfigured: isDiscordConfigured(),
  });
}

