import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { verifyBankSlip } from "@/utils/slipVerifier";

export interface VerifiedSlipRecord {
  orderId: string;
  amount: number;
  filename: string;
  timestamp: string;
  status: "verified" | "rejected";
  refCode: string;
  bankName: string;
  productName: string;
}

const slipsDirectory = path.join(process.cwd(), "public", "uploads", "slips");
const usedSlipsFile = path.join(slipsDirectory, "used_slips.json");
const logsFile = path.join(slipsDirectory, "slips_log.json");

// Ensure directory exists
if (!fs.existsSync(slipsDirectory)) {
  fs.mkdirSync(slipsDirectory, { recursive: true });
}

function getUsedSlips(): Set<string> {
  if (!fs.existsSync(usedSlipsFile)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(usedSlipsFile, "utf-8"));
    return new Set(data);
  } catch {
    return new Set();
  }
}

function saveUsedSlip(transRef: string): void {
  const current = getUsedSlips();
  current.add(transRef);
  fs.writeFileSync(usedSlipsFile, JSON.stringify(Array.from(current), null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("slip") as File | null;
    const orderId = (formData.get("orderId") as string) || `ORD-${Date.now()}`;
    const amount = Number(formData.get("amount") || 0);
    const productName = (formData.get("productName") as string) || "PC Optimization Package";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "กรุณาแนบไฟล์รูปภาพสลิปการโอนเงิน" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "ไฟล์สลิปต้องเป็นรูปภาพ (.jpg, .png) เท่านั้น" },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Run Automated Slip & QR Verification
    const usedSlips = getUsedSlips();
    const verification = await verifyBankSlip(buffer, file.type, amount, usedSlips);

    if (!verification.isValid) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: verification.message,
          isDuplicate: verification.isDuplicate || false,
        },
        { status: 400 }
      );
    }

    // Save slip image to server storage
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `slip_${orderId}_${Date.now()}.${ext}`;
    const filePath = path.join(slipsDirectory, filename);
    fs.writeFileSync(filePath, buffer);

    // Save used transaction ref to prevent re-use
    if (verification.transRef) {
      saveUsedSlip(verification.transRef);
    }

    // Create verified transaction record
    const record: VerifiedSlipRecord = {
      orderId,
      amount,
      filename,
      timestamp: new Date().toISOString(),
      status: "verified",
      refCode: verification.transRef || `REF-${orderId}`,
      bankName: verification.bankName || "ธนาคารไทย (PromptPay)",
      productName,
    };

    // Append to logs
    let logs: VerifiedSlipRecord[] = [];
    if (fs.existsSync(logsFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logsFile, "utf-8"));
      } catch {
        logs = [];
      }
    }
    logs.unshift(record);
    fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));

    return NextResponse.json({
      success: true,
      verified: true,
      message: verification.message,
      record: {
        orderId,
        refCode: record.refCode,
        bankName: record.bankName,
        amount,
        productName,
        slipUrl: `/uploads/slips/${filename}`,
        verifiedAt: new Date().toLocaleTimeString("th-TH"),
      },
    });
  } catch (error: any) {
    console.error("Slip verification error:", error);
    return NextResponse.json(
      { success: false, message: "เกิดข้อผิดพลาดในการตรวจสอบสลิป: " + (error.message || "") },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(logsFile)) {
      return NextResponse.json({ logs: [] });
    }
    const data = fs.readFileSync(logsFile, "utf-8");
    const logs = JSON.parse(data);
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
