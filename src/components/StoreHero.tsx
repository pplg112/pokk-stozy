"use client";

import React from "react";

export const StoreHero: React.FC = () => {
  return (
    <section className="pt-8 pb-4 sm:pt-14 sm:pb-8 text-center max-w-5xl mx-auto px-4 sm:px-6 relative">
      
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
      <div className="relative">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight">
          <span className="block text-slate-100 mb-1.5 font-bold">
            ศูนย์รวมไฟล์และสคริปต์
          </span>
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 drop-shadow-[0_0_35px_rgba(74,222,128,0.35)] whitespace-nowrap">
            Optimize PC แจกฟรี
          </span>
        </h1>
      </div>

    </section>
  );
};
