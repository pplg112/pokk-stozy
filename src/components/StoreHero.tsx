"use client";

import React from "react";
import { ShieldCheck, Download, RotateCcw, ArrowDown, HelpCircle, Sparkles } from "lucide-react";

interface StoreHeroProps {
  onOpenAiChat?: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ onOpenAiChat }) => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-8 pb-4 sm:pt-14 sm:pb-8 text-center max-w-5xl mx-auto px-4 sm:px-6 relative">
      
      {/* Live Esports Status Pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/15 border border-green-500/30 text-xs sm:text-sm font-mono text-green-300 mb-5 shadow-lg shadow-green-950/20 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
        </span>
        <span className="font-semibold tracking-wide">
          POKKY STOZY HUB • อัปเดตแพตช์ 2026 • แจกฟรี 100% ไม่มีค่าบริการ
        </span>
      </div>

      {/* Dynamic Headline with Glow */}
      <div className="relative mb-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
          <span className="block text-slate-100 mb-1.5 font-bold">
            ศูนย์รวมไฟล์และสคริปต์
          </span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 drop-shadow-[0_0_35px_rgba(74,222,128,0.35)] whitespace-nowrap">
            Optimize PC แจกฟรี
          </span>
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-sans leading-relaxed">
          ยกระดับประสิทธิภาพ Windows และ Gaming PC สำหรับผู้เล่นสายแข่งขัน ลดค่า DPC Latency เพิ่มความเสถียรของเฟรมเรต ดาวน์โหลดไปใช้งานได้ฟรี 100%
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5 mb-8">
        <button
          onClick={() => scrollToSection("products")}
          className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm font-sans text-slate-950 bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 hover:from-green-300 hover:to-emerald-200 transition-all flex items-center gap-2 shadow-lg shadow-green-500/25 cursor-pointer active:scale-95"
        >
          <ArrowDown className="w-4 h-4" />
          <span>เลือกดูแพ็กเกจทั้งหมด</span>
        </button>
        <button
          onClick={onOpenAiChat}
          className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm font-sans text-emerald-300 bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/15 hover:from-green-500/25 hover:to-cyan-500/25 border border-green-500/40 hover:border-green-400 transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-md shadow-green-950/30"
        >
          <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
          <span>ปรึกษา Gemini AI</span>
        </button>
        <button
          onClick={() => scrollToSection("faqs")}
          className="py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm font-sans text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>วิธีใช้งานและคำถามพบบ่อย</span>
        </button>
      </div>

      {/* 3 Value Proposition Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
        <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-green-400/40 transition-colors">
          <div className="p-2 rounded-lg bg-green-500/10 text-green-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">ปลอดภัย ไร้ไวรัส</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">เปิดตรวจดูคำสั่ง Source Code ด้วย Notepad ได้โปร่งใสทุกบรรทัด</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-green-400/40 transition-colors">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">ดาวน์โหลดฟรี 100%</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">ไม่มีค่าบริการแอบแฝง ไม่ต้องลงทะเบียน ไม่ต้องกรอกบัตร</p>
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3 hover:border-green-400/40 transition-colors">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <RotateCcw className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">พร้อมไฟล์ Revert คืนค่า</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">มีสคริปต์กู้คืนการตั้งค่าเดิมของ Windows ให้ทุกแพ็กเกจ มั่นใจได้เสมอ</p>
          </div>
        </div>
      </div>

    </section>
  );
};
