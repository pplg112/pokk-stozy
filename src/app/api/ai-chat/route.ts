import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { checkAiChatRateLimit, getClientIp } from "@/lib/rateLimit";

import { RealProduct } from "@/data/realProducts";
import { DigitalProduct } from "@/types";

interface ChatMessage {
  role: "user" | "assistant" | "model";
  content: string;
}

type CatalogItem = DigitalProduct | RealProduct;

interface GeminiContentPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiContentPart[];
}

// Built-in Offline Esports Knowledge Engine (100% reliable fallback)
function generateOfflineAiResponse(userMessage: string, catalog: CatalogItem[]): { reply: string; recommendedIds: string[] } {
  const query = userMessage.toLowerCase();
  const recommendedIds: string[] = [];

  // Match products from catalog
  const findProd = (keyword: string) => {
    return catalog.find(
      (p) =>
        p.id.toLowerCase().includes(keyword) ||
        p.name.toLowerCase().includes(keyword) ||
        Boolean(p.tagline?.toLowerCase().includes(keyword))
    );
  };

  const shxrk = findProd("shxrk") || catalog.find((p) => p.id === "pokky-1788536637641");
  const lowLatency = findProd("latency") || catalog.find((p) => p.id === "pokky-1788529027101");
  const network = findProd("network") || catalog.find((p) => p.id === "pokky-1788585249542");
  const stephaOS = findProd("stepha") || catalog.find((p) => p.id === "pokky-1788553424279");
  const projectS = findProd("project") || catalog.find((p) => p.id === "pokky-1788586545769");
  const timerRes = findProd("timer") || catalog.find((p) => p.id === "pokky-1788538939543");

  let reply = "";

  if (query.includes("fivem") || query.includes("gta") || query.includes("เมือง") || query.includes("ตกแมพ") || query.includes("โหลดแมพ")) {
    if (shxrk) recommendedIds.push(shxrk.id);
    if (lowLatency && !recommendedIds.includes(lowLatency.id)) recommendedIds.push(lowLatency.id);

    reply = `**แนวทางการแก้ปัญหา FiveM กระตุก / เฟรมดรอปในเมือง / โหลดแมพไม่ทัน:**

ปัญหาหลักของ FiveM มักเกิดจาก **Texture Streaming Memory เต็ม**, CPU Thread Bottleneck และ Windows จัดคิวงานไม่ทันเวลาขับรถความเร็วสูงครับ

**สิ่งที่ควรทำ:**
1. **ใช้สคริปต์ปรับแต่ง FiveM เฉพาะทาง:** ช่วยเคลียร์ Shader Cache และดันคิวการประมวลผล Texture บน SSD ให้โหลดวัตถุล่วงหน้า
2. **ลด DPC Latency:** ปิดการหน่วงของอุปกรณ์ เพื่อให้เวลาเล็งปืนหรือหันจอในเมืองไม่เกิดอาการภาพกระตุก (Micro-stuttering)
3. **ตั้งค่า Extended Texture Budget ใน FiveM:** ให้เลื่อนมาประมาณ 2-3 ขีด ไม่ควรดันจนสุดเพราะจะกิน VRAM เกินขนาด

สคริปต์ที่แนะนำสำหรับคุณด้านล่างนี้กดดาวน์โหลดไปรันแบบ **Run as Administrator** ได้ฟรีทันทีครับ มีไฟล์ Revert คืนค่าให้ครบถ้วน!`;
  } else if (query.includes("valorant") || query.includes("วาโล") || query.includes("vanguard") || query.includes("fps")) {
    if (lowLatency) recommendedIds.push(lowLatency.id);
    if (timerRes && !recommendedIds.includes(timerRes.id)) recommendedIds.push(timerRes.id);

    reply = `**แนวทางการดัน FPS และลดความหน่วงใน Valorant:**

Valorant เป็นเกมที่ใช้ **CPU Single-Core และ DPC Latency** เป็นหลัก หากค่า DPC Latency สูง แม้เฟรมเรตจะดูเยอะ แต่การตอบสนองของเมาส์จะรู้สึกลอยๆ ยิงไม่คม

**เทคนิคการปรับแต่งที่แนะนำ:**
1. **ลด Input Latency & ปรับ MMCSS:** จัดคิวงาน CPU ให้ความสำคัญกับโปรเซสเกมและเมาส์เป็นอันดับ 1
2. **ตั้งค่า Timer Resolution เป็น 0.5ms:** ลดรอบเวลาหน่วงของระบบ Windows ให้ตอบสนองไวขึ้นระดับเสี้ยววินาที
3. **ปลอดภัย 100% กับ Riot Vanguard:** สคริปต์ของทางร้านเน้นการปรับ Registry มาตรฐานของระบบปฏิบัติการ ไม่มีการแตะต้องไฟล์ตัวเกม มั่นใจได้ว่าไม่โดนแบนแน่นอนครับ

กดดาวน์โหลดแพ็กเกจปรับแต่งที่แนะนำด้านล่างไปใช้งานได้เลยครับ`;
  } else if (query.includes("ping") || query.includes("ปิง") || query.includes("แล็ก") || query.includes("เน็ต") || query.includes("packet loss") || query.includes("หลุด")) {
    if (network) recommendedIds.push(network.id);
    if (lowLatency && !recommendedIds.includes(lowLatency.id)) recommendedIds.push(lowLatency.id);

    reply = `**แนวทางการลด Ping และแก้ปัญหา Packet Loss / เน็ตแกว่งในเกมออนไลน์:**

อาการปิงแกว่งหรือ Packet Loss มักเกิดจาก Windows เปิดฟังก์ชัน **Nagle's Algorithm** ไว้อัตโนมัติ (ทำให้ระบบรอรวม Packet ก่อนค่อยส่ง) ซึ่งไม่เหมาะกับเกมออนไลน์อย่างยิ่ง

**ขั้นตอนการแก้ไขด้วยสคริปต์:**
1. **ปิด Nagle's Algorithm (TCP NoDelay):** บังคับให้ Windows ส่ง Packet คำสั่งยิง/เดิน ทันทีโดยไม่ต้องรอคิว
2. **ปรับ NetworkThrottlingIndex:** ปลดล็อกลิมิตแบนด์วิดท์เครือข่ายสำหรับเกม
3. **ใช้ DNS ที่มี Latency ต่ำ:** แนะนำ Cloudflare 1.1.1.1 หรือ Google 8.8.8.8

แนะนำให้ใช้สคริปต์ **Stepha Network Setting** ด้านล่างนี้ รันเสร็จแล้วรีสตาร์ตคอมพิวเตอร์ 1 ครั้งเพื่อใช้งานได้เต็มประสิทธิภาพครับ`;
  } else if (query.includes("ram") || query.includes("แรม") || query.includes("อืด") || query.includes("ช้า") || query.includes("ล้าง") || query.includes("ขยะ") || query.includes("win 11") || query.includes("windows 11")) {
    if (stephaOS) recommendedIds.push(stephaOS.id);
    if (lowLatency && !recommendedIds.includes(lowLatency.id)) recommendedIds.push(lowLatency.id);

    reply = `**แนวทางการเคลียร์ขยะ คืน RAM และเร่งสปีด Windows 10 / 11:**

Windows รุ่นใหม่ๆ มักมี Background Telemetry, Widgets, และ Service แฝงทำงานอยู่เบื้องหลัง ทำให้กินทรัพยากร CPU และ RAM โดยเปล่าประโยชน์

**สิ่งที่สคริปต์ช่วยจัดการให้:**
1. **ล้าง Standby Memory & Temp Files:** คืนพื้นที่แรมว่างให้กับเกม ลดอาการหน่วงสะสม
2. **ปิด Background Telemetry & Diagnostic Data:** หยุดส่งข้อมูลการใช้งานไป Microsoft ลดภาระการอ่านเขียนดิสก์
3. **เปิดโหมด Ultimate Performance:** บังคับให้ CPU ทำงานเต็มประสิทธิภาพโดยไม่ลดคล็อกสปีด

แนะนำสคริปต์ **Setting Stepha Full OS** ด้านล่างนี้ครับ สามารถรันเพื่อคลีนระบบได้ทันที`;
  } else if (query.includes("เมาส์") || query.includes("delay") || query.includes("ดีเลย์") || query.includes("คีย์บอร์ด") || query.includes("input lag")) {
    if (timerRes) recommendedIds.push(timerRes.id);
    if (lowLatency && !recommendedIds.includes(lowLatency.id)) recommendedIds.push(lowLatency.id);

    reply = `**เทคนิคการลด Input Delay เมาส์และคีย์บอร์ดให้คมกริบ:**

การที่เมาส์รู้สึกลอยหรือหน่วงเวลาหันจอ เกิดจาก Windows Default Timer Resolution อยู่ที่ **1.0ms - 15.6ms** ทำให้รอบการรับส่งสัญญาณจากเซนเซอร์เมาส์สะดุด

**การแก้ไขที่ได้ผลชัดเจนที่สุด:**
1. **ล็อก Timer Resolution 0.5ms:** เร่งการตอบสนองของระบบให้ไวขึ้น 2 เท่า เมาส์จะติดมือและลากหัวได้แม่นยำขึ้นมาก
2. **ปรับแต่ง BCDedit & Disable Dynamic Ticks:** ป้องกัน CPU หลับเวลารับสัญญาณจาก USB
3. **ปิด Mouse Acceleration ใน Windows:** ให้เคอร์เซอร์เคลื่อนที่ตามระยะทางจริง 1:1

ลองโหลดสคริปต์ที่แนะนำด้านล่างไปรันดูครับ จะรู้สึกได้ทันทีว่าเคอร์เซอร์เมาส์คมขึ้นมาก!`;
  } else {
    // General / Spec consultation
    if (projectS) recommendedIds.push(projectS.id);
    if (lowLatency && !recommendedIds.includes(lowLatency.id)) recommendedIds.push(lowLatency.id);
    if (recommendedIds.length === 0 && catalog[0]) recommendedIds.push(catalog[0].id);

    reply = `**สวัสดีครับ! ผมคือ Pokky Gemini AI ผู้ช่วยปรับแต่งคอมพิวเตอร์ประจำ Pokky Stozy**

ยินดีช่วยวิเคราะห์อาการคอมพิวเตอร์และแนะนำสคริปต์ที่เหมาะสมกับคุณครับ:

**สำหรับคำแนะนำเบื้องต้น:**
- หากต้องการ **เพิ่มความลื่นไหลโดยรวม และลดอาการหน่วงสะดุดของเกมทุกแนว**: แนะนำชุดสคริปต์ **PROJECT S V7** หรือ **Pokky Low Latency Pack**
- สคริปต์ทุกตัวในร้านถูกทดสอบแล้วว่าปลอดภัย 100% โปร่งใสสามารถเปิดเช็คโค้ดด้วย Notepad ได้
- มี **Revert Script** คืนค่าเดิมของ Windows แถมมาให้ในตัว ไม่ต้องกังวลเรื่องการตั้งค่าผิดพลาดครับ

*คุณสามารถพิมพ์ระบุชื่อเกมที่คุณเล่น (เช่น Valorant, FiveM, Apex) หรืออาการที่พบ (เช่น เฟรมตกเวลาเล็ง, ปิงแกว่ง, แรมไม่พอ) เพื่อให้ผมเจาะลึกเฉพาะทางได้เลยครับ!*`;
  }

  return { reply, recommendedIds };
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateCheck = checkAiChatRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `คำขอมากเกินไป กรุณารออีก ${rateCheck.retryAfterSeconds || 30} วินาทีแล้วลองใหม่อีกครั้ง`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const message: string = (body.message || "").trim().slice(0, 1000);
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history.slice(-8) : [];
    const clientApiKey: string = (body.userApiKey || "").trim();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุข้อความที่ต้องการปรึกษา" },
        { status: 400 }
      );
    }

    // Load available products catalog
    let catalog: CatalogItem[] = [];
    try {
      const dbProducts = await db.getProductsListing(true);
      catalog = dbProducts.filter((p) => p.active !== false);
    } catch {
      catalog = DIGITAL_PRODUCTS;
    }
    if (!catalog || catalog.length === 0) {
      catalog = DIGITAL_PRODUCTS;
    }

    // Determine API key
    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || "";

    // If no API key, use Offline Esports Engine
    if (!apiKey) {
      const offline = generateOfflineAiResponse(message, catalog);
      return NextResponse.json({
        success: true,
        source: "Pokky Esports AI Engine",
        isGemini: false,
        reply: offline.reply,
        recommendedProductIds: offline.recommendedIds,
      });
    }

    // Prepare system prompt for Gemini
    const catalogSummary = catalog
      .map((p) => `- ID: "${p.id}", Name: "${p.name}", Category: "${p.category}", Tagline: "${p.tagline}"`)
      .join("\n");

    const systemPrompt = `You are "Pokky Gemini AI" (พ็อกกี้ เจมิไน เอไอ), the elite esports PC optimization and gaming performance expert for "Pokky Stozy" (pokkystozy.xyz).
Pokky Stozy is a premier Thai PC Optimization and Gaming Tweaks hub providing 100% FREE, safe, open-source batch scripts and tweaks to boost FPS, lower DPC Latency, eliminate micro-stutters, and reduce network ping for competitive gamers.

Current Store Products Catalog:
${catalogSummary}

Key Rules & Guidelines:
1. Communicate politely, enthusiastically, and professionally in Thai language (ครับ/ผม). Use clean markdown formatting with bullet points and bold headers. DO NOT use emojis. Strictly zero emojis.
2. When answering gaming or PC optimization questions (e.g. Valorant, FiveM, CS2, Apex, Windows 10/11, High Ping, Low FPS, RAM bottleneck, Mouse/Keyboard delay), give concrete, actionable advice.
3. If one or more products from the catalog match the user's issue, recommend them and explain specifically why they help.
4. Always reassure the user that Pokky Stozy scripts are 100% free, safe, virus-free, and come with a Revert script to restore Windows defaults anytime.
5. At the VERY END of your response, if you recommend any products from the catalog, you MUST append a machine-readable tag in this exact format:
<!-- RECOMMENDED: ["product-id-1", "product-id-2"] -->
Use ONLY the exact IDs listed in the catalog above. If no specific product is relevant, you can omit the tag or recommend the most suitable one (like "pokky-1788529027101").`;

    // Construct Gemini contents array
    const contents: GeminiContent[] = [];

    // Append prior history
    for (const h of history) {
      if (h.content && (h.role === "user" || h.role === "assistant" || h.role === "model")) {
        contents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content.slice(0, 1000) }],
        });
      }
    }

    // Append current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const candidateModels = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
      "gemini-1.5-pro",
    ];

    let geminiReply = "";
    let usedModel = "";

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        });

        if (resp.ok) {
          const data = await resp.json();
          const candidate = data.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;
          if (text) {
            geminiReply = text;
            usedModel = model;
            break;
          }
        }
      } catch {
        // try next model
      }
    }

    if (!geminiReply) {
      // Fallback to offline engine if Gemini fails or quota exhausted
      const offline = generateOfflineAiResponse(message, catalog);
      return NextResponse.json({
        success: true,
        source: "Pokky Esports AI Engine (Fallback)",
        isGemini: false,
        reply: offline.reply,
        recommendedProductIds: offline.recommendedIds,
      });
    }

    // Extract recommended product IDs from tag
    const recommendedProductIds: string[] = [];
    const match = geminiReply.match(/<!--\s*RECOMMENDED:\s*(\[.*?\])\s*-->/);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        if (Array.isArray(parsed)) {
          for (const id of parsed) {
            if (typeof id === "string" && catalog.some((p) => p.id === id)) {
              recommendedProductIds.push(id);
            }
          }
        }
      } catch {}
    }

    // Clean tag from user-visible reply
    const cleanReply = geminiReply.replace(/<!--\s*RECOMMENDED:.*?-->/g, "").trim();

    return NextResponse.json({
      success: true,
      source: `Google Gemini (${usedModel})`,
      isGemini: true,
      reply: cleanReply,
      recommendedProductIds:
        recommendedProductIds.length > 0
          ? recommendedProductIds
          : generateOfflineAiResponse(message, catalog).recommendedIds,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
