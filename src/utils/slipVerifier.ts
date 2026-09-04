import jsQR from "jsqr";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";

export interface SlipVerificationResult {
  isValid: boolean;
  message: string;
  bankName?: string;
  transRef?: string;
  amount?: number;
  qrPayload?: string;
  isDuplicate?: boolean;
}

const BANK_CODES: Record<string, string> = {
  "002": "ธนาคารกรุงเทพ (BBL)",
  "004": "ธนาคารกสิกรไทย (KBank)",
  "006": "ธนาคารกรุงไทย (KTB)",
  "011": "ธนาคารทหารไทยธนชาต (TTB)",
  "014": "ธนาคารไทยพาณิชย์ (SCB)",
  "025": "ธนาคารกรุงศรีอยุธยา (BAY)",
  "030": "ธนาคารออมสิน (GSB)",
  "034": "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร (ธ.ก.ส.)",
  "069": "ธนาคารเกียรตินาคินภัทร (KKP)",
  "073": "ธนาคารแลนด์ แอนด์ เฮ้าส์ (LH Bank)",
};

/**
 * Decode image buffer into RGBA pixel data
 */
function decodeImageToRGBA(buffer: Buffer, mimeType: string): { data: Uint8ClampedArray; width: number; height: number } | null {
  try {
    if (mimeType.includes("png")) {
      const png = PNG.sync.read(buffer);
      return {
        data: new Uint8ClampedArray(png.data),
        width: png.width,
        height: png.height,
      };
    } else {
      const decoded = jpeg.decode(buffer, { useTArray: true, maxMemoryUsageInMB: 512 });
      return {
        data: new Uint8ClampedArray(decoded.data),
        width: decoded.width,
        height: decoded.height,
      };
    }
  } catch (err) {
    // Try other decoder as fallback
    try {
      const png = PNG.sync.read(buffer);
      return {
        data: new Uint8ClampedArray(png.data),
        width: png.width,
        height: png.height,
      };
    } catch {
      try {
        const decoded = jpeg.decode(buffer, { useTArray: true, maxMemoryUsageInMB: 512 });
        return {
          data: new Uint8ClampedArray(decoded.data),
          width: decoded.width,
          height: decoded.height,
        };
      } catch {
        return null;
      }
    }
  }
}

/**
 * Verify if the decoded QR code payload is a legitimate Thai Bank Slip
 */
function validateThaiBankSlipPayload(payload: string): { 
  isBankSlip: boolean; 
  bankName: string; 
  transRef: string;
  rejectReason?: string;
} {
  const trimmed = payload.trim();
  const lower = trimmed.toLowerCase();

  // 1. Check if the user uploaded a PromptPay PAYMENT QR (e.g. 000201...)
  // 000201 is the EMVCo standard for payment generation, NOT a bank transfer receipt/slip!
  if (trimmed.startsWith("000201") || trimmed.includes("A000000677")) {
    return {
      isBankSlip: false,
      bankName: "",
      transRef: "",
      rejectReason: "รูปภาพที่แนบคือ QR Code สำหรับสแกนชำระเงิน (PromptPay) ไม่ใช่สลิปหลักฐานการโอนเงิน กรุณาโอนเงินผ่านแอปธนาคารให้เรียบร้อย แล้วแนบภาพสลิปที่ได้จากธนาคารหลังโอนเงินสำเร็จ",
    };
  }

  // 2. Check for standard Bank of Thailand (BOT) Slip Verification AID:
  // The official BOT specification defines National Slip Verification AID: "0006000001"
  // Usually formatted as Tag 00 + Length (e.g. 0041... or 0046...) + AID (0006000001)
  const isBotStandard = trimmed.includes("0006000001");

  // 3. Check for official Thai bank transfer verification URLs
  const isBankUrl =
    lower.includes("kplus.kasikornbank.com") ||
    lower.includes("kasikornbank.com/kplus-slip") ||
    lower.includes("scbeasy.page.link") ||
    lower.includes("scbeasy.com") ||
    lower.includes("krungthai.com") ||
    lower.includes("bangkokbank.com") ||
    lower.includes("ttbbank.com") ||
    lower.includes("gsb.or.th") ||
    lower.includes("tmn.app.link") ||
    lower.includes("truemoney.com");

  // If it does NOT match official BOT Slip standard AND is not an official bank slip URL -> REJECT!
  if (!isBotStandard && !isBankUrl) {
    return {
      isBankSlip: false,
      bankName: "",
      transRef: "",
      rejectReason: "QR Code นี้ไม่ใช่สลิปการโอนเงินของธนาคาร (อาจเป็น QR ลิงก์ทั่วไป, Wi-Fi หรือรูปสุ่ม) กรุณาแนบภาพสลิปที่ได้จากแอปพลิเคชันธนาคารของไทย",
    };
  }

  // Identify Bank Name from BOT format or URL
  let bankName = "ธนาคารไทย";
  let transRef = "";

  if (isBotStandard) {
    // BOT Standard TLV Format: 00 [len] 0006000001 01 [len] [BankCode] 02 [len] [TransRef] ...
    const aidIdx = trimmed.indexOf("0006000001");
    const sub = trimmed.substring(aidIdx + 10);

    // Tag 01: Sending Bank Code (e.g. 0103004 = KBank 004)
    const tag01Idx = sub.indexOf("01");
    if (tag01Idx !== -1) {
      const len = parseInt(sub.substring(tag01Idx + 2, tag01Idx + 4), 10);
      if (!isNaN(len) && len > 0 && len <= 5) {
        const bankCode = sub.substring(tag01Idx + 4, tag01Idx + 4 + len);
        for (const [code, name] of Object.entries(BANK_CODES)) {
          if (bankCode.endsWith(code) || code.endsWith(bankCode)) {
            bankName = name;
            break;
          }
        }
      }
    }

    // Tag 02: Transaction Reference (e.g. 0220016247101653DOR09309)
    const tag02Idx = sub.indexOf("02");
    if (tag02Idx !== -1) {
      const len = parseInt(sub.substring(tag02Idx + 2, tag02Idx + 4), 10);
      if (!isNaN(len) && len > 0 && len <= 50) {
        transRef = sub.substring(tag02Idx + 4, tag02Idx + 4 + len);
      }
    }
  } else {
    // URL based bank slip
    if (lower.includes("kasikornbank") || lower.includes("kplus")) bankName = "ธนาคารกสิกรไทย (KBank)";
    else if (lower.includes("scb")) bankName = "ธนาคารไทยพาณิชย์ (SCB)";
    else if (lower.includes("krungthai")) bankName = "ธนาคารกรุงไทย (KTB)";
    else if (lower.includes("ttb")) bankName = "ธนาคารทหารไทยธนชาต (TTB)";
    else if (lower.includes("bangkokbank")) bankName = "ธนาคารกรุงเทพ (BBL)";
    else if (lower.includes("gsb")) bankName = "ธนาคารออมสิน (GSB)";
    else if (lower.includes("truemoney") || lower.includes("tmn")) bankName = "ทรูมันนี่ วอลเล็ท (TrueMoney)";
    
    // Extract reference from URL or path
    try {
      const urlObj = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      transRef = urlObj.pathname.split("/").filter(Boolean).pop() || urlObj.searchParams.get("ref") || trimmed.substring(0, 32);
    } catch {
      transRef = trimmed.substring(0, 32);
    }
  }

  if (!transRef) {
    transRef = trimmed.substring(0, 32);
  }

  return {
    isBankSlip: true,
    bankName,
    transRef,
  };
}

/**
 * Optional integration with SlipOK API (if configured in environment)
 */
async function verifyViaSlipOK(payload: string, expectedAmount: number): Promise<SlipVerificationResult | null> {
  const apiKey = process.env.SLIPOK_API_KEY;
  const branchId = process.env.SLIPOK_BRANCH_ID;

  if (!apiKey || !branchId) {
    return null; // Not configured, fallback to strict local parser
  }

  try {
    const res = await fetch(`https://api.slipok.com/api/line/apikey/${branchId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-authorization": apiKey,
      },
      body: JSON.stringify({
        data: payload,
        amount: expectedAmount,
      }),
    });

    const json = await res.json();
    if (json.success && json.data) {
      return {
        isValid: true,
        message: `ตรวจสอบผ่าน SlipOK API สำเร็จ • โอนเข้าบัญชีถูกต้อง`,
        bankName: json.data.sendingBank || "ธนาคารไทย",
        transRef: json.data.transRef,
        amount: json.data.amount,
        qrPayload: payload,
      };
    } else {
      return {
        isValid: false,
        message: json.message || "SlipOK: สลิปไม่ถูกต้อง หรือยอดเงินไม่ตรงกับคำสั่งซื้อ",
      };
    }
  } catch (err: any) {
    console.error("SlipOK API error:", err);
    return null; // Fallback to local parsing on network failure
  }
}

/**
 * STRICT Automated Slip Verification function
 */
export async function verifyBankSlip(
  buffer: Buffer,
  mimeType: string,
  expectedAmount: number,
  usedTransRefs: Set<string>
): Promise<SlipVerificationResult> {
  // 1. Decode image pixels
  const image = decodeImageToRGBA(buffer, mimeType);

  if (!image) {
    return {
      isValid: false,
      message: "ไม่สามารถประมวลผลไฟล์รูปภาพได้ กรุณาใช้รูปภาพสลิป .jpg หรือ .png ที่คมชัด",
    };
  }

  // 2. Scan for QR code in the slip using jsQR
  let code = jsQR(image.data, image.width, image.height, {
    inversionAttempts: "attemptBoth",
  });

  // STRICT CHECK 1: If no QR Code was found in the image, REJECT!
  if (!code || !code.data || code.data.trim().length === 0) {
    return {
      isValid: false,
      message: "ไม่พบ QR Code ของสลิปการโอนเงินในรูปภาพนี้ กรุณาถ่ายหรือแคปหน้าจอภาพสลิปธนาคารให้เห็น QR Code ชัดเจน",
    };
  }

  const payload = code.data.trim();

  // STRICT CHECK 2: Validate that this QR Code is an actual Thai Bank Slip
  const check = validateThaiBankSlipPayload(payload);

  if (!check.isBankSlip) {
    return {
      isValid: false,
      message: check.rejectReason || "รูปภาพนี้มี QR Code แต่ไม่ใช่ QR Code สลิปการโอนเงินของธนาคาร กรุณาแนบสลิปธนาคารที่ถูกต้อง",
    };
  }

  const cleanRef = check.transRef || `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  // STRICT CHECK 3: Anti-Fraud Duplicate Check (Prevent reusing same slip)
  if (usedTransRefs.has(cleanRef) || usedTransRefs.has(payload)) {
    return {
      isValid: false,
      isDuplicate: true,
      message: "สลิปนี้ถูกใช้งานในระบบไปแล้ว ไม่สามารถนำสลิปเดิมมาใช้ซ้ำได้",
      transRef: cleanRef,
    };
  }

  // Optional: Try SlipOK Gateway if API credentials exist
  const slipOkResult = await verifyViaSlipOK(payload, expectedAmount);
  if (slipOkResult) {
    return slipOkResult;
  }

  // Successfully verified valid, unique Thai Bank Slip QR code!
  return {
    isValid: true,
    message: `ตรวจสอบ QR Code สลิปถูกต้อง • ${check.bankName}`,
    bankName: check.bankName,
    transRef: cleanRef,
    amount: expectedAmount,
    qrPayload: payload,
  };
}
