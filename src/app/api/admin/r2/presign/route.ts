import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";
import { generateR2PresignedUrl, isR2Configured, getR2Config } from "@/lib/r2";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!isR2Configured()) {
    return NextResponse.json(
      { success: false, error: "Cloudflare R2 ยังไม่ได้ตั้งค่า กรุณาไปที่ 'ตั้งค่า Cloudflare R2' ก่อน" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { filename, contentType } = body;

    if (!filename) {
      return NextResponse.json({ success: false, error: "Missing filename" }, { status: 400 });
    }

    const safeFilename = filename
      .replace(/[^a-zA-Z0-9.\-_]/g, "_")
      .replace(/_+/g, "_");

    const objectKey = `packages/${Date.now()}_${safeFilename}`;
    const cleanContentType = contentType || "application/octet-stream";

    const uploadUrl = generateR2PresignedUrl({
      method: "PUT",
      key: objectKey,
      expiresInSeconds: 1800, // 30 minutes for upload
      contentType: cleanContentType,
    });

    const config = getR2Config();
    const downloadIdentifier = `r2://${config?.bucketName || "packages"}/${objectKey}`;

    return NextResponse.json({
      success: true,
      uploadUrl,
      key: objectKey,
      downloadIdentifier,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Presign failed";
    console.error("Presign upload error:", err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
