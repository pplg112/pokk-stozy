import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, checkProductsRateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
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
    const products = await db.getProductsListing(true);
    return NextResponse.json({ success: true, products });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load products" },
      { status: 500 }
    );
  }
}
