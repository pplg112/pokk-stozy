import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, checkReviewRateLimit } from "@/lib/rateLimit";
import { sanitizeText, isSpamContent, containsPrototypePollution } from "@/lib/sanitize";
import { jailIp } from "@/lib/waf";
import { getAuthenticatedUser } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(request);
  const resolvedParams = await params;
  const reviewId = resolvedParams.id;

  // 1. Anti-Spam Rate Limiting
  const rateLimitStatus = checkReviewRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `คุณส่งความคิดเห็นถี่เกินไป กรุณารอสักครู่ (${rateLimitStatus.retryAfterSeconds || 60} วินาที) ก่อนส่งใหม่อีกครั้ง`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));

    // 2. Prototype Pollution Defense
    if (containsPrototypePollution(body)) {
      jailIp(ip, "Prototype Pollution Attempt in Review Reply", 600000);
      return NextResponse.json(
        { success: false, error: "Invalid payload: Security violation" },
        { status: 400 }
      );
    }

    // 3. Honeypot Anti-Bot Trap
    if (body.website_confirm && typeof body.website_confirm === "string" && body.website_confirm.trim().length > 0) {
      jailIp(ip, "Bot detected via Reply Honeypot Trap", 600000);
      return NextResponse.json(
        { success: false, error: "Bot activity detected" },
        { status: 400 }
      );
    }

    const rawContent = (body.content || "").trim();
    if (!rawContent || rawContent.length < 2) {
      return NextResponse.json(
        { success: false, error: "ข้อความตอบกลับต้องมีความยาวอย่างน้อย 2 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (rawContent.length > 1000) {
      return NextResponse.json(
        { success: false, error: "ข้อความตอบกลับต้องไม่เกิน 1,000 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (isSpamContent(rawContent)) {
      return NextResponse.json(
        { success: false, error: "ข้อความมีลักษณะเป็นสแปมหรือลิงก์ไม่พึงประสงค์" },
        { status: 400 }
      );
    }

    // Check if user is logged in via Discord session
    const loggedInUser = await getAuthenticatedUser(request);

    let authorName = loggedInUser?.globalName || loggedInUser?.username || (body.authorName || "").trim() || "สมาชิก Pokky";
    let authorAvatar = loggedInUser?.avatarUrl || body.authorAvatar || undefined;
    let discordId = loggedInUser?.id || body.discordId || undefined;

    authorName = sanitizeText(authorName).slice(0, 50);
    const content = sanitizeText(rawContent);

    const reply = await db.addReviewReply(reviewId, {
      authorName,
      authorAvatar,
      discordId,
      content,
    });

    if (!reply) {
      return NextResponse.json(
        { success: false, error: "ไม่พบความคิดเห็นต้นทางที่ต้องการตอบกลับ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit reply" },
      { status: 500 }
    );
  }
}
