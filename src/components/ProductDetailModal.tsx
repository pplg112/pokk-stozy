"use client";

import React from "react";
import { DigitalProduct } from "@/types";
import { 
  X, 
  FileCode2, 
  CheckCircle2, 
  Download, 
  Star, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Layers,
  ArrowRight
} from "lucide-react";

interface ProductDetailModalProps {
  product: DigitalProduct | null;
  onClose: () => void;
  onBuyNow: (product: DigitalProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl bg-[#0e1017] border border-white/15 shadow-2xl my-4 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-400 font-bold">
            <FileCode2 className="w-4 h-4" />
            <span className="text-white uppercase">{product.fileFormat} • {product.version}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Title & Tagline */}
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1 leading-tight">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {product.tagline}
            </p>
          </div>

          {/* Meta Specs Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[11px] mb-0.5">ขนาดไฟล์:</span>
              <span className="text-white font-bold text-sm">{product.fileSize}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs mb-1">เรตติ้งผู้ใช้:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1.5 text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs mb-1">ความเข้ากันได้:</span>
              <span className="text-white font-bold text-base">{product.compatibility}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs mb-1">การคืนสภาพเดิม:</span>
              <span className="text-green-400 font-bold text-base">100% Revert</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
            {product.description}
          </div>

          {/* Included Files Tree List */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
            <h4 className="text-sm sm:text-base font-mono font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-cyan-400" />
              รายการไฟล์ที่จะได้รับภายในแพ็กเกจ ({product.includedFiles.length} ไฟล์):
            </h4>
            <div className="space-y-3">
              {product.includedFiles.map((file, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-black/50 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-sm"
                >
                  <div className="flex items-center gap-2.5 text-cyan-300 font-semibold">
                    <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-white font-medium">{file.filename}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-400 font-sans">
                    {file.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Features & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <h5 className="text-sm sm:text-base font-mono font-bold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                จุดเด่นที่คุณจะได้รับ:
              </h5>
              <ul className="space-y-2 text-sm text-slate-200">
                {product.features.map((f, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <h5 className="text-sm sm:text-base font-mono font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                ความต้องการของระบบ:
              </h5>
              <ul className="space-y-2 text-sm text-slate-300 font-mono">
                {product.requirements.map((r, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Modal Bottom Free Download Bar */}
        <div className="p-6 sm:p-7 border-t border-white/10 bg-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="self-start sm:self-center">
            <div className="text-xs font-mono text-slate-400">สถานะแพ็กเกจ:</div>
            <div className="flex items-center gap-2.5 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-mono text-green-400">
                แจกฟรี 100%
              </span>
              <span className="text-xs sm:text-sm font-mono text-slate-400">
                (ดาวน์โหลดได้ทันที)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="py-3.5 px-5 rounded-xl text-sm font-mono text-slate-300 hover:text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={() => {
                onClose();
                onBuyNow(product);
              }}
              className="flex-1 sm:flex-initial py-3.5 px-8 rounded-xl text-sm sm:text-base font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-green-500/25 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              ดาวน์โหลดไฟล์นี้ฟรีทันที
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
