import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp } from "@/lib/rateLimit";
import { sanitizeText, isSpamContent, isValidImageBase64, containsPrototypePollution } from "@/lib/sanitize";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") || undefined;
    const posts = await db.getCommunityPosts(tag);

    return NextResponse.json({
      success: true,
      posts,
      total: posts.length,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch community posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  try {
    const body = await request.json();

    // 1. Prototype pollution guard
    if (containsPrototypePollution(body)) {
      return NextResponse.json(
        { success: false, error: "Security violation" },
        { status: 400 }
      );
    }

    const {
      author,
      content,
      gameTag,
      specs,
      taggedProductId,
      taggedProductName,
      taggedProductFormat,
      beforeAfter,
      mediaUrl,
      website_confirm,
    } = body;

    // 2. Anti-bot honeypot field
    if (website_confirm && typeof website_confirm === "string" && website_confirm.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: "Bot detected" },
        { status: 400 }
      );
    }

    // 3. Validate author
    if (!author || typeof author !== "object" || !author.name || typeof author.name !== "string") {
      return NextResponse.json(
        { success: false, error: "กรุณาเข้าสู่ระบบ Discord ก่อนโพสต์ข้อความ" },
        { status: 401 }
      );
    }

    const authorName = sanitizeText(author.name).slice(0, 40) || "Discord Gamer";
    const authorAvatar = typeof author.avatar === "string" ? author.avatar : undefined;
    const discordTag = typeof author.discordTag === "string" ? sanitizeText(author.discordTag) : undefined;
    const authorId = typeof author.id === "string" ? author.id : `guest-${ip}`;

    // 4. Validate content
    const cleanContent = sanitizeText(content || "");
    if (!cleanContent || cleanContent.length < 5) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกข้อความโพสต์อย่างน้อย 5 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (cleanContent.length > 2000) {
      return NextResponse.json(
        { success: false, error: "ข้อความโพสต์ต้องไม่เกิน 2,000 ตัวอักษร" },
        { status: 400 }
      );
    }

    // 5. Anti-spam check
    if (isSpamContent(cleanContent)) {
      return NextResponse.json(
        { success: false, error: "ตรวจพบข้อความหรือลิงก์ที่ไม่ได้รับอนุญาต" },
        { status: 400 }
      );
    }

    // 6. Validate specs & beforeAfter
    const cleanSpecs = specs && typeof specs === "object" ? {
      cpu: typeof specs.cpu === "string" ? sanitizeText(specs.cpu).slice(0, 50) : undefined,
      gpu: typeof specs.gpu === "string" ? sanitizeText(specs.gpu).slice(0, 50) : undefined,
      ram: typeof specs.ram === "string" ? sanitizeText(specs.ram).slice(0, 30) : undefined,
    } : undefined;

    let cleanBeforeAfter = undefined;
    if (beforeAfter && typeof beforeAfter === "object") {
      cleanBeforeAfter = {
        beforeFps: typeof beforeAfter.beforeFps === "string" ? sanitizeText(beforeAfter.beforeFps).slice(0, 20) : undefined,
        afterFps: typeof beforeAfter.afterFps === "string" ? sanitizeText(beforeAfter.afterFps).slice(0, 20) : undefined,
        beforeImageUrl: typeof beforeAfter.beforeImageUrl === "string" && (beforeAfter.beforeImageUrl.startsWith("http") || isValidImageBase64(beforeAfter.beforeImageUrl)) ? beforeAfter.beforeImageUrl : undefined,
        afterImageUrl: typeof beforeAfter.afterImageUrl === "string" && (beforeAfter.afterImageUrl.startsWith("http") || isValidImageBase64(beforeAfter.afterImageUrl)) ? beforeAfter.afterImageUrl : undefined,
      };
    }

    // 7. Save post
    const newPost = await db.createCommunityPost({
      author: {
        id: authorId,
        name: authorName,
        avatar: authorAvatar,
        discordTag,
        badge: author.badge || "Verified Gamer",
      },
      content: cleanContent,
      gameTag: typeof gameTag === "string" ? sanitizeText(gameTag).slice(0, 30) : "General",
      specs: cleanSpecs,
      taggedProductId: typeof taggedProductId === "string" ? sanitizeText(taggedProductId) : undefined,
      taggedProductName: typeof taggedProductName === "string" ? sanitizeText(taggedProductName) : undefined,
      taggedProductFormat: typeof taggedProductFormat === "string" ? sanitizeText(taggedProductFormat) : undefined,
      beforeAfter: cleanBeforeAfter,
      mediaUrl: typeof mediaUrl === "string" ? mediaUrl.trim() : undefined,
    });

    return NextResponse.json({
      success: true,
      post: newPost,
      message: "สร้างโพสต์ในคอมมูนิตี้สำเร็จ!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการสร้างโพสต์" },
      { status: 500 }
    );
  }
}
