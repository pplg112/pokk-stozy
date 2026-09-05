"use client";

import React from "react";

import Link from "next/link";
import { Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { DiscordUser } from "@/types";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onOpenAiChat?: () => void;
  currentUser?: DiscordUser | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiChat,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/95 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo with User's Official Artwork & Site Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group py-1">
          <img
            src="/logo.png"
            alt="Pokky Stozy"
            loading="eager"
            fetchPriority="high"
            className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_20px_rgba(74,222,128,0.35)]"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-wide text-base sm:text-xl text-white font-sans leading-tight">
                POKKY
              </span>
              <span className="font-extrabold tracking-wide text-base sm:text-xl text-green-400 font-sans leading-tight">
                STOZY
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-wider text-green-400/90 uppercase font-semibold">
              OPTIMIZE • SETTING • STORE
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            หน้าแรก
          </Link>
          <Link
            href="/#products"
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            แพ็กเกจทั้งหมด
          </Link>
          <button
            type="button"
            onClick={onOpenAiChat}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-300 bg-gradient-to-r from-green-500/15 via-emerald-500/10 to-cyan-500/15 border border-green-500/30 hover:border-green-400/60 hover:from-green-500/25 hover:to-cyan-500/25 transition-all flex items-center gap-1.5 shadow-sm group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span>ปรึกษา Gemini AI</span>
            <span className="text-[10px] bg-green-400 text-slate-950 px-1.5 py-0.2 rounded-full font-mono font-bold leading-tight">
              FREE
            </span>
          </button>
          <Link
            href="/#faqs"
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            คำถามที่พบบ่อย
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="tracking-wide text-[11px] font-semibold">SERVER: ONLINE</span>
          </div>

          {/* Discord User Profile Dropdown or Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 transition-all cursor-pointer"
              >
                <img
                  src={currentUser.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"}
                  alt={currentUser.username}
                  className="w-7 h-7 rounded-lg object-cover bg-white/5"
                />
                <span className="hidden sm:inline text-xs font-bold text-white max-w-[100px] truncate">
                  {currentUser.globalName || currentUser.username}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0e121b] border border-[#5865F2]/40 shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <span className="text-xs font-bold text-white block truncate">
                      {currentUser.globalName || currentUser.username}
                    </span>
                    <span className="text-[10px] text-[#5865F2] font-mono block">
                      Discord Member
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#5865F2]/20 hover:bg-[#5865F2]/35 border border-[#5865F2]/40 hover:border-[#5865F2]/70 transition-all cursor-pointer shadow-sm shadow-[#5865F2]/20 hover:scale-[1.02]"
              title="เข้าสู่ระบบด้วย Discord"
            >
              <img src="/discord-logo.png" alt="Discord" className="w-4 h-4 object-contain" />
              <span className="hidden sm:inline">เข้าสู่ระบบ</span>
            </button>
          )}

          <a
            href="https://discord.gg/eHa8MQu7mz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#5865F2]/25 hover:bg-[#5865F2]/40 border border-[#5865F2]/45 hover:border-[#5865F2]/75 transition-all shadow-md shadow-[#5865F2]/20 hover:shadow-[0_0_20px_rgba(88,101,242,0.4)] group hover:scale-[1.02]"
          >
            <img src="/discord-logo.png" alt="Discord" className="h-4.5 sm:h-5 w-auto object-contain group-hover:scale-110 transition-transform drop-shadow" />
            <span className="hidden md:inline">Discord ชุมชน</span>
          </a>
        </div>

      </div>
    </header>
  );
};
