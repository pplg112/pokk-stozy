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

