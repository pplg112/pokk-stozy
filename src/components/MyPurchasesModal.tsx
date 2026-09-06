"use client";

import React from "react";
import { DownloadRecord, PurchaseRecord } from "@/types";
import { triggerDownload, clearStoredDownloads } from "@/utils/storage";
import { 
  X, 
  Download, 
  History, 
  Calendar, 
  Trash2
} from "lucide-react";

interface MyPurchasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: (DownloadRecord | PurchaseRecord)[];
  onClearHistory?: () => void;
}

export const MyPurchasesModal: React.FC<MyPurchasesModalProps> = ({
  isOpen,
  onClose,
  purchases,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  const [showConfirmClear, setShowConfirmClear] = React.useState(false);

  const handleConfirmClear = () => {
    clearStoredDownloads();
    if (onClearHistory) onClearHistory();
    setShowConfirmClear(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto font-sans">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0e1017] border border-white/10 shadow-2xl my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2 font-mono text-xs text-green-400">
            <History className="w-4 h-4" />
            <span className="font-bold text-white uppercase tracking-wider">
              ประวัติการดาวน์โหลดไฟล์ของฉัน ({purchases.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-4">
          
          {purchases.length > 0 ? (
            purchases.map((rec) => {
              const id = "downloadId" in rec ? rec.downloadId : "orderId" in rec ? rec.orderId : "DL";
              const date = "downloadDate" in rec ? rec.downloadDate : "purchaseDate" in rec ? rec.purchaseDate : "ก่อนหน้า";

              return (
                <div
                  key={id}
                  className="p-5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-green-500/30"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-green-400 font-semibold text-[11px]">
                        {rec.fileFormat} • {rec.fileSize}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">รหัสดาวน์โหลด: <strong className="text-white">{id}</strong></span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {date}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white font-mono">
                      {rec.productName}
                    </h4>

                    <div className="text-[11px] font-mono text-slate-400">
                      สถานะ: <span className="text-green-400 font-semibold">แจกฟรี 100% (ดาวน์โหลดซ้ำได้ตลอดเวลา)</span>
                    </div>
                  </div>

                  {/* Direct Re-Download Button */}
                  <div className="shrink-0 pt-2 md:pt-0">
                    <button
                      onClick={() => triggerDownload(rec)}
                      className="w-full md:w-auto py-2.5 px-4 rounded-lg text-xs font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/15"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลดอีกครั้ง
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 font-mono text-xs text-slate-400 space-y-3">
              <History className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm text-slate-300">ยังไม่มีประวัติการดาวน์โหลดไฟล์บนอุปกรณ์นี้</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                เมื่อคุณกดดาวน์โหลดไฟล์หรือสคริปต์จากหน้าเว็บ ระบบจะบันทึกรายการไว้ที่นี่อัตโนมัติเพื่อให้คุณกลับมากดโหลดซ้ำได้ทันที
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-all"
                >
                  เลือกดูไฟล์และสคริปต์แจกฟรี
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-xs font-mono text-slate-400">
          {purchases.length > 0 ? (
            showConfirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-sans text-xs">ยืนยันล้างประวัติ?</span>
                <button
                  onClick={handleConfirmClear}
                  className="px-2.5 py-1 rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/40 transition-colors cursor-pointer font-sans text-xs font-semibold"
                >
                  ล้างทันที
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className="px-2.5 py-1 rounded bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer font-sans text-xs"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างประวัติ</span>
              </button>
            )
          ) : (
            <span>ไฟล์ทั้งหมดแจกฟรี ไม่มีค่าใช้จ่าย</span>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            ปิด
          </button>
        </div>

      </div>
    </div>
  );
};
