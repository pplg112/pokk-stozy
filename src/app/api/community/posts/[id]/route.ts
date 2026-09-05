import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await db.deleteCommunityPost(id);
    if (!success) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "ลบโพสต์เรียบร้อยแล้ว" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete post" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const isPinned = Boolean(body.isPinned);

    const success = await db.pinCommunityPost(id, isPinned);
    if (!success) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      isPinned,
      message: isPinned ? "ปักหมุดโพสต์เรียบร้อยแล้ว" : "ยกเลิกการปักหมุดเรียบร้อย",
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update pin" }, { status: 500 });
  }
}
