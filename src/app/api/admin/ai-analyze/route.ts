import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
  return token === ADMIN_SECRET_TOKEN;
}

interface AnalysisResult {
  name: string;
  category: "bundles" | "os-scripts" | "gpu-profiles" | "network" | "memory-bios";
  tagline: string;
  description: string;
  compatibility: string;
  features: string[];
  requirements: string[];
  revertScript: string;
}

// Fallback Heuristic Code Analyzer when no Gemini API Key is available
function fallbackAnalyzeCode(filename: string, content: string): AnalysisResult {
  const lower = (content + " " + filename).toLowerCase();
  
  let category: AnalysisResult["category"] = "os-scripts";
  const cleanName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  let name = cleanName;
  let tagline = "";
  let description = "";
  let features = [
    "ปรับแต่งการทำงานของระบบ Windows",
    "ช่วยลดภาระการทำงานที่ไม่จำเป็น",
    "มีคำสั่ง Revert คืนค่าเดิมได้"
  ];

  if (lower.includes("gpedit") || lower.includes("grouppolicy")) {
    category = "os-scripts";
    name = "เปิดใช้งาน Group Policy Editor (gpedit.msc)";
    tagline = "สคริปต์เปิดใช้งาน gpedit.msc สำหรับ Windows Home Edition";
    description = `สคริปต์ ${filename} สำหรับติดตั้งและเปิดใช้งาน Group Policy Editor (gpedit.msc) บนระบบ Windows Home Edition โดยดึงแพ็กเกจมาตรฐานของ Windows ช่วยให้สามารถตั้งค่านโยบายระบบและปิดฟังก์ชันที่ไม่ต้องการได้`;
    features = [
      "เปิดใช้งาน Group Policy ใน Windows 10/11 Home Edition",
      "ติดตั้งผ่านชุด DISM Package แท้ของระบบ",
      "ไม่ต้องติดตั้งโปรแกรมแปลกปลอมภายนอก",
      "เข้าใช้งานผ่านคำสั่ง gpedit.msc ได้ทันที"
    ];
  } else if (lower.includes("clean") || lower.includes("temp") || lower.includes("junk") || lower.includes("disk")) {
    category = "os-scripts";
    name = name || "Windows Deep Clean & Disk Optimizer";
    tagline = "สคริปต์ล้างไฟล์ขยะ แคชระบบชั่วคราว และคืนพื้นที่ว่างในดิสก์";
    description = `สคริปต์ ${filename} ช่วยล้างไฟล์ชั่วคราว (Temp files), Windows Update Cache, Prefetch และไฟล์ตกค้างในระบบ เพื่อเพิ่มพื้นที่ว่างและลดภาระการอ่านเขียนของฮาร์ดดิสก์/SSD`;
    features = [
      "ลบไฟล์ Temporary และขยะในระบบอย่างปลอดภัย",
      "ล้างแคช Windows Update ที่ตกค้าง",
      "ช่วยคืนพื้นที่ว่างบนไดรฟ์ C:",
      "เพิ่มความเร็วในการอ่านเขียนข้อมูล"
    ];
  } else if (lower.includes("nvidia") || lower.includes("amd") || lower.includes("gpu") || lower.includes("graphics")) {
    category = "gpu-profiles";
    name = name || "GPU Performance & Frame Stability Profile";
    tagline = "ปรับแต่งการทำงานของไดรเวอร์การ์ดจอ เพิ่มความลื่นไหลของภาพ";
    description = `สคริปต์ ${filename} ปรับแต่งค่า Registry และพารามิเตอร์ของระบบกราฟิก ช่วยลดอาการกระตุกของภาพ และเพิ่มความสม่ำเสมอของ Frametime`;
    features = [
      "ปรับแต่งการตอบสนองของไดรเวอร์กราฟิก",
      "ลดอาการ Micro-stutter และ Frame Drop",
      "เพิ่มความลื่นไหลในการแสดงผลเกม"
    ];
  } else if (lower.includes("netsh") || lower.includes("tcp") || lower.includes("nagle") || lower.includes("ping") || lower.includes("network") || lower.includes("dns")) {
    category = "network";
    name = name || "Network Latency & TCP Gaming Optimizer";
    tagline = "ปรับแต่งระบบเน็ตเวิร์ก ลด Ping และค่า Packet Delay";
    description = `สคริปต์ ${filename} ปรับตั้งค่าโปรโตคอล TCP/IP, ปิด Nagle's Algorithm และจัดการ Buffer เครือข่ายเพื่อเพิ่มความเร็วในการส่งข้อมูลในเกมออนไลน์`;
    features = [
      "ลด Ping และความแกว่งของสัญญาณ",
      "ปิด Nagle's Algorithm เพื่อส่งข้อมูลทันที",
      "เพิ่มความเสถียรในการเชื่อมต่อเกมออนไลน์"
    ];
  } else if (lower.includes("ram") || lower.includes("memory") || lower.includes("bios") || lower.includes("bcache") || lower.includes("paging")) {
    category = "memory-bios";
    name = name || "Memory Management & Cache Optimization";
    tagline = "ปรับแต่งการจัดการหน่วยความจำ RAM และแคชระบบ";
    description = `สคริปต์ ${filename} ช่วยจัดสรรหน่วยความจำ RAM ให้กับแอปพลิเคชันและเกมที่กำลังรันอยู่ ลดการเขียนไฟล์ Swap ลงบนดิสก์โดยไม่จำเป็น`;
    features = [
      "จัดสรร RAM ให้ความสำคัญกับแอปพลิเคชันหลัก",
      "ล้าง Standby Memory อัตโนมัติ",
      "ลดปัญหาเกมกระตุกจาก RAM ไม่พอ"
    ];
  } else if (lower.includes("all-in-one") || lower.includes("bundle") || lower.includes("aio") || lower.includes("ultimate") || lower.includes("suite")) {
    category = "bundles";
    name = name || "All-in-One Windows Gaming Optimization Suite";
    tagline = "ชุดรวมสคริปต์ปรับแต่งระบบแบบครบวงจร";
    description = `สคริปต์ ${filename} รวมการปรับแต่งทั้งระบบ ทั้ง CPU, Services แฝง และการตอบสนองของอินพุต`;
    features = [
      "ปรับแต่งระบบแบบครบวงจรในไฟล์เดียว",
      "ปิด Service แฝงที่ไม่จำเป็น",
      "ลด Input Delay ของระบบ",
      "มีคำสั่ง Revert คืนค่าเริ่มต้นได้"
    ];
  } else {
    // Clean default for any generic script - no annoying duplicate esports text
    tagline = `สคริปต์ ${cleanName} สำหรับปรับแต่งระบบ Windows`;
    description = `สคริปต์ ${filename} สำหรับการปรับแต่งและตั้งค่าระบบ Windows เพื่อเพิ่มประสิทธิภาพและความเสถียรในการใช้งาน`;
  }

  // Generate Revert Script heuristic
  let revertCommands = [
    "@echo off",
    "title Pokky Optimize - Revert Script",
    "echo [POKKY OPTIMIZE] กำลังคืนค่าระบบ Windows กลับสู่ค่าเริ่มต้น...",
    "echo.",
  ];

  if (lower.includes("netsh int tcp")) {
    revertCommands.push("netsh int tcp set global autotuninglevel=normal");
    revertCommands.push("netsh int tcp set global rss=enabled");
  }
  if (lower.includes("bcdedit")) {
    revertCommands.push("bcdedit /deletevalue useplatformclock >nul 2>&1");
    revertCommands.push("bcdedit /deletevalue disabledynamictick >nul 2>&1");
  }
  revertCommands.push("echo [POKKY OPTIMIZE] คืนค่าเริ่มต้นเรียบร้อยแล้ว กรุณารีสตาร์ทเครื่อง");
  revertCommands.push("pause");

  return {
    name: name || cleanName || "Windows Optimizer Script",
    category,
    tagline,
    description,
    compatibility: "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    features,
    requirements: [
      "รันไฟล์ด้วยสิทธิ์ผู้ดูแลระบบ (Run as Administrator)",
      "แนะนำให้สร้าง System Restore Point ก่อนเริ่มรัน"
    ],
    revertScript: revertCommands.join("\n"),
  };
}

function cleanAndParseJson(raw: string): any {
  if (!raw) throw new Error("Empty AI response");
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let reqFilename = "script.bat";
  let reqContent = "";

  try {
    const body = await request.json();
    const { filename, content, userApiKey } = body;
    reqFilename = (filename || "script.bat").replace(/\0/g, "");
    reqContent = (content || "").replace(/\0/g, "");

    if (!content && !filename) {
      return NextResponse.json({ success: false, error: "Missing filename or content" }, { status: 400 });
    }

    const apiKey = (userApiKey || process.env.GEMINI_API_KEY || "").trim();

    // If no API Key is provided, use Built-in Intelligent Code Parser
    if (!apiKey) {
      const fallbackResult = fallbackAnalyzeCode(reqFilename, reqContent);
      return NextResponse.json({
        success: true,
        isGemini: false,
        source: "Built-in Intelligent Code Parser",
        data: fallbackResult,
      });
    }

    // Call Google Gemini API (gemini-1.5-flash standard first, then gemini-2.0-flash)
    const prompt = `You are an elite Windows OS Esports Optimization Specialist and software packager for "Pokky Optimize Shop".
Analyze the following script code (filename: "${reqFilename}"):

=== SCRIPT CODE START ===
${(reqContent).slice(0, 15000)}
=== SCRIPT CODE END ===

Analyze what this script modifies in Windows (Registry, Services, Network, GPU, BCD, Timer Resolution, Power Plan, etc.).
Then, generate structured metadata in Thai for a free download item on the store.

You MUST respond strictly with a valid JSON object matching this exact schema:
{
  "name": "Punchy, attractive Thai/English package name (e.g. 'Valorant Ultra Low Latency & High FPS Profile')",
  "category": "One of: 'bundles', 'os-scripts', 'gpu-profiles', 'network', 'memory-bios'",
  "tagline": "A concise, engaging Thai tagline summarizing the core benefit (1-2 sentences)",
  "description": "Comprehensive Thai description explaining what the script tweaks, how it helps gamers, and why it improves FPS/Frametime/Latency",
  "compatibility": "e.g. 'Windows 10 / 11 (64-bit ทุกเวอร์ชัน)'",
  "features": [
    "Feature bullet 1 in Thai",
    "Feature bullet 2 in Thai",
    "Feature bullet 3 in Thai",
    "Feature bullet 4 in Thai"
  ],
  "requirements": [
    "Requirement 1 in Thai (e.g. 'รันด้วยสิทธิ์ Run as Administrator')",
    "Requirement 2 in Thai"
  ],
  "revertScript": "A complete, safe, valid Windows batch script (.BAT) that inverts or undoes every tweak made in the original script and restores standard Windows defaults."
}

Do NOT wrap in markdown fences other than raw JSON or json block. Respond ONLY with valid JSON.`;

    // Priority models list (headed by Google's recommended gemini-3.6-flash)
    let candidateModels = [
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-pro"
    ];

    // Try to dynamically discover models supported by this API key
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const listRes = await fetch(listUrl, {
        headers: { "x-goog-api-key": apiKey }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        if (Array.isArray(listData.models)) {
          const available = listData.models
            .filter((m: any) => 
              Array.isArray(m.supportedGenerationMethods) && 
              m.supportedGenerationMethods.includes("generateContent") &&
              !m.name.includes("tts") &&
              !m.name.includes("audio") &&
              !m.name.includes("image") &&
              !m.name.includes("embedding")
            )
            .map((m: any) => m.name.replace(/^models\//, ""));
          if (available.length > 0) {
            const flashModels = available.filter((m: string) => m.includes("flash"));
            candidateModels = Array.from(new Set([...flashModels, ...available, ...candidateModels]));
          }
        }
      }
    } catch {}

    let lastError = "";

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = cleanAndParseJson(rawText);
            return NextResponse.json({
              success: true,
              isGemini: true,
              model,
              data: parsed,
            });
          }
        } else {
          const errBody = await geminiRes.text();
          try {
            const errObj = JSON.parse(errBody);
            lastError = errObj.error?.message || errBody;
          } catch {
            lastError = errBody;
          }
          console.warn(`Gemini model ${model} returned error:`, lastError);
        }
      } catch (callErr: any) {
        lastError = callErr?.message || String(callErr);
        console.warn(`Gemini model ${model} fetch failed:`, lastError);
      }
    }

    // If all models failed, gracefully fallback to smart heuristic and report reason
    const fallbackResult = fallbackAnalyzeCode(reqFilename, reqContent);
    return NextResponse.json({
      success: true,
      isGemini: false,
      fallbackReason: lastError || "Google Gemini API ไม่สามารถประมวลผลได้",
      data: fallbackResult,
    });
  } catch (err: any) {
    console.error("AI Analysis failed:", err);
    const fallbackResult = fallbackAnalyzeCode(reqFilename, reqContent);
    return NextResponse.json({
      success: true,
      isGemini: false,
      fallbackReason: err?.message || "ระบบขัดข้องระหว่างวิเคราะห์โค้ด",
      data: fallbackResult,
    });
  }
}

