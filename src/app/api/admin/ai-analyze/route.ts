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
  if (lower.includes("nvidia") || lower.includes("amd") || lower.includes("gpu") || lower.includes("graphics")) {
    category = "gpu-profiles";
  } else if (lower.includes("netsh") || lower.includes("tcp") || lower.includes("nagle") || lower.includes("ping") || lower.includes("network") || lower.includes("dns")) {
    category = "network";
  } else if (lower.includes("ram") || lower.includes("memory") || lower.includes("bios") || lower.includes("bcache") || lower.includes("paging")) {
    category = "memory-bios";
  } else if (lower.includes("all-in-one") || lower.includes("bundle") || lower.includes("aio") || lower.includes("ultimate") || lower.includes("suite")) {
    category = "bundles";
  }

  // Format clean base name from filename
  const cleanName = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

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
    name: cleanName || "Windows Gaming Optimizer Suite",
    category,
    tagline: "สคริปต์ปรับแต่งประสิทธิภาพระบบ ปิด Service แฝง และลด Latency เพื่อความนิ่งของเกม",
    description: `สคริปต์ ${filename} ออกแบบมาเพื่อปรับแต่งระบบ Windows สำหรับการเล่นเกมระดับ Esports โดยเฉพาะ ช่วยลดการทำงานของ Process แฝงใน Background, จัดสรรทรัพยากรฮาร์ดแวร์ให้ตัวเกมมีความสำคัญสูงสุด และเพิ่มความนิ่งของ Frametime (1% Low FPS)`,
    compatibility: "Windows 10 / 11 (64-bit ทุกเวอร์ชัน)",
    features: [
      "ลด Input Delay ของเมาส์และคีย์บอร์ด",
      "ปรับแต่งการจัดสรร Thread ของ CPU ให้เกมหลัก",
      "ปิดการส่งข้อมูล Telemetry ที่ไม่จำเป็นของระบบ",
      "มีสคริปต์ Revert คืนค่าเดิมได้ตลอดเวลา"
    ],
    requirements: [
      "รันไฟล์ด้วยสิทธิ์ผู้ดูแลระบบ (Run as Administrator)",
      "แนะนำให้สร้าง System Restore Point ก่อนเริ่มรัน"
    ],
    revertScript: revertCommands.join("\n"),
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { filename, content, userApiKey } = body;

    if (!content && !filename) {
      return NextResponse.json({ success: false, error: "Missing filename or content" }, { status: 400 });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;

    // If no API Key is provided, use Built-in Heuristic Analyzer
    if (!apiKey) {
      const fallbackResult = fallbackAnalyzeCode(filename || "script.bat", content || "");
      return NextResponse.json({
        success: true,
        isGemini: false,
        source: "Built-in Intelligent Code Parser",
        data: fallbackResult,
      });
    }

    // Call Google Gemini API (gemini-2.0-flash or gemini-1.5-flash)
    const prompt = `You are an elite Windows OS Esports Optimization Specialist and software packager for "Pokky Optimize Shop".
Analyze the following script code (filename: "${filename}"):

=== SCRIPT CODE START ===
${(content || "").slice(0, 15000)}
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

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!geminiRes.ok) {
      // If 2.0-flash failed, try 1.5-flash fallback
      const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const geminiRes15 = await fetch(fallbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!geminiRes15.ok) {
        const errorText = await geminiRes15.text();
        console.error("Gemini API Error:", errorText);
        // Fallback to local heuristic parser
        const fallbackResult = fallbackAnalyzeCode(filename || "script.bat", content || "");
        return NextResponse.json({
          success: true,
          isGemini: false,
          fallbackReason: "Gemini API key invalid or quota exceeded",
          data: fallbackResult,
        });
      }

      const data15 = await geminiRes15.json();
      const rawText = data15.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(rawText);

      return NextResponse.json({
        success: true,
        isGemini: true,
        model: "gemini-1.5-flash",
        data: parsed,
      });
    }

    const data = await geminiRes.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const parsed = JSON.parse(rawText);

    return NextResponse.json({
      success: true,
      isGemini: true,
      model: "gemini-2.0-flash",
      data: parsed,
    });
  } catch (err: any) {
    console.error("AI Analysis failed:", err);
    // Graceful fallback to heuristic
    const fallbackResult = fallbackAnalyzeCode("script.bat", "");
    return NextResponse.json({
      success: true,
      isGemini: false,
      data: fallbackResult,
    });
  }
}
