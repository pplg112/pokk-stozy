"use client";

import React from "react";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/95 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo with User's Official Artwork & Site Name */}
        <a href="#" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group py-1">
          <img
            src="/logo.png"
            alt="Pokky Optimize"
            className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_15px_rgba(74,222,128,0.25)]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wide text-base sm:text-xl text-white font-sans leading-tight">
                POKKY
              </span>
              <span className="font-extrabold tracking-wide text-base sm:text-xl text-green-400 font-sans leading-tight">
                OPTIMIZE
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-green-400/90 uppercase font-semibold">
              FREE DOWNLOAD HUB
            </span>
          </div>
        </a>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <a
            href="#"
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            หน้าแรก
          </a>
          <a
            href="#products"
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            แพ็กเกจทั้งหมด
          </a>
          <a
            href="#faqs"
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            คำถามที่พบบ่อย
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="tracking-wide text-[11px] font-semibold">SERVER: ONLINE</span>
          </div>

          <a
            href="https://discord.gg/eHa8MQu7mz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-3.5 sm:px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#5865F2]/25 hover:bg-[#5865F2]/40 border border-[#5865F2]/45 hover:border-[#5865F2]/75 transition-all shadow-md shadow-[#5865F2]/20 hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] group hover:scale-[1.02]"
          >
            <img src="/discord-logo.png" alt="Discord" className="h-5 sm:h-5.5 w-auto object-contain group-hover:scale-110 transition-transform drop-shadow" />
            <span>Discord ชุมชน</span>
          </a>
        </div>

      </div>
    </header>
  );
};
