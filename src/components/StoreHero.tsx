"use client";

import React from "react";
import { Zap, ShieldCheck, Download, RotateCcw } from "lucide-react";

export const StoreHero: React.FC = () => {
  return (
    <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 text-center max-w-5xl mx-auto px-6">
      
      {/* Subtle Badge */}
      <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-sm sm:text-base font-mono text-green-400 mb-6 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-semibold">แจกฟรี 100% • ดาวน์โหลดไฟล์ไปรันเองได้ทันที ไม่ต้องรอคิว</span>
      </div>

      {/* Clean Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-5 leading-tight">
        ศูนย์รวมไฟล์และสคริปต์ <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400">Optimize PC</span> แจกฟรี
      </h1>
      
      {/* Subtitle */}
      <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
        ไฟล์สคริปต์ปรับแต่ง Windows Kernel, ลด DPC Latency, เพิ่มความนิ่ง Frametime และโปรไฟล์ฮาร์ดแวร์ระดับนักแข่ง 
        ปลอดภัย 100% เปิดอ่านโค้ดได้ก่อนรัน พร้อมสคริปต์ Revert คืนค่าเดิมทุกชุด
      </p>

      {/* 3 Clean Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-sm sm:text-base text-slate-300 font-sans">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10">
          <Download className="w-5 h-5 text-green-400 shrink-0" />
          <span className="text-white font-medium">ฟรี 100% ไม่มีค่าบริการ</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-white font-medium">ปลอดภัย เปิดตรวจโค้ดได้</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10">
          <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-white font-medium">มีสคริปต์กู้คืนค่าเดิมทุกไฟล์</span>
        </div>
      </div>

    </section>
  );
};
