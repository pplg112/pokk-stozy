import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Invalid post ID" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const ip = getClientIp(request);
    const userId = (body && typeof body.userId === "string" && body.userId) ? body.userId : `ip-${ip}`;

    const result = await db.toggleLikePost(id, userId);

    return NextResponse.json({
      success: true,
      likes: result.likes,
      isLiked: result.isLiked,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
