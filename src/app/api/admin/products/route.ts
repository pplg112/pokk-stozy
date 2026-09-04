import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
  return token === ADMIN_SECRET_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const products = await db.getProducts(false); // Return all including inactive
  const stats = await db.getStats();

  return NextResponse.json({ success: true, products, stats });
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
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
  } catch (error: any) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "เกิดข้อผิดพลาดในการบันทึกแพ็กเกจ" },
      { status: 500 }
    );
  }
}
