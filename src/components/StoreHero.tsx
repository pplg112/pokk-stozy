"use client";

import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Download, 
  RotateCcw, 
  Cpu, 
  Activity, 
  Wifi, 
  ArrowRight,
  Sparkles,
  Layers
} from "lucide-react";

export const StoreHero: React.FC = () => {
  const scrollToCatalog = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="pt-8 pb-8 sm:pt-14 sm:pb-12 text-center max-w-5xl mx-auto px-4 sm:px-6 relative">
      
      {/* Live Esports Status Pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/15 border border-green-500/30 text-xs sm:text-sm font-mono text-green-300 mb-5 shadow-lg shadow-green-950/20 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
        </span>
        <span className="font-semibold tracking-wide">
          POKKY OPTIMIZE HUB • อัปเดตแพตช์ 2026 • แจกฟรี 100% ไม่มีค่าบริการ
        </span>
      </div>

      {/* Dynamic Headline with Glow */}
      <div className="relative mb-5">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
          <span className="block text-slate-100 mb-1.5 font-bold">
            ศูนย์รวมไฟล์และสคริปต์
          </span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 drop-shadow-[0_0_35px_rgba(74,222,128,0.35)] whitespace-nowrap">
            Optimize PC แจกฟรี
          </span>
        </h1>
      </div>
      
      {/* Subtitle */}
      <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto mb-7 leading-relaxed font-normal">
        รวมสคริปต์ปรับแต่ง Windows Kernel, ลด DPC Latency, เพิ่มความนิ่ง Frametime และโปรไฟล์ฮาร์ดแวร์ระดับนักแข่ง 
        ปลอดภัย 100% เปิดอ่านโค้ดได้ทุกบรรทัด พร้อมสคริปต์ Revert กู้คืนค่าเดิมทุกชุด
      </p>

      {/* Hero Interactive CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10">
        <button
          onClick={scrollToCatalog}
          className="px-6 py-3.5 rounded-2xl font-mono font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-green-400 to-emerald-300 hover:from-green-300 hover:to-emerald-200 transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 flex items-center gap-2.5 cursor-pointer"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>เลือกดูไฟล์และดาวน์โหลดฟรี</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <a
          href="https://discord.gg/eHa8MQu7mz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3.5 rounded-2xl font-sans font-semibold text-xs sm:text-sm text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 transition-all flex items-center gap-2.5 shadow-sm hover:-translate-y-0.5"
        >
          <img src="/discord-logo.png" alt="Discord" className="h-5 w-auto object-contain" />
          <span>เข้าร่วม Discord ชุมชน</span>
        </a>
      </div>

      {/* 4 Esports Feature Metric Cards (Glassmorphism & Neon Glow) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
        <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-green-400/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-green-950/20">
          <div className="p-2 w-fit rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 mb-2.5 group-hover:scale-110 transition-transform">
            <Cpu className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-white font-sans">
            FPS & Kernel Boost
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-0.5 leading-normal">
            จัดสรร CPU ให้เกมสำคัญสูงสุด ลด Frametime Stutter
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-cyan-400/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-950/20">
          <div className="p-2 w-fit rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-2.5 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-white font-sans">
            0.5ms Timer Precision
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-0.5 leading-normal">
            ลด Input Delay ของเมาส์และคีย์บอร์ดในเกม FPS
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-indigo-400/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-950/20">
          <div className="p-2 w-fit rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-2.5 group-hover:scale-110 transition-transform">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-white font-sans">
            Bufferbloat & TCP Fix
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-0.5 leading-normal">
            ปิด Nagle Algorithm ส่งข้อมูลสกิลทันที ปิงนิ่งไม่พุ่ง
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/40 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-950/20">
          <div className="p-2 w-fit rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-2.5 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs sm:text-sm font-bold text-white font-sans">
            100% Safe & Revert
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-sans mt-0.5 leading-normal">
            สร้าง Restore Point สำรอง มีสคริปต์คืนค่าเดิมทุกชุด
          </p>
        </div>
      </div>

    </section>
  );
};
