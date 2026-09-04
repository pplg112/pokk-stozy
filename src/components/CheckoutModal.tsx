"use client";

import React, { useState, useEffect, useRef } from "react";
import { DigitalProduct, PurchaseRecord } from "@/types";
import { saveStoredPurchase, triggerDownload } from "@/utils/storage";
import { 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  FileCode2, 
  KeyRound, 
  Terminal, 
  Tag, 
  Zap,
  History,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  AlertCircle
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DigitalProduct | null;
  onPurchaseComplete: (record: PurchaseRecord) => void;
  onOpenPurchases: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  product,
  onPurchaseComplete,
  onOpenPurchases,
}) => {
  const [step, setStep] = useState<"payment" | "download">("payment");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState(false);
  const [copiedLicense, setCopiedLicense] = useState(false);
  const [countdown, setCountdown] = useState(900); // 15 mins
  const [licenseKey, setLicenseKey] = useState("");
  const [orderId, setOrderId] = useState("");
  const [savedRecord, setSavedRecord] = useState<PurchaseRecord | null>(null);

  // Slip Upload State
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verifiedRefCode, setVerifiedRefCode] = useState("");
  const [verifiedBankName, setVerifiedBankName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("payment");
      setCountdown(900);
      setDiscountPercent(0);
      setPromoCode("");
      setPromoSuccess(false);
      setPromoError("");
      setSlipFile(null);
      setSlipPreview(null);
      setIsVerifying(false);
      setVerificationError("");
      setVerifiedRefCode("");

      const randHex = Math.random().toString(16).substring(2, 6).toUpperCase();
      const randHex2 = Math.random().toString(16).substring(2, 6).toUpperCase();
      const newKey = `POKKY-OPT-${randHex}-${randHex2}`;
      const newOrderId = `PK-${Date.now().toString().slice(-6)}`;
      setLicenseKey(newKey);
      setOrderId(newOrderId);
      setSavedRecord(null);
    }
  }, [isOpen, product]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "payment" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen || !product) return null;

  const basePrice = product.price;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const total = basePrice - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "POKKY10") {
      setDiscountPercent(10);
      setPromoSuccess(true);
      setPromoError("");
    } else if (promoCode.trim().toUpperCase() === "ESPORTS20") {
      setDiscountPercent(20);
      setPromoSuccess(true);
      setPromoError("");
    } else {
      setPromoError("โค้ดไม่ถูกต้อง (ลองใช้: POKKY10)");
      setPromoSuccess(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setVerificationError("กรุณาเลือกไฟล์รูปภาพสลิป (.jpg, .png)");
        return;
      }
      setSlipFile(file);
      setVerificationError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSlip = () => {
    setSlipFile(null);
    setSlipPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVerifyAndSubmitSlip = async () => {
    if (!slipFile) {
      setVerificationError("กรุณาแนบรูปภาพสลิปการโอนเงินก่อนกดตรวจสอบ");
      return;
    }

    setIsVerifying(true);
    setVerificationError("");

    try {
      const formData = new FormData();
      formData.append("slip", slipFile);
      formData.append("orderId", orderId);
      formData.append("amount", total.toString());
      formData.append("productName", product.name);

      const response = await fetch("/api/verify-slip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.verified) {
        setVerifiedRefCode(data.record?.refCode || "VERIFIED-OK");
        setVerifiedBankName(data.record?.bankName || "ระบบพร้อมเพย์ (PromptPay)");

        const record: PurchaseRecord = {
          orderId,
          productId: product.id,
          productName: product.name,
          version: product.version,
          fileFormat: product.fileFormat,
          fileSize: product.fileSize,
          price: total,
          purchaseDate: new Date().toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          licenseKey,
          includedFiles: product.includedFiles,
        };

        saveStoredPurchase(record);
        setSavedRecord(record);
        onPurchaseComplete(record);

        // Transition to download step
        setStep("download");
      } else {
        setVerificationError(data.message || "การตรวจสอบสลิปล้มเหลว กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setVerificationError("เชื่อมต่อระบบตรวจสอบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyLicense = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopiedLicense(true);
    setTimeout(() => setCopiedLicense(false), 2000);
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTimer = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface border border-surface-border shadow-2xl my-8 overflow-hidden">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-card">
          <div className="flex items-center gap-2 font-mono text-xs text-brand-cyan">
            <Zap className="w-4 h-4" />
            <span className="font-bold text-white uppercase">
              {step === "payment" ? "สแกนชำระเงิน & แนบสลิปเพื่อตรวจสอบ" : "ดาวน์โหลดไฟล์คำสั่งซื้อ"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-surface-border/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {/* STEP 1: PAYMENT & SLIP UPLOAD */}
          {step === "payment" && (
            <div className="space-y-6">
              
              {/* Product Info & Price Summary */}
              <div className="p-4 rounded-xl bg-surface-card border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan mb-1">
                    <FileCode2 className="w-3.5 h-3.5" />
                    <span>{product.fileFormat} • {product.fileSize}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{product.version}</span>
                  </div>
                  <div className="text-sm sm:text-base font-bold text-white font-mono">
                    {product.name}
                  </div>
                </div>

                <div className="text-right sm:shrink-0">
                  <div className="text-[11px] font-mono text-slate-400">ยอดที่ต้องโอน:</div>
                  <div className="flex items-baseline gap-2 justify-end">
                    {discountAmount > 0 && (
                      <span className="text-xs font-mono text-slate-500 line-through">
                        ฿{basePrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-2xl font-black font-mono text-green-400">
                      ฿{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="ใส่โค้ดส่วนลด (เช่น POKKY10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-surface-card border border-surface-border text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-green-400 uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-surface border border-surface-border text-xs font-mono text-slate-200 hover:text-white hover:border-slate-500"
                  >
                    ใช้โค้ด
                  </button>
                </div>
                {promoSuccess && (
                  <span className="text-[11px] font-mono text-brand-emerald flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    ใช้ส่วนลด {discountPercent}% สำเร็จ (-฿{discountAmount})
                  </span>
                )}
                {promoError && (
                  <span className="text-[11px] font-mono text-red-400 text-xs">
                    {promoError}
                  </span>
                )}
              </form>

              {/* Real PromptPay QR Code Display */}
              <div className="p-5 rounded-2xl bg-[#0d0f17] border border-white/10 text-center flex flex-col items-center justify-center">
                
                {/* Official User QR Code Image */}
                <div className="p-2 bg-white rounded-xl shadow-2xl inline-block mb-3 border border-slate-200">
                  <img
                    src="/promptpay-qr.jpg"
                    alt="Thai QR Payment - PromptPay"
                    className="w-52 sm:w-60 h-auto object-contain rounded-lg"
                  />
                </div>

                <div className="text-xs font-mono text-slate-300 font-semibold mb-1">
                  ชื่อบัญชี: ด.ช. ณัฐชนนท์ อ้อยหวาน (พร้อมเพย์)
                </div>
                <div className="text-[11px] font-mono text-slate-400 mb-2">
                  โอนยอดเงินจำนวน <span className="text-green-400 font-bold text-sm">฿{total.toLocaleString()}</span> บาท
                </div>
                <div className="text-[11px] font-mono text-brand-amber flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  กรุณาโอนและแนบสลิปภายใน: {formattedTimer} นาที
                </div>
              </div>

              {/* Slip Upload & Attachment Area */}
              <div className="p-4 rounded-xl bg-surface-card border border-surface-border space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-green-400" />
                    แนบสลิปการโอนเงินเพื่อตรวจสอบ:
                  </span>
                  <span className="text-[10px] text-slate-400">รองรับรูปภาพ .JPG, .PNG</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="slip-upload-input"
                />

                {!slipPreview ? (
                  <label
                    htmlFor="slip-upload-input"
                    className="border-2 border-dashed border-white/15 hover:border-green-400/60 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-medium text-slate-200 mb-1">
                      คลิกเพื่อเลือกไฟล์รูปภาพสลิปของคุณ
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      หรือลากไฟล์ภาพสลิปมาวางที่นี่
                    </span>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-white/10">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <img
                        src={slipPreview}
                        alt="Slip Preview"
                        className="h-12 w-12 object-cover rounded-md border border-white/10 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-mono font-bold text-white truncate max-w-xs">
                          {slipFile?.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          ขนาด: {slipFile ? (slipFile.size / 1024).toFixed(1) + " KB" : ""}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveSlip}
                      className="px-2.5 py-1 rounded text-xs font-mono text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      เปลี่ยนรูป
                    </button>
                  </div>
                )}

                {verificationError && (
                  <div className="flex items-start gap-2.5 text-xs text-red-300 font-mono p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{verificationError}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  disabled={isVerifying || !slipFile}
                  onClick={handleVerifyAndSubmitSlip}
                  className={`px-7 py-3 rounded-lg text-xs font-mono font-bold text-slate-950 flex items-center gap-2 transition-all shadow-lg ${
                    isVerifying || !slipFile
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-green-400 hover:bg-green-300 shadow-green-950/40"
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      กำลังส่งสลิปเพื่อตรวจสอบ...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      ส่งสลิปเพื่อตรวจสอบและรับไฟล์ทันที
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 2: INSTANT DOWNLOAD CENTER (UNLOCKED AFTER SLIP VERIFIED) */}
          {step === "download" && (
            <div className="space-y-6 text-center">
              
              <div className="h-16 w-16 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold font-mono text-white mb-1">
                  ตรวจสอบสลิปสำเร็จ! ไฟล์พร้อมดาวน์โหลด
                </h3>
                <p className="text-xs text-slate-400">
                  {verifiedBankName} • รหัสคำสั่งซื้อ: <strong className="text-brand-cyan font-mono">{orderId}</strong>
                </p>
                <div className="text-[11px] font-mono text-green-400 mt-0.5">
                  เลขอ้างอิงสลิป: {verifiedRefCode}
                </div>
              </div>

              {/* License Key Box */}
              <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-left max-w-md mx-auto space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-brand-amber" />
                    LICENSE KEY ประจำตัวคุณ:
                  </span>
                  <button
                    onClick={handleCopyLicense}
                    className="text-brand-cyan hover:underline flex items-center gap-1"
                  >
                    {copiedLicense ? <Check className="w-3.5 h-3.5 text-brand-emerald" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLicense ? "คัดลอกแล้ว" : "คัดลอก"}
                  </button>
                </div>
                <div className="p-2.5 rounded bg-surface border border-surface-border font-mono text-sm text-center text-white font-black tracking-widest selection:bg-green-500 selection:text-slate-950">
                  {licenseKey}
                </div>
              </div>

              {/* Direct Download Button */}
              <div className="py-2">
                <button
                  onClick={() => savedRecord && triggerDownload(savedRecord)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-mono font-black text-slate-950 bg-green-400 hover:bg-green-300 shadow-xl transition-all"
                >
                  <Download className="w-5 h-5" />
                  คลิกเพื่อดาวน์โหลดไฟล์ ({product.fileFormat})
                </button>
                <span className="block text-[11px] font-mono text-slate-500 mt-2">
                  (เบราว์เซอร์จะดาวน์โหลดชุดสคริปต์และคู่มือทันที)
                </span>
              </div>

              {/* Saved in Purchase History Notification */}
              <div className="p-3.5 rounded-xl bg-surface-card border border-surface-border/70 flex items-center justify-between text-xs font-mono text-slate-300 max-w-md mx-auto">
                <div className="flex items-center gap-2 text-left">
                  <History className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-[11px]">บันทึกไว้ใน "ประวัติการซื้อ" ของคุณแล้ว</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenPurchases();
                  }}
                  className="text-green-400 hover:underline text-xs shrink-0 font-semibold"
                >
                  เปิดดูประวัติ &rarr;
                </button>
              </div>

              {/* Quick Setup Instructions */}
              <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-left font-mono text-xs space-y-2 max-w-lg mx-auto">
                <div className="text-white font-bold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-brand-cyan" />
                  ขั้นตอนการนำไฟล์ไปใช้งาน:
                </div>
                <div className="text-slate-300 text-[11px] space-y-1">
                  <p>1. แตกไฟล์ .ZIP ไปไว้ที่หน้า Desktop หรือโฟลเดอร์ในเครื่อง</p>
                  <p>2. คลิกขวาที่ไฟล์ <strong>01_System_Snapshot_Backup.bat</strong> แล้วเลือก <strong>"Run as administrator"</strong></p>
                  <p>3. รันไฟล์ตามลำดับตัวเลข 02 ถึง 06 แล้วรีสตาร์ตเครื่อง 1 ครั้ง</p>
                  <p className="text-green-400 pt-1 font-semibold">* มีไฟล์ REVERT_ALL_DEFAULT_SETTINGS.bat สำรองไว้ให้คืนค่าเดิมได้ตลอดเวลา</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white border border-surface-border"
                >
                  ปิดหน้าต่าง
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
