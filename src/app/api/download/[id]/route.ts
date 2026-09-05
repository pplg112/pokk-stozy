import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, checkDownloadRateLimit } from "@/lib/rateLimit";

function isSafeRedirectUrl(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    // Enforce HTTP/HTTPS only
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

    const hostname = parsed.hostname.toLowerCase();

    // Prevent SSRF / Open Redirect to private networks, loopback, or cloud metadata services
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname === "169.254.169.254" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Rate limiting against automated download flooding (15 req / 60s per IP)
  const ip = getClientIp(request);
  const rateLimitStatus = checkDownloadRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `คุณดาวน์โหลดถี่เกินไป กรุณารอสักครู่ (${rateLimitStatus.retryAfterSeconds || 60} วินาที)`,
      },
      { 
        status: 429, 
        headers: { "Retry-After": (rateLimitStatus.retryAfterSeconds || 60).toString() } 
      }
    );
  }

  try {
    const { id } = await params;

    // Strict parameter validation against Path Traversal
    if (!id || typeof id !== "string" || !/^[a-zA-Z0-9_\-]+$/.test(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid package ID format" },
        { status: 400 }
      );
    }

    const product = await db.getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isRevert = searchParams.get("type") === "revert";

    // Increment download counter
    await db.incrementDownload(id);

    // Secure external redirect (SSRF & Open-Redirect protected)
    if (!isRevert && product.downloadUrl && product.downloadUrl.trim().startsWith("http")) {
      const targetUrl = product.downloadUrl.trim();
      if (isSafeRedirectUrl(targetUrl)) {
        return NextResponse.redirect(targetUrl, 302);
      }
    }

    const safeFilename = product.name
      .replace(/[^a-zA-Z0-9_\-\u0E00-\u0E7F]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") || "pokky_package";

    const asciiFallback = safeFilename
      .replace(/[\u0E00-\u0E7F]/g, "")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") || "pokky_package";

    if (isRevert) {
      const filename = `REVERT_${safeFilename}.bat`;
      const fallbackName = `REVERT_${asciiFallback}.bat`;
      const content = product.revertScript || `@echo off\ntitle Revert - ${product.name}\necho คืนค่าเดิมของระบบเรียบร้อย\npause`;
      return new NextResponse(content, {
        status: 200,
        headers: {
          "Content-Type": "application/x-bat; charset=utf-8",
          "Content-Disposition": `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    const content = product.scriptContent || "";

    // Check if the product is a binary ZIP archive
    const isZipFormat =
      (product.fileFormat || "").toUpperCase().includes("ZIP") ||
      content.startsWith("data:application/zip;base64,") ||
      content.startsWith("data:application/x-zip-compressed;base64,") ||
      content.startsWith("PK\x03\x04");

    if (isZipFormat) {
      let zipBuffer: Buffer;
      if (content.startsWith("data:application/")) {
        const base64Data = content.replace(/^data:application\/[^;]+;base64,/, "");
        zipBuffer = Buffer.from(base64Data, "base64");
      } else {
        // Fallback for raw binary string
        zipBuffer = Buffer.from(content, "binary");
      }

      const filename = `${safeFilename}.zip`;
      const fallbackName = `${asciiFallback}.zip`;

      return new NextResponse(new Uint8Array(zipBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
          "Content-Length": zipBuffer.length.toString(),
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      });
    }

    // Otherwise serve as standard script (.BAT / .CMD / .REG / .PS1)
    const rawExt = (product.fileFormat || ".BAT").toUpperCase().replace(".", "");
    const ext = ["BAT", "CMD", "REG", "PS1"].includes(rawExt) ? rawExt.toLowerCase() : "bat";
    const filename = `${safeFilename}.${ext}`;
    const fallbackName = `${asciiFallback}.${ext}`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": `application/x-${ext}; charset=utf-8`,
        "Content-Disposition": `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Download failed" },
      { status: 500 }
    );
  }
}
