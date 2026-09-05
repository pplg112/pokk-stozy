"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Sparkles, CheckCircle2, User, ArrowRight, Loader2 } from "lucide-react";
import { DiscordUser } from "@/types";

interface DiscordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: DiscordUser) => void;
  isDiscordConfigured?: boolean;
}

const PRESET_AVATARS = [
  "https://cdn.discordapp.com/embed/avatars/0.png",
  "https://cdn.discordapp.com/embed/avatars/1.png",
  "https://cdn.discordapp.com/embed/avatars/2.png",
  "https://cdn.discordapp.com/embed/avatars/3.png",
  "https://cdn.discordapp.com/embed/avatars/4.png",
];

export const DiscordAuthModal: React.FC<DiscordAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isDiscordConfigured = false,
}) => {
  const [username, setUsername] = useState("");
  const [discordTag, setDiscordTag] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleOAuthLogin = () => {
    window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("กรุณากรอกชื่อ Discord ของคุณ");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          discordTag: discordTag.trim(),
          avatarUrl: selectedAvatar,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-md bg-[#0d101a] border border-[#5865F2]/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-[#5865F2]/20 overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#5865F2]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] shadow-lg shadow-[#5865F2]/20">
            <img src="/discord-logo.png" alt="Discord" className="w-7 h-7 object-contain drop-shadow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>เข้าสู่ระบบด้วย Discord</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              เพื่อร่วมแสดงความคิดเห็นและตอบกลับคอมเมนต์
            </p>
          </div>
        </div>

        {/* OAuth Button (if Discord app configured) */}
        {isDiscordConfigured && (
          <div className="mb-5 pb-5 border-b border-white/10">
            <button
              onClick={handleOAuthLogin}
              className="w-full py-3 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-[#5865F2]/30 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <img src="/discord-logo.png" alt="Discord" className="w-5 h-5 object-contain" />
              <span>เข้าสู่ระบบผ่าน Discord OAuth2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="relative flex items-center justify-center my-4">
              <span className="h-px bg-white/10 w-full" />
              <span className="px-3 bg-[#0d101a] text-[11px] font-mono text-slate-500 uppercase shrink-0">
                หรือเชื่อมต่อด่วน
              </span>
              <span className="h-px bg-white/10 w-full" />
            </div>
          </div>
        )}

        {/* Quick Discord Connect Form */}
        <form onSubmit={handleQuickLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ชื่อผู้ใช้ Discord (Username / Global Name) *
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น PokkyPlayer หรือ PkGamer"
                maxLength={40}
                required
                className="w-full bg-black/50 border border-white/15 focus:border-[#5865F2] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              แท็ก Discord (ตัวเลือกเสริม เช่น #1234 หรือกลุ่มสังกัด)
            </label>
            <input
              type="text"
              value={discordTag}
              onChange={(e) => setDiscordTag(e.target.value)}
              placeholder="เช่น #0001 หรือ Esport Clan"
              maxLength={20}
              className="w-full bg-black/50 border border-white/15 focus:border-[#5865F2] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              เลือกรูปโปรไฟล์ Discord
            </label>
            <div className="flex items-center gap-2.5">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative p-1 rounded-2xl transition-all ${
                    selectedAvatar === url
                      ? "ring-2 ring-[#5865F2] scale-110 bg-[#5865F2]/20"
                      : "opacity-60 hover:opacity-100 bg-white/5"
                  }`}
                >
                  <img src={url} alt="Avatar" className="w-8 h-8 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5865F2] to-indigo-600 hover:from-[#4752C4] hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>เชื่อมต่อโปรไฟล์ Discord ทันที</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            ระบบจะใช้ชื่อและรูปอวาตาร์นี้แสดงในความคิดเห็นและการตอบกลับของคุณบน Pokky Stozy
          </p>
        </form>
      </div>
    </div>
  );
};
