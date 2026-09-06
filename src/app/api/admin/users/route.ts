import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    const allUsers = await db.getAllUsers();

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const stats = {
      totalUsers: allUsers.length,
      adminCount: allUsers.filter((u) => u.role === "admin").length,
      bannedCount: allUsers.filter((u) => u.role === "banned").length,
      userCount: allUsers.filter((u) => !u.role || u.role === "user").length,
      activeToday: allUsers.filter((u) => {
        if (!u.lastLoginAt) return false;
        const loginTime = new Date(u.lastLoginAt).getTime();
        return !isNaN(loginTime) && now - loginTime < oneDayMs;
      }).length,
    };

    let users = allUsers;
    if (q) {
      users = users.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          (u.globalName && u.globalName.toLowerCase().includes(q)) ||
          u.discordId.includes(q) ||
          (u.email && u.email.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      users,
      stats,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
