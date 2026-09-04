import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN } from "@/lib/auth";

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value || request.headers.get("x-admin-token");
  return token === ADMIN_SECRET_TOKEN;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json(
        { 
          success: false, 
          error: `ไฟล์มีขนาด ${(file.size / (1024 * 1024)).toFixed(1)} MB ซึ่งเกินขีดจำกัดของเซิร์ฟเวอร์ (4.5 MB) กรุณาระบุลิงก์ดาวน์โหลดตรง เช่น Google Drive หรือ Mediafire แทน` 
        }, 
        { status: 400 }
      );
    }

    const filename = file.name;
    const sizeInBytes = file.size;
    const formattedSize =
      sizeInBytes > 1024 * 1024
        ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(sizeInBytes / 1024 || 1)} KB`;

    const extension = filename.split(".").pop()?.toUpperCase() || "BAT";
    const fileFormat = `.${extension}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Handle ZIP files specifically
    if (extension === "ZIP") {
      try {
        const AdmZipModule = await import("adm-zip");
        const AdmZip = AdmZipModule.default || AdmZipModule;
        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries().filter((e: any) => !e.isDirectory);

        const includedFiles = zipEntries.map((e: any) => {
          const lower = e.entryName.toLowerCase();
          let desc = "ไฟล์ส่วนประกอบในแพ็กเกจ";
          if (lower.endsWith(".reg")) desc = "ไฟล์ Registry ปรับแต่งระบบ Windows";
          else if (lower.endsWith(".cmd") || lower.endsWith(".bat")) desc = "ไฟล์สคริปต์คำสั่งการทำงานหลัก";
          else if (lower.endsWith(".ps1")) desc = "สคริปต์ PowerShell";
          else if (lower.endsWith(".txt")) desc = "คู่มือหรือข้อความอธิบาย";
          return {
            filename: e.entryName,
            description: desc,
          };
        });

        // Extract text from text/script files inside zip for AI code analysis
        let analysisContent = "";
        for (const entry of zipEntries) {
          const lower = entry.entryName.toLowerCase();
          if (lower.endsWith(".bat") || lower.endsWith(".cmd") || lower.endsWith(".reg") || lower.endsWith(".ps1") || lower.endsWith(".txt")) {
            try {
              const text = entry.getData().toString("utf-8").replace(/\0/g, "").slice(0, 3000);
              analysisContent += `--- ไฟล์: ${entry.entryName} ---\n${text}\n\n`;
            } catch {}
          }
        }

        if (!analysisContent) {
          analysisContent = `แพ็กเกจ ZIP ประกอบด้วยไฟล์: ${includedFiles.map((f: any) => f.filename).join(", ")}`;
        }

        // Store entire zip binary intact as base64 data URL
        const zipBase64 = `data:application/zip;base64,${buffer.toString("base64")}`;
        const fileId = `file-${Date.now()}`;
        db.saveUploadedBlob(fileId, filename, zipBase64);

        return NextResponse.json({
          success: true,
          fileId,
          filename,
          fileFormat: ".ZIP",
          fileSize: formattedSize,
          isZip: true,
          includedFiles,
          content: zipBase64,
          analysisContent,
        });
      } catch (zipErr) {
        console.error("ZIP parsing error:", zipErr);
      }
    }

    // Read script text content as buffer to detect encoding (UTF-16LE / UTF-16BE / UTF-8)
    let textContent = "";
    if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) {
      // UTF-16 LE with BOM
      textContent = buffer.subarray(2).toString("utf16le");
    } else if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
      // UTF-16 BE with BOM
      textContent = new TextDecoder("utf-16be").decode(buffer.subarray(2));
    } else if (buffer.length >= 4 && buffer[1] === 0 && buffer[3] === 0) {
      // UTF-16 LE without BOM (common in Windows batch scripts)
      textContent = buffer.toString("utf16le");
    } else {
      // Standard UTF-8
      textContent = buffer.toString("utf-8");
    }

    // Always strip null bytes to prevent PostgreSQL 22P05 error
    textContent = textContent.replace(/\0/g, "");

    const fileId = `file-${Date.now()}`;
    db.saveUploadedBlob(fileId, filename, textContent);

    return NextResponse.json({
      success: true,
      fileId,
      filename,
      fileFormat,
      fileSize: formattedSize,
      isZip: false,
      includedFiles: [
        { filename, description: "ไฟล์สคริปต์ปรับแต่งหลัก" }
      ],
      content: textContent,
      analysisContent: textContent,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
  }
}
