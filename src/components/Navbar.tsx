"use client";

import React from "react";
import { Search } from "lucide-react";

interface NavbarProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearchChange,
  searchQuery,
}) => {
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

        {/* Minimal Search Bar */}
        <div className="flex-1 max-w-sm lg:max-w-md mx-2 hidden sm:block">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาไฟล์หรือสคริปต์แจกฟรี..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs sm:text-sm font-sans text-white placeholder-slate-400 focus:outline-none focus:border-green-400/80 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://discord.gg/eHa8MQu7mz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-3.5 sm:px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 hover:border-[#5865F2]/60 transition-all shadow-sm group"
          >
            <img src="/discord-logo.png" alt="Discord" className="h-5 sm:h-5.5 w-auto object-contain group-hover:scale-110 transition-transform drop-shadow" />
            <span>Discord ชุมชน</span>
          </a>
        </div>

      </div>
    </header>
  );
};
