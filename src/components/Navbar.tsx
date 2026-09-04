"use client";

import React from "react";
import { 
  Search, 
  MessageSquare 
} from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 sm:h-24 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* Brand Logo with User's Official Artwork & Site Name */}
        <a href="#" className="flex items-center gap-3.5 shrink-0 group py-1.5">
          <img
            src="/logo.png"
            alt="Pokky Optimize"
            className="h-13 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wide text-lg sm:text-2xl text-white font-sans leading-tight">
                POKKY
              </span>
              <span className="font-extrabold tracking-wide text-lg sm:text-2xl text-green-400 font-sans leading-tight">
                OPTIMIZE
              </span>
            </div>
            <span className="text-xs sm:text-sm font-mono tracking-wider text-green-400/90 uppercase font-semibold">
              FREE DOWNLOAD HUB
            </span>
          </div>
        </a>

        {/* Minimal Search Bar */}
        <div className="flex-1 max-w-md lg:max-w-lg mx-2 hidden sm:block">
          <div className="relative w-full">
            <Search className="w-4 sm:w-5 h-4 sm:h-5 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาไฟล์หรือสคริปต์แจกฟรี..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-sm sm:text-base font-sans text-white placeholder-slate-400 focus:outline-none focus:border-green-400/80 focus:bg-white/[0.08] transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold text-white bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 hover:border-indigo-500/50 transition-all shadow-sm"
          >
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Discord ชุมชน</span>
          </a>
        </div>

      </div>
    </header>
  );
};
