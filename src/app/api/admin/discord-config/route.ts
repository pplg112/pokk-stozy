import { NextRequest, NextResponse } from "next/server";
import { getDiscordConfig, saveDiscordConfig, isDiscordConfigured } from "@/lib/userAuth";
import { isAuthenticatedRequest, timingSafeCompare, ADMIN_PASSWORD } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "pokkystozy.xyz";
  const proto = request.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const redirectUri = `${proto}://${host}/api/auth/discord/callback`;

  const config = getDiscordConfig();
  const isConfigured = isDiscordConfigured();

  return NextResponse.json({
    success: true,
    isConfigured,
    clientId: config.clientId || "",
    hasSecret: Boolean(config.clientSecret),
    redirectUri,
  });
}

export async function POST(request: NextRequest) {
  try {
    const isAuthed = await isAuthenticatedRequest(request);
    const body = await request.json().catch(() => ({}));
    const { clientId, clientSecret, adminPassword } = body;

    // Check auth: either valid admin session or correct adminPassword
    const isPasswordValid = adminPassword && timingSafeCompare(String(adminPassword), ADMIN_PASSWORD);

    if (!isAuthed && !isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "สิทธิ์การเข้าถึงไม่ถูกต้อง กรุณาระบุรหัสผ่าน Admin" },
        { status: 401 }
      );
    }

    if (!clientId || typeof clientId !== "string" || !clientId.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ Discord Client ID" },
        { status: 400 }
      );
    }

    if (!clientSecret || typeof clientSecret !== "string" || !clientSecret.trim()) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ Discord Client Secret" },
        { status: 400 }
      );
    }

    const saved = saveDiscordConfig(clientId.trim(), clientSecret.trim());
    if (!saved) {
      return NextResponse.json(
        { success: false, error: "ไม่สามารถบันทึกการตั้งค่าลงดิสก์ได้" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "บันทึกการตั้งค่า Discord OAuth2 เรียบร้อยแล้ว",
      isConfigured: true,
      clientId: clientId.trim(),
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}