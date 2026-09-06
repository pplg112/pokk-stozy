import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, checkProductsRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const rateLimitStatus = checkProductsRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please wait a moment." },
      {
        status: 429,
        headers: { "Retry-After": (rateLimitStatus.retryAfterSeconds || 60).toString() },
      }
    );
  }

  try {
    const { id } = await params;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing product ID" },
        { status: 400 }
      );
    }

    const product = await db.getProductMetadata(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load product" },
      { status: 500 }
    );
  }
}