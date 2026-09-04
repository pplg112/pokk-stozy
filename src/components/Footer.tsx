"use client";

import React from "react";


export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-8 sm:py-10 text-slate-400 text-sm font-sans bg-[#06070a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand with Logo */}
        <div className="flex items-center gap-3.5">
          <img
            src="/logo.png"
            alt="Pokky Optimize"
            className="h-10 sm:h-11 w-auto object-contain drop-shadow"
          />
          <div>
            <div className="font-extrabold text-sm sm:text-base text-white font-sans tracking-wide">
              POKKY OPTIMIZE
            </div>
            <div className="text-xs text-slate-400">
              ศูนย์รวมสคริปต์ปรับแต่งคอมพิวเตอร์ระดับ Esports ปลอดภัย 100% มีไฟล์ Revert
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a 
            href="https://discord.gg/eHa8MQu7mz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium group"
          >
            <img src="/discord-logo.png" alt="Discord" className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" />
            Discord Community
          </a>
          <span className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Pokky Optimize.</span>
        </div>

      </div>
    </footer>
  );
};
