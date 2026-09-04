"use client";

import React from "react";
import { Zap, ShieldCheck, Download, RotateCcw } from "lucide-react";

export const StoreHero: React.FC = () => {
  return (
    <section className="pt-8 pb-6 sm:pt-12 sm:pb-8 text-center max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Subtle Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-xs sm:text-sm font-mono text-green-400 mb-4 shadow-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
        <span className="font-semibold">แจกฟรี 100% • ดาวน์โหลดไฟล์ไปรันเองได้ทันที ไม่ต้องรอคิว</span>
      </div>

      {/* Clean Headline */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-normal text-white mb-4 leading-snug sm:leading-tight">
        ศูนย์รวมไฟล์และสคริปต์ <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400">Optimize PC</span> แจกฟรี
      </h1>
      
      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mb-6 leading-relaxed font-normal">
        ไฟล์สคริปต์ปรับแต่ง Windows Kernel, ลด DPC Latency, เพิ่มความนิ่ง Frametime และโปรไฟล์ฮาร์ดแวร์ระดับนักแข่ง 
        ปลอดภัย 100% เปิดอ่านโค้ดได้ก่อนรัน พร้อมสคริปต์ Revert คืนค่าเดิมทุกชุด
      </p>

      {/* 3 Clean Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-slate-300 font-sans">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
          <Download className="w-4 h-4 text-green-400 shrink-0" />
          <span className="text-white font-medium">ฟรี 100% ไม่มีค่าบริการ</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-white font-medium">ปลอดภัย เปิดตรวจโค้ดได้</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10">
          <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-white font-medium">มีสคริปต์กู้คืนค่าเดิมทุกไฟล์</span>
        </div>
      </div>

    </section>
  );
};
