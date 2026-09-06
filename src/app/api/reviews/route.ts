import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, checkReviewRateLimit } from "@/lib/rateLimit";
import { sanitizeText, isSpamContent, isValidImageBase64, containsPrototypePollution } from "@/lib/sanitize";
import { jailIp } from "@/lib/waf";
import { getAuthenticatedUser } from "@/lib/userAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;

    const reviews = await db.getReviews(productId);
    let rating = 0;
    let reviewCount = 0;

    if (productId) {
      const stats = await db.getProductRating(productId);
      rating = stats.rating;
      reviewCount = stats.reviewCount;
    }

    return NextResponse.json({
      success: true,
      reviews,
      rating,
      reviewCount,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // 1. Anti-Spam Rate Limiting (2 reviews / 60 seconds per IP)
  const rateLimitStatus = checkReviewRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `คุณส่งรีวิวถี่เกินไป กรุณารอสักครู่ (${rateLimitStatus.retryAfterSeconds || 60} วินาที) ก่อนส่งใหม่อีกครั้ง`,
      },
      { 
        status: 429, 
        headers: { "Retry-After": (rateLimitStatus.retryAfterSeconds || 60).toString() } 
      }
    );
  }

  try {
    const body = await request.json();

    // 2. Prototype Pollution Defense
    if (containsPrototypePollution(body)) {
      jailIp(ip, "Prototype Pollution Attempt", 600000); // 10 minutes
      return NextResponse.json(
        { success: false, error: "Invalid payload: Security violation" },
        { status: 400 }
      );
    }

    const { productId, authorName, rating, comment, imageUrl, website_confirm } = body;

    // 3. Honeypot Anti-Bot Trap
    // Real humans will not fill website_confirm (hidden field). Automated bots fill it.
    if (website_confirm && typeof website_confirm === "string" && website_confirm.trim().length > 0) {
      jailIp(ip, "Bot detected via Review Honeypot Trap", 600000); // 10 minutes
      return NextResponse.json(
        { success: false, error: "Bot activity detected" },
        { status: 400 }
      );
    }

    if (!productId || typeof productId !== "string") {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    const prod = await db.getProductById(productId);
    if (!prod) {
      return NextResponse.json(
        { success: false, error: "Package not found" },
        { status: 404 }
      );
    }

    const parsedRating = Number(rating);
    if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    // 4. Sanitize & Validate Comment Content
    const cleanComment = sanitizeText(comment || "");
    if (!cleanComment || cleanComment.length === 0) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกข้อความรีวิว" },
        { status: 400 }
      );
    }

    if (cleanComment.length > 1000) {
      return NextResponse.json(
        { success: false, error: "ข้อความรีวิวต้องไม่เกิน 1,000 ตัวอักษร" },
        { status: 400 }
      );
    }

    // 5. Spam & Phishing Link Detection
    if (isSpamContent(cleanComment)) {
      return NextResponse.json(
        { success: false, error: "ตรวจพบข้อความหรือลิงก์ที่ไม่ได้รับอนุญาต" },
        { status: 400 }
      );
    }

    // 6. Check Logged-in Discord User & Sanitize Author Name
    const loggedInUser = await getAuthenticatedUser(request);
    if (loggedInUser?.role === "banned") {
      return NextResponse.json(
        { success: false, error: "บัญชีของคุณถูกระงับการใช้งาน ไม่สามารถส่งรีวิวหรือแสดงความคิดเห็นได้" },
        { status: 403 }
      );
    }
    let cleanAuthor = loggedInUser?.globalName || loggedInUser?.username || sanitizeText(authorName || "");
    if (!cleanAuthor || cleanAuthor.length === 0) {
      cleanAuthor = "ผู้ใช้นิรนาม";
    } else if (cleanAuthor.length > 50) {
      cleanAuthor = cleanAuthor.slice(0, 50);
    }

    if (isSpamContent(cleanAuthor)) {
      cleanAuthor = "ผู้ใช้นิรนาม";
    }

    const authorAvatar = loggedInUser?.avatarUrl || body.authorAvatar || undefined;
    const discordId = loggedInUser?.id || body.discordId || undefined;

    // 7. Validate Image Payload
    let validatedImageUrl: string | undefined = undefined;
    if (imageUrl && typeof imageUrl === "string") {
      if (isValidImageBase64(imageUrl)) {
        validatedImageUrl = imageUrl;
      } else {
        return NextResponse.json(
          { success: false, error: "รูปแบบไฟล์รูปภาพไม่ถูกต้อง หรือขนาดเกิน 2.5 MB" },
          { status: 400 }
        );
      }
    }

    const newReview = await db.createReview({
      productId,
      authorName: cleanAuthor,
      authorAvatar,
      discordId,
      rating: Math.round(parsedRating),
      comment: cleanComment,
      imageUrl: validatedImageUrl,
    });

    const updatedStats = await db.getProductRating(productId);

    return NextResponse.json({
      success: true,
      review: newReview,
      rating: updatedStats.rating,
      reviewCount: updatedStats.reviewCount,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
