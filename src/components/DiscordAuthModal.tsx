"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  HelpCircle,
  AlertTriangle
} from "lucide-react";
import { DiscordUser } from "@/types";

interface DiscordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: DiscordUser) => void;
  isDiscordConfigured?: boolean;
  isAdmin?: boolean;
}

export const DiscordAuthModal: React.FC<DiscordAuthModalProps> = ({
  isOpen,
  onClose,
  isDiscordConfigured: initialConfigured = false,
  isAdmin = false,
}) => {
  const [isConfigured, setIsConfigured] = useState(initialConfigured);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [redirectUri, setRedirectUri] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  // Fetch discord config status and dynamic redirectUri on mount
  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccessMsg("");
      const currentOrigin = typeof window !== "undefined" ? window.location.origin : "https://pokkystozy.xyz";
      setRedirectUri(`${currentOrigin}/api/auth/discord/callback`);

      fetch("/api/admin/discord-config")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const configured = Boolean(data.isConfigured);
            setIsConfigured(configured);
            if (data.clientId) setClientId(data.clientId);
            if (data.redirectUri) setRedirectUri(data.redirectUri);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOAuthLogin = () => {
    const returnUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
    window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(returnUrl)}`;
  };

  const handleCopyRedirectUri = () => {
    if (!redirectUri) return;
    navigator.clipboard.writeText(redirectUri);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId.trim()) {
      setError("กรุณากรอก Discord Client ID");
      return;
    }
    if (!clientSecret.trim()) {
      setError("กรุณากรอก Discord Client Secret");
      return;
    }
    if (!adminPassword.trim()) {
      setError("กรุณากรอกรหัสผ่าน Admin เพื่อยืนยันสิทธิ์");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/discord-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientId.trim(),
          clientSecret: clientSecret.trim(),
          adminPassword: adminPassword.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsConfigured(true);
        setSuccessMsg("บันทึกการตั้งค่า Discord OAuth2 เรียบร้อย! กำลังพาคุณไปที่หน้าล็อกอิน Discord...");
        setTimeout(() => {
          handleOAuthLogin();
        }, 1200);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-lg bg-[#0c0f18] border border-[#5865F2]/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-[#5865F2]/20 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5865F2]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="p-3 rounded-2xl bg-[#5865F2]/20 border border-[#5865F2]/40 text-[#5865F2] shadow-lg shadow-[#5865F2]/20 shrink-0">
            <img src="/discord-logo.png" alt="Discord" className="w-8 h-8 object-contain drop-shadow" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>{isAdmin ? "ตั้งค่าระบบ Discord OAuth2" : "เข้าสู่ระบบด้วย Discord"}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#5865F2]/25 text-indigo-300 border border-[#5865F2]/40 uppercase font-bold">
                {isAdmin ? "Admin Console" : "OAuth2 แท้"}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAdmin
                ? "สำหรับผู้ดูแลระบบ: กำหนดค่า Client ID และ Client Secret เพื่อเปิดใช้งานระบบล็อกอิน"
                : "เชื่อมต่อบัญชี Discord ทางการ เพื่อคอมเมนต์และตอบกลับได้ทันที"}
            </p>
          </div>
        </div>

        {/* ADMIN MODE: Discord OAuth2 Setup Screen */}
        {isAdmin ? (
          <form onSubmit={handleSaveSetup} className="space-y-4">
            {/* Step Guide Box */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300 font-bold">
                <span className="flex items-center gap-1.5 text-indigo-300">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>วิธีตั้งค่า Discord App ใน 1 นาที</span>
                </span>
                <a
                  href="https://discord.com/developers/applications"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#5865F2] hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>เปิด Developer Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11px] leading-relaxed">
                <li>ไปที่ Discord Developer Portal กดเลือก Application ของคุณ</li>
                <li>ไปที่เมนู <b>OAuth2</b> แล้วเพิ่ม <b>Redirect URI</b> ด้านล่างนี้:</li>
              </ol>

              {/* Redirect URI Box with 1-click Copy */}
              <div className="flex items-center gap-2 bg-[#08090d] border border-white/15 rounded-xl p-2 font-mono text-[11px]">
                <span className="truncate flex-1 text-slate-300 select-all">{redirectUri}</span>
                <button
                  type="button"
                  onClick={handleCopyRedirectUri}
                  className="px-2.5 py-1 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2]/35 border border-[#5865F2]/40 text-[#5865F2] text-[10px] font-bold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
                  title="คัดลอก Redirect URI"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>คัดลอก URI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Client ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discord Client ID (Application ID) *
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="เช่น 1545830613741871114"
                required
                className="w-full bg-black/50 border border-white/15 focus:border-[#5865F2] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            {/* Client Secret */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discord Client Secret *
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder="เช่น AbCdEfG123456_xyz"
                  required
                  className="w-full bg-black/50 border border-white/15 focus:border-[#5865F2] rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                รหัสผ่าน Admin (เพื่อบันทึกการตั้งค่า) *
              </label>
              <div className="relative">
                <input
                  type={showAdminPass ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                  required
                  className="w-full bg-black/50 border border-white/15 focus:border-green-400 rounded-xl pl-3.5 pr-10 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showAdminPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !clientId.trim() || !clientSecret.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#5865F2] to-indigo-600 hover:from-[#4752C4] hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5865F2]/25 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>กำลังบันทึกและตรวจสอบ...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>บันทึกและเชื่อมต่อ Discord ทันที</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* USER PUBLIC MODE: Clean OAuth2 Login Screen (No setup tab, no admin inputs) */
          <div className="space-y-4">
            {isConfigured ? (
              <>
                <div className="p-4 rounded-2xl bg-[#5865F2]/10 border border-[#5865F2]/30 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span>ระบบ Discord OAuth2 พร้อมใช้งานแล้ว</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    คลิกปุ่มด้านล่างเพื่อเข้าสู่ระบบผ่านเว็บไซต์ทางการของ Discord ระบบจะดึงชื่อและรูปโปรไฟล์ของคุณมาใช้บนเว็บไซต์ Pokky Stozy โดยอัตโนมัติ
                  </p>
                </div>

                <div className="space-y-2 py-1 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>ยืนยันตัวตนด้วยโปรไฟล์ Discord จริง 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>ปลอดภัย ไม่มีการเก็บรหัสผ่านใดๆ บนเซิร์ฟเวอร์</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    <span>สามารถแสดงความคิดเห็นและตอบกลับคอมเมนต์ได้</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleOAuthLogin}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#5865F2]/30 hover:scale-[1.02] active:scale-95 cursor-pointer group"
                >
                  <img src="/discord-logo.png" alt="Discord" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform drop-shadow" />
                  <span>เข้าสู่ระบบผ่าน Discord OAuth2 ทันที</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">เกิดข้อผิดพลาดในการเชื่อมต่อ</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    ระบบเข้าสู่ระบบ Discord ขัดข้องชั่วคราว โปรดติดต่อผู้ดูแลระบบ (Admin) เพื่อรับความช่วยเหลือ หรือลองใหม่อีกครั้งในภายหลัง
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
