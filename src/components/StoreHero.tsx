"use client";

import React from "react";
import { ShieldCheck, Download, RotateCcw, ArrowDown, HelpCircle, Sparkles } from "lucide-react";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { DiscordUser } from "@/types";

interface StoreHeroProps {
  onOpenAiChat?: () => void;
  currentUser?: DiscordUser | null;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ onOpenAiChat, currentUser }) => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDiscordLogin = () => {
    const returnUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
    window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  return (
    <section className="pt-8 pb-4 sm:pt-14 sm:pb-8 text-center max-w-5xl mx-auto px-4 sm:px-6 relative">
      
      {/* Live Esports Status Pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs sm:text-sm font-mono text-emerald-400 mb-5 shadow-sm">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="font-semibold tracking-wide">
          POKKY STOZY • อัปเดตแพตช์ 2026 • โหลดฟรี 100%
        </span>
      </div>

      {/* Clean, High-Contrast Typography */}
      <div className="relative mb-5">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
          ศูนย์รวมไฟล์และสคริปต์
          <span className="block text-emerald-400 mt-1">Optimize PC แจกฟรี</span>
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xs sm:text-base text-slate-300 font-sans leading-relaxed">
          ยกระดับประสิทธิภาพ Windows และ Gaming PC สำหรับผู้เล่นสายแข่งขัน ลดค่า DPC Latency เพิ่มความเสถียรของเฟรมเรต เข้าสู่ระบบด้วย Discord เพื่อดาวน์โหลดฟรี
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 mb-8">
        {!currentUser && (
          <button
            onClick={handleDiscordLogin}
            className="py-3 px-6 rounded-xl font-bold text-xs sm:text-sm font-sans text-white bg-[#5865F2] hover:bg-[#4752C4] border border-[#7289da]/60 transition-all flex items-center gap-2.5 shadow-lg shadow-[#5865F2]/25 cursor-pointer active:scale-95"
          >
            <DiscordIcon className="w-4 h-4 text-white shrink-0" />
            <span>เข้าสู่ระบบ Discord เพื่อโหลดฟรี</span>
          </button>
        )}
        <button
          onClick={() => scrollToSection("products")}
          className="py-3 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm font-sans text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95"
        >
          <ArrowDown className="w-4 h-4" />
          <span>เลือกดูแพ็กเกจทั้งหมด</span>
        </button>
        <button
          onClick={onOpenAiChat}
          className="py-3 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm font-sans text-emerald-300 bg-white/5 hover:bg-white/10 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>ปรึกษา Gemini AI</span>
        </button>
        <button
          onClick={() => scrollToSection("faqs")}
          className="py-3 px-4 sm:px-5 rounded-xl font-semibold text-xs sm:text-sm font-sans text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>วิธีใช้งาน & FAQ</span>
        </button>
      </div>

      {/* 3 Value Proposition Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 hover:border-emerald-400/40 transition-colors">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">ปลอดภัย ไร้ไวรัส</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">เปิดตรวจดูคำสั่ง Source Code ด้วย Notepad ได้โปร่งใสทุกบรรทัด</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 hover:border-[#5865F2]/40 transition-colors">
          <div className="p-2 rounded-lg bg-[#5865F2]/10 text-[#5865F2] shrink-0 mt-0.5">
            <DiscordIcon className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white font-sans">ยืนยันตัวตนด้วย Discord</h4>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">ล็อกอินด้วย Discord เพื่อดาวน์โหลดฟรี ป้องกันบอทและสแปม</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-3 hover:border-emerald-400/40 transition-colors">
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
