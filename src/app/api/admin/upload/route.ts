import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return token === ADMIN_SECRET_TOKEN;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const filename = file.name;
    const sizeInBytes = file.size;
    const formattedSize =
      sizeInBytes > 1024 * 1024
        ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(sizeInBytes / 1024 || 1)} KB`;

    const extension = filename.split(".").pop()?.toUpperCase() || "BAT";
    const fileFormat = `.${extension}`;

    // Read content as text for scripts
    const textContent = await file.text();

    const fileId = `file-${Date.now()}`;
    db.saveUploadedBlob(fileId, filename, textContent);

    return NextResponse.json({
      success: true,
      fileId,
      filename,
      fileFormat,
      fileSize: formattedSize,
      content: textContent,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
