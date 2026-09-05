"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, LogOut, User as UserIcon, Bot } from "lucide-react";
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [internalUser, setInternalUser] = useState<DiscordUser | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Auto-fetch user session if not controlled by parent
  useEffect(() => {
    if (currentUser === undefined) {
      fetch("/api/auth/me", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setInternalUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const effectiveUser = currentUser !== undefined ? currentUser : internalUser;

  const handleLoginClick = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal();
    } else {
      const returnUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
      window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(returnUrl)}`;
    }
  };

  const handleLogoutClick = async () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    } else {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        setInternalUser(null);
        window.location.reload();
      } catch {}
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/95 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo with User's Official Artwork & Site Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group py-1 select-none">
          <img
            src="/logo.png"
            alt="Pokky Stozy"
            loading="eager"
            fetchPriority="high"
            className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_0_20px_rgba(74,222,128,0.35)] shrink-0"
          />
          <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-extrabold tracking-wide text-base sm:text-lg text-white font-sans leading-tight">
                POKKY
              </span>
              <span className="font-extrabold tracking-wide text-base sm:text-lg text-green-400 font-sans leading-tight">
                STOZY
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono tracking-wider text-green-400/90 uppercase font-semibold whitespace-nowrap">
              OPTIMIZE • SETTING • STORE
            </span>
          </div>
        </Link>

        {/* Center Navigation Links - Uncrowded, Zero Wrapping */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
          <Link
            href="/"
            className="whitespace-nowrap shrink-0 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            หน้าแรก
          </Link>
          <Link
            href="/#products"
            className="whitespace-nowrap shrink-0 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            แพ็กเกจทั้งหมด
          </Link>
          <button
            type="button"
            onClick={onOpenAiChat}
            className="whitespace-nowrap shrink-0 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-400/50 transition-all flex items-center gap-1.5 shadow-sm group cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-400 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">ถาม Gemini AI</span>
            <span className="text-[10px] bg-green-400 text-slate-950 px-1.5 py-0.2 rounded-full font-mono font-bold leading-tight shrink-0">
              FREE
            </span>
          </button>
          <Link
            href="/#faqs"
            className="whitespace-nowrap shrink-0 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            คำถามที่พบบ่อย
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Mobile/Tablet AI Consultation Button */}
          <button
            type="button"
            onClick={onOpenAiChat}
            className="lg:hidden p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            title="ปรึกษา Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-green-400 animate-pulse" />
            <span className="hidden xs:inline whitespace-nowrap text-[11px]">ถาม AI</span>
          </button>

          {/* Server Status Badge - Only on ultra-wide screens to prevent crowding */}
          <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono text-emerald-300 whitespace-nowrap shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="tracking-wide font-semibold whitespace-nowrap">SERVER: ONLINE</span>
          </div>

          {/* Discord Community Server Link - Sleek Dark Pill */}
          <a
            href="https://discord.gg/eHa8MQu7mz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#5865F2]/40 transition-all shadow-sm group shrink-0 whitespace-nowrap"
            title="เข้าร่วม Discord คอมมูนิตี้"
          >
            <img
              src="/discord-logo.png"
              alt="Discord"
              className="w-4 h-4 object-contain group-hover:scale-110 transition-transform drop-shadow shrink-0"
            />
            <span className="hidden xl:inline whitespace-nowrap">Discord ชุมชน</span>
          </a>

          {/* Discord Auth: User Avatar Profile Dropdown OR Official Discord Login Button */}
          {effectiveUser ? (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 sm:pr-3 rounded-xl bg-[#5865F2]/15 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <img
                  src={effectiveUser.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"}
                  alt={effectiveUser.username}
                  className="w-7 h-7 rounded-lg object-cover bg-white/5 shrink-0"
                />
                <span className="hidden sm:inline text-xs font-bold text-white max-w-[110px] truncate">
                  {effectiveUser.globalName || effectiveUser.username}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0e121b] border border-[#5865F2]/40 shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <span className="text-xs font-bold text-white block truncate">
                      {effectiveUser.globalName || effectiveUser.username}
                    </span>
                    <span className="text-[10px] text-[#5865F2] font-mono block">
                      Discord Member
                    </span>
                  </div>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleLoginClick}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] border border-[#5865F2] hover:border-[#6f7bf7] transition-all shadow-md shadow-[#5865F2]/25 hover:scale-[1.02] active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              title="เข้าสู่ระบบด้วย Discord"
            >
              <img src="/discord-logo.png" alt="Discord" className="w-4 h-4 object-contain shrink-0" />
              <span className="whitespace-nowrap">เข้าสู่ระบบ Discord</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};

