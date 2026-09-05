import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_PASSWORD,
  timingSafeCompare,
  createSessionToken,
  verifySessionToken,
} from "@/lib/auth";
import { getClientIp, checkAdminBruteForce, recordAdminAuthAttempt } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const status = checkAdminBruteForce(ip);

  if (!status.allowed) {
    const minutes = Math.ceil((status.lockoutSeconds || 900) / 60);
    return NextResponse.json(
      {
        success: false,
        error: `คุณพยายามเข้าสู่ระบบผิดพลาดเกินจำนวนที่กำหนด ระบบได้ระงับการเข้าถึงชั่วคราว กรุณารออีก ${minutes} นาที`,
      },
      { 
        status: 429, 
        headers: { "Retry-After": (status.lockoutSeconds || 900).toString() } 
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    // Cryptographic constant-time password comparison to prevent timing attacks
    if (typeof password === "string" && timingSafeCompare(password, ADMIN_PASSWORD)) {
      recordAdminAuthAttempt(ip, true);

      // Generate cryptographically signed HMAC-SHA256 session token
      const sessionToken = await createSessionToken(ip);

      const response = NextResponse.json({ 
        success: true, 
        message: "เข้าสู่ระบบสำเร็จ",
        token: sessionToken 
      });
      
      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    // Failed attempt: record and apply exponential backoff delay
    recordAdminAuthAttempt(ip, false);
    const updatedStatus = checkAdminBruteForce(ip);

    // Artificial delay to thwart automated fast brute-forcers
    const failedCount = 5 - updatedStatus.remainingAttempts;
    const throttleMs = Math.min(3000, Math.max(500, failedCount * 600));
    await new Promise((resolve) => setTimeout(resolve, throttleMs));

    const remainingMsg = updatedStatus.remainingAttempts > 0
      ? ` (เหลือโอกาสอีก ${updatedStatus.remainingAttempts} ครั้งก่อนถูกล็อค)`
      : " (ระบบล็อคการเข้าถึงชั่วคราว 15 นาที)";

    return NextResponse.json(
      { success: false, error: `รหัสผ่านไม่ถูกต้อง${remainingMsg}` },
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
  const ip = getClientIp(request);
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
  
  const isValid = await verifySessionToken(token, ip);
  if (isValid) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "ออกจากระบบแล้ว" });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
