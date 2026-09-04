"use client";

import React, { useState, useEffect } from "react";
import { DigitalProduct, DownloadRecord } from "@/types";
import { recordFreeDownload } from "@/utils/storage";
import { ADS_CONFIG } from "@/config/ads";
import { AdBanner } from "./AdBanner";
import { 
  X, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  FileCode2, 
  Layers,
  Terminal,
  Clock,
  Sparkles,
  Loader2
} from "lucide-react";

interface FreeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DigitalProduct | null;
  onDownloadComplete: (record: DownloadRecord) => void;
}

export const FreeDownloadModal: React.FC<FreeDownloadModalProps> = ({
  isOpen,
  onClose,
  product,
  onDownloadComplete,
}) => {
  const [step, setStep] = useState<"initial" | "preparing" | "completed">("initial");
  const [countdown, setCountdown] = useState(ADS_CONFIG.downloadMonetization.countdownSeconds || 5);
  const [downloadId, setDownloadId] = useState("");

  const executeDownload = (prod: DigitalProduct) => {
    // 1. Trigger actual browser download from API
    const link = document.createElement("a");
    link.href = `/api/download/${prod.id}`;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Log local download record
    const record = recordFreeDownload(prod);
    setDownloadId(record.downloadId);
    onDownloadComplete(record);
    setStep("completed");

    // 3. Optional monetization SmartLink
    if (ADS_CONFIG.downloadMonetization.openSmartLinkOnDownload && ADS_CONFIG.downloadMonetization.smartLinkUrl) {
      try {
        window.open(ADS_CONFIG.downloadMonetization.smartLinkUrl, "_blank", "noopener,noreferrer");
      } catch {
        // Popups handled safely
      }
    }
  };

  // Countdown timer effect during "preparing" step
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "preparing") {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);
      } else {
        // Countdown reached 0: execute real download
        if (product) {
          executeDownload(product);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [step, countdown, product, onDownloadComplete]);

  if (!isOpen || !product) return null;

  const handleStartPreparation = () => {
    setCountdown(ADS_CONFIG.downloadMonetization.countdownSeconds || 5);
    setStep("preparing");
  };

  const handleManualTrigger = () => {
    if (product) {
      executeDownload(product);
    }
  };

  const handleDownloadRevert = () => {
    if (product) {
      const link = document.createElement("a");
      link.href = `/api/download/${product.id}?type=revert`;
      link.setAttribute("download", "");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setStep("initial");
    setCountdown(ADS_CONFIG.downloadMonetization.countdownSeconds || 5);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl sm:max-w-2xl rounded-2xl bg-[#0e1017] border border-white/15 shadow-2xl my-4 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-green-400 font-bold">
            <Download className="w-4 h-4" />
            <span className="text-white uppercase tracking-wider">
              ดาวน์โหลดสคริปต์ปรับแต่งฟรี
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Product Header */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-300 font-semibold">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{product.fileFormat} • {product.fileSize}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{product.version}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white font-sans">
                {product.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                {product.tagline}
              </p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 rounded-lg bg-green-500/20 text-green-400 font-mono text-xs sm:text-sm font-bold shrink-0 border border-green-500/40">
              ฟรี 100%
            </span>
          </div>

          {/* STEP 1: INITIAL DETAILS & START BUTTON */}
          {step === "initial" && (
            <>
              {/* Safety & Instructions Alert */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2 text-xs sm:text-sm font-sans">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>คำแนะนำเพื่อความปลอดภัยสูงสุด:</span>
                </div>
                <ul className="space-y-1.5 text-slate-200 pl-5 list-disc text-xs sm:text-sm leading-relaxed">
                  <li>สคริปต์ทุกตัวสามารถเปิดดู Source Code ด้วย Notepad ได้ก่อนรัน</li>
                  <li>ระบบมีคำสั่งสร้าง <strong className="text-white">System Restore Point</strong> สำรองอัตโนมัติ</li>
                  <li>มีไฟล์ <strong className="text-white">Revert Script</strong> แนบให้คืนค่าเดิมได้ตลอดเวลา</li>
                  <li>คลิกขวาที่ไฟล์แล้วเลือก <strong className="text-white">"Run as administrator"</strong> เพื่อใช้งาน</li>
                </ul>
              </div>

              {/* Included Files Snippet */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm sm:text-base font-mono text-slate-300 font-semibold">
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-green-400" />
                    ไฟล์ในแพ็กเกจ ({product.includedFiles.length} ไฟล์):
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-normal">รองรับ {product.compatibility}</span>
                </div>
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {product.includedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm font-mono flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 text-slate-200 truncate">
                        <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate font-medium">{file.filename}</span>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0 hidden sm:inline">
                        {file.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start Preparation Button */}
              <button
                onClick={handleStartPreparation}
                className="w-full py-4 sm:py-5 px-8 rounded-2xl font-bold font-mono text-base sm:text-lg text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-green-500/25 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>คลิกเพื่อเริ่มดาวน์โหลดทันที (ฟรี 100%)</span>
              </button>
            </>
          )}

          {/* STEP 2: PREPARING DOWNLOAD (5s AD MONETIZATION & COUNTDOWN) */}
          {step === "preparing" && (
            <div className="space-y-6 py-2">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center space-y-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto flex items-center justify-center">
                  {/* Glowing countdown circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-pulse bg-green-500/10" />
                  <div className="text-4xl sm:text-5xl font-black font-mono text-green-400">
                    {countdown}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-white font-sans flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
                    <span>กำลังจัดเตรียมแพ็กเกจสคริปต์ความเร็วสูง...</span>
                  </h4>
                  <p className="text-sm sm:text-base text-slate-300 mt-1.5">
                    กรุณารอสักครู่ ({countdown} วินาที) ระบบกำลังประมวลผลไฟล์ที่ปลอดภัยสำหรับเครื่องของคุณ
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden max-w-sm mx-auto">
                  <div 
                    className="h-full bg-green-400 transition-all duration-1000 ease-linear rounded-full"
                    style={{ width: `${((ADS_CONFIG.downloadMonetization.countdownSeconds - countdown) / ADS_CONFIG.downloadMonetization.countdownSeconds) * 100}%` }}
                  />
                </div>
              </div>

              {/* Strategic High-Viewability Monetization Banner */}
              <AdBanner slot="modal" />

              {/* Manual download button if countdown finishes */}
              {countdown === 0 && (
                <button
                  onClick={handleManualTrigger}
                  className="w-full py-4 px-8 rounded-2xl font-bold font-mono text-base sm:text-lg text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-green-500/30 animate-bounce cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>ไฟล์พร้อมแล้ว! คลิกดาวน์โหลดทันที</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 3: DOWNLOAD COMPLETED */}
          {step === "completed" && (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500/40 mx-auto flex items-center justify-center shadow-lg shadow-green-500/20">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>

              <div>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                  ดาวน์โหลดไฟล์สำเร็จแล้ว!
                </h4>
                <p className="text-sm sm:text-base text-slate-300 mt-2">
                  ระบบได้สร้างไฟล์สคริปต์และเริ่มดาวน์โหลดลงเครื่องของคุณแล้ว
                </p>
                <div className="mt-3 inline-block px-4 py-1.5 rounded-xl bg-white/5 text-xs sm:text-sm font-mono text-slate-300 border border-white/10">
                  รหัสดาวน์โหลด: {downloadId}
                </div>
              </div>

              {/* Quick Steps */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-left text-sm sm:text-base font-sans space-y-3">
                <div className="text-green-400 font-bold font-mono text-base">ขั้นตอนถัดไปเพื่อเริ่มใช้งาน:</div>
                <div className="text-slate-200 space-y-2 text-sm sm:text-base leading-relaxed">
                  <div>1. เปิดโฟลเดอร์ <strong>Downloads</strong> ในเครื่องคอมพิวเตอร์ของคุณ</div>
                  <div>2. คลิกขวาที่ไฟล์สคริปต์ แล้วเลือก <strong>"Run as administrator"</strong></div>
                  <div>3. รีสตาร์ตเครื่องคอมพิวเตอร์ 1 ครั้งเพื่อใช้งานการปรับแต่งอย่างเต็มประสิทธิภาพ</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleManualTrigger}
                    className="py-3.5 px-4 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลดสคริปต์หลักอีกครั้ง
                  </button>
                  <button
                    onClick={handleDownloadRevert}
                    className="py-3.5 px-4 rounded-xl text-xs sm:text-sm font-mono font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    ดาวน์โหลด Revert (คืนค่าเดิม)
                  </button>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  เสร็จสิ้น
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
