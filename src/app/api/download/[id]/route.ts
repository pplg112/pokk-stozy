import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = db.getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isRevert = searchParams.get("type") === "revert";

    // Increment download counter
    db.incrementDownload(id);

    const safeFilename = product.name
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .replace(/_+/g, "_");

    const filename = isRevert
      ? `REVERT_${safeFilename}.bat`
      : `${safeFilename}.bat`;

    const content = isRevert ? product.revertScript : product.scriptContent;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/x-bat; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
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
