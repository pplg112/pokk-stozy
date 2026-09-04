import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const COOKIE_NAME = "pokky_admin_token";
const SECRET_TOKEN = "pokky_authenticated_admin_session_2026";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  return token === SECRET_TOKEN;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const products = db.getProducts(false); // Return all including inactive
  const stats = db.getStats();

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

    const created = db.createProduct(data);
    return NextResponse.json({ success: true, product: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการบันทึกแพ็กเกจ" },
      { status: 500 }
    );
  }
}
