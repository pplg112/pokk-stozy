"use client";

import React from "react";
import { MessageSquare } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 py-12 text-slate-400 text-sm font-sans bg-[#06070a]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand with Logo */}
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Pokky Optimize"
            className="h-12 sm:h-14 w-auto object-contain drop-shadow"
          />
          <div>
            <div className="font-extrabold text-base sm:text-lg text-white font-sans tracking-wide">
              POKKY OPTIMIZE
            </div>
            <div className="text-xs sm:text-sm text-slate-400">
              ศูนย์รวมสคริปต์ปรับแต่งคอมพิวเตอร์ระดับ Esports ปลอดภัย 100% มีไฟล์ Revert
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a 
            href="https://discord.gg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-200 hover:text-white flex items-center gap-2 transition-colors px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-medium"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            Discord Community
          </a>
          <a
            href="/admin"
            className="text-slate-500 hover:text-green-400 transition-colors px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/15 text-xs font-mono"
          >
            ระบบแอดมิน (Admin)
          </a>
          <span className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Pokky Optimize.</span>
        </div>

      </div>
    </footer>
  );
};
