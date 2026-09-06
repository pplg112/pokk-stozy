import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";

interface GeminiModelListItem {
  name: string;
  supportedGenerationMethods?: string[];
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticatedRequest(request))) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const apiKey = (body.apiKey || "").trim();

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "กรุณาระบุ Gemini API Key" }, { status: 400 });
    }

    // Priority list with Google's recommended gemini-3.6-flash
    let modelsToTest = [
      "gemini-3.6-flash",
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash"
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
          const available = (listData.models as GeminiModelListItem[])
            .filter((m) => 
              Array.isArray(m.supportedGenerationMethods) && 
              m.supportedGenerationMethods.includes("generateContent") &&
              !m.name.includes("tts") &&
              !m.name.includes("audio") &&
              !m.name.includes("image") &&
              !m.name.includes("embedding")
            )
            .map((m) => m.name.replace(/^models\//, ""));
          if (available.length > 0) {
            // Prioritize flash models
            const flashModels = available.filter((m: string) => m.includes("flash"));
            modelsToTest = Array.from(new Set([...flashModels, ...available, ...modelsToTest]));
          }
        }
      }
    } catch {}

    let lastError = "";

    for (const model of modelsToTest) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello! Reply with 'OK' in plain text." }] }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "OK";
        return NextResponse.json({
          success: true,
          model,
          message: `เชื่อมต่อ Google Gemini API สำเร็จ (โมเดล: ${model})`,
          reply,
        });
      } else {
        const errText = await res.text();
        try {
          const errObj = JSON.parse(errText);
          lastError = errObj.error?.message || errText;
        } catch {
          lastError = errText;
        }
      }
    }

    return NextResponse.json({
      success: false,
      error: lastError || "ไม่สามารถเชื่อมต่อ Google Gemini API ได้ กรุณาตรวจสอบความถูกต้องของ API Key",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการทดสอบเชื่อมต่อ";
    return NextResponse.json({
      success: false,
      error: message,
    });
  }
}
