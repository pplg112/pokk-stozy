import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await db.updateProduct(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    console.error("PUT /api/admin/products/[id] error:", error);
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
    const deleted = await db.deleteProduct(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Delete failed";
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
