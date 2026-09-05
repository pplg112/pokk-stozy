import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    if (!isRevert && product.downloadUrl && product.downloadUrl.trim().startsWith("http")) {
      return NextResponse.redirect(product.downloadUrl.trim(), 302);
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
