import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.getProducts(false); // Return all including inactive
  const stats = await db.getStats();

  return NextResponse.json({ success: true, products, stats });
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    if (!data.name || !data.category) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุชื่อแพ็กเกจและหมวดหมู่" },
        { status: 400 }
      );
    }

    const created = await db.createProduct(data);
    return NextResponse.json({ success: true, product: created });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการบันทึกแพ็กเกจ";
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
