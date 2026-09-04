import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
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

    // Read content as buffer to detect encoding (UTF-16LE / UTF-16BE / UTF-8)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let textContent = "";
    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
      // UTF-16 LE with BOM
      textContent = buffer.subarray(2).toString("utf16le");
    } else if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
      // UTF-16 BE with BOM
      textContent = new TextDecoder("utf-16be").decode(buffer.subarray(2));
    } else if (buffer.length >= 4 && buffer[1] === 0 && buffer[3] === 0) {
      // UTF-16 LE without BOM (common in Windows batch scripts)
      textContent = buffer.toString("utf16le");
    } else {
      // Standard UTF-8
      textContent = buffer.toString("utf-8");
    }

    // Always strip null bytes to prevent PostgreSQL 22P05 error
    textContent = textContent.replace(/\0/g, "");

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
