"use client";

import React, { useState } from "react";
import { TermsModal } from "./TermsModal";
import { ShieldAlert } from "lucide-react";

export const Footer: React.FC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-white/10 py-8 sm:py-10 text-slate-400 text-sm font-sans bg-[#06070a]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          {/* Brand with Logo */}
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.png"
              alt="Pokky Stozy"
              className="h-10 sm:h-11 w-auto object-contain drop-shadow"
            />
            <div>
              <div className="font-extrabold text-sm sm:text-base text-white font-sans tracking-wide">
                POKKY STOZY
              </div>
              <div className="text-xs text-slate-400">
                ศูนย์รวมสคริปต์ปรับแต่งคอมพิวเตอร์ระดับ Esports ปลอดภัย 100% มีไฟล์ Revert
              </div>
            </div>
          </div>

          {/* Links & Terms */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => setIsTermsOpen(true)}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 font-mono text-xs cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span>ข้อตกลงและข้อจำกัดความรับผิดชอบ</span>
            </button>

            <a 
              href="https://discord.gg/eHa8MQu7mz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-slate-200 hover:text-white flex items-center gap-2.5 transition-colors px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium group"
            >
              <img src="/discord-logo.png" alt="Discord" className="h-4 sm:h-4.5 w-auto object-contain group-hover:scale-110 transition-transform" />
              <span>Discord Community</span>
            </a>
            <span className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Pokky Stozy.</span>
          </div>

        </div>
      </footer>

      {/* Terms of Service & Disclaimer Modal */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
};
