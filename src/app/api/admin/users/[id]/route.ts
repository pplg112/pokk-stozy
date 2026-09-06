import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { role } = body;

    if (!role || !["user", "admin", "banned"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "สถานะหรือสิทธิ์ไม่ถูกต้อง (อนุญาต: user, admin, banned)" },
        { status: 400 }
      );
    }

    const success = await db.updateUserRole(id, role as "user" | "admin" | "banned");
    if (!success) {
      return NextResponse.json(
        { success: false, error: "ไม่พบผู้ใช้หรืออัปเดตไม่สำเร็จ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `อัปเดตสิทธิ์ผู้ใช้เป็น ${role.toUpperCase()} เรียบร้อยแล้ว`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const success = await db.deleteUser(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "ไม่พบผู้ใช้หรือลบไม่สำเร็จ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "ลบผู้ใช้เรียบร้อยแล้ว",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
