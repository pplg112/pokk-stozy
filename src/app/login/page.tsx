"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Home,
  Sparkles,
  ExternalLink,
  Shield,
  Zap,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { DiscordUser } from "@/types";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Extract query params
  const errorParam = searchParams.get("error");
  const messageParam = searchParams.get("message");
  const authSuccess = searchParams.get("auth_success") === "1";
  const returnUrl = searchParams.get("returnUrl") || "/";

  // Map known error codes to friendly Thai messages
  const getErrorMessage = (code: string | null, customMsg: string | null) => {
    if (customMsg) return decodeURIComponent(customMsg);
    switch (code) {
      case "access_denied":
        return "คุณได้ยกเลิกหรือปฏิเสธการให้สิทธิ์เชื่อมต่อกับบัญชี Discord";
      case "not_configured":
        return "ระบบ Discord OAuth2 ยังไม่ได้กำหนดค่า Client ID / Secret กรุณาติดต่อผู้ดูแลระบบ";
      case "exchange_failed":
        return "รหัสยืนยันตัวตนจาก Discord หมดอายุหรือไม่ถูกต้อง กรุณากดเข้าสู่ระบบใหม่อีกครั้ง";
      case "state_mismatch":
        return "คำขอนี้หมดอายุหรือไม่ถูกต้องตามมาตรการป้องกันความปลอดภัย (CSRF Protection) กรุณาลองใหม่อีกครั้ง";
      case "no_code":
        return "ไม่พบข้อมูลรหัสยืนยันตัวตนจาก Discord";
      case "profile_failed":
        return "ไม่สามารถดึงข้อมูลบัญชีโปรไฟล์จาก Discord ได้";
      default:
        return code ? `เกิดข้อผิดพลาดในการเข้าสู่ระบบ (${code})` : null;
    }
  };

  const errorMessage = getErrorMessage(errorParam, messageParam);

  // Fetch authenticated user status on load
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoadingUser(false);
      });
  }, []);

  // Handle Discord OAuth2 Click
  const handleDiscordLogin = () => {
    setIsLoggingIn(true);
    const targetReturn = returnUrl && returnUrl !== "/login" ? returnUrl : "/";
    window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(targetReturn)}`;
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.refresh();
    } catch {}
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md relative">
        {/* Background Ambient Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#5865F2]/40 via-green-500/20 to-[#5865F2]/40 rounded-3xl blur-xl opacity-75 animate-pulse" />

        <div className="relative rounded-3xl bg-[#0b0e14]/90 border border-white/10 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <img
                src="/logo.png"
                alt="Pokky Stozy Logo"
                className="h-14 w-auto mx-auto drop-shadow-[0_0_25px_rgba(88,101,242,0.4)]"
              />
            </Link>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5865F2]/15 border border-[#5865F2]/40 text-[#5865F2] text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Discord OAuth2</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                {currentUser ? "ยินดีต้อนรับกลับมา" : "เข้าสู่ระบบสมาชิก"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {currentUser
                  ? "คุณได้เชื่อมต่อบัญชี Discord กับระบบ Pokky Stozy แล้ว"
                  : "เชื่อมต่อกับ Discord เพื่อคอมเมนต์ ตอบกลับ และบันทึกประวัติการดาวน์โหลด"}
              </p>
            </div>
          </div>

          {/* Success Banner */}
          {authSuccess && currentUser && (
            <div className="p-4 rounded-2xl bg-green-500/15 border border-green-500/30 flex items-start gap-3 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-green-300">เข้าสู่ระบบสำเร็จ!</p>
                <p className="text-slate-300 mt-0.5">
                  ยินดีต้อนรับคุณ <span className="font-bold text-white">{currentUser.globalName || currentUser.username}</span> เข้าสู่คอมมูนิตี้
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-start gap-3 animate-shake">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <p className="font-bold text-red-300">เข้าสู่ระบบไม่สำเร็จ</p>
                <p className="text-slate-300 mt-0.5 leading-relaxed">{errorMessage}</p>
                {errorParam === "not_configured" && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-bold underline mt-2"
                  >
                    <span>ไปที่หน้า Admin Portal เพื่อตั้งค่า Discord OAuth</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Body: Logged In vs Guest */}
          {isLoadingUser ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-[#5865F2]" />
              <span className="text-xs font-mono">กำลังตรวจสอบเซสชัน...</span>
            </div>
          ) : currentUser ? (
            /* Logged in User Card */
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-4">
                <img
                  src={currentUser.avatarUrl || "/discord-logo.png"}
                  alt={currentUser.username}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#5865F2]/50 shadow-lg shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-black text-white truncate">
                      {currentUser.globalName || currentUser.username}
                    </h2>
                    <span className="px-1.5 py-0.5 rounded-md bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-mono font-bold shrink-0">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                    @{currentUser.username}
                  </p>
                  {currentUser.email && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {currentUser.email}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[#5865F2] font-mono">
                    <UserCheck className="w-3 h-3" />
                    <span>Discord ID: {currentUser.id}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Logged In User */}
              <div className="grid grid-cols-1 gap-2.5">
                {returnUrl && returnUrl !== "/login" && returnUrl !== "/" ? (
                  <Link
                    href={returnUrl}
                    className="w-full py-3 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01] active:scale-95"
                  >
                    <span>ไปยังหน้าที่กำลังเข้าชม</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/"
                    className="w-full py-3 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/20 hover:scale-[1.01] active:scale-95"
                  >
                    <Home className="w-4 h-4" />
                    <span>กลับสู่หน้าหลัก (Home)</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-red-500/10 text-slate-300 hover:text-red-400 border border-white/10 hover:border-red-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          ) : (
            /* Guest Login Screen */
            <div className="space-y-5">
              {/* Feature Points */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-[#5865F2]/5 border border-[#5865F2]/20 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shrink-0">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span>เข้าสู่ระบบด้วยคลิกเดียว ปลอดภัย 100% ไม่ต้องจำรหัสผ่านใหม่</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shrink-0">
                    <Shield className="w-3 h-3" />
                  </div>
                  <span>สิทธิ์การเข้าถึงต่ำสุด (Identify, Email) ไม่เข้าถึงข้อมูลส่วนตัว</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span>ร่วมคอมเมนต์ ตอบกลับ และรับสิทธิ์สมาชิก Discord Community</span>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="button"
                onClick={handleDiscordLogin}
                disabled={isLoggingIn}
                className="w-full py-4 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-75 text-white font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#5865F2]/30 hover:scale-[1.02] active:scale-95 cursor-pointer group"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>กำลังเชื่อมต่อไปยัง Discord...</span>
                  </>
                ) : (
                  <>
                    <img
                      src="/discord-logo.png"
                      alt="Discord"
                      className="w-5 h-5 object-contain group-hover:scale-110 transition-transform drop-shadow"
                    />
                    <span>เข้าสู่ระบบด้วย Discord OAuth2</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>กลับสู่หน้าแรกโดยไม่เข้าสู่ระบบ</span>
                </Link>
              </div>
            </div>
          )}

          {/* Footer Security Note */}
          <div className="pt-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-400 font-mono flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-green-400 shrink-0" />
              <span>PROTECTED BY WEB CRYPTO HMAC-SHA256 SESSION TOKENS</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-slate-400">
          <RefreshCw className="w-8 h-8 animate-spin text-[#5865F2]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
