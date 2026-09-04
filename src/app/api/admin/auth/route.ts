import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pgm2551dd";
const COOKIE_NAME = "pokky_admin_token";
const SECRET_TOKEN = "pokky_admin_session_pgm2551dd";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true, message: "เข้าสู่ระบบสำเร็จ" });
      
      response.cookies.set({
        name: COOKIE_NAME,
        value: SECRET_TOKEN,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "รหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (token === SECRET_TOKEN) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "ออกจากระบบแล้ว" });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
