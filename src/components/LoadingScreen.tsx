"use client";

import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  isFadingOut?: boolean;
}

const DEFAULT_STATUS_MESSAGES = [
  "กำลังเชื่อมต่อคลังข้อมูล Pokky Stozy...",
  "กำลังตรวจสอบสถานะเซิร์ฟเวอร์และความปลอดภัย...",
  "กำลังจัดเตรียมแพ็กเกจสคริปต์ความเร็วสูง...",
  "กำลังปรับแต่งการเชื่อมต่อให้มี Latency ต่ำสุด...",
  "ระบบพร้อมสำหรับการเข้าใช้งานแล้ว"
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  subMessage = "ESPORTS SYSTEM OPTIMIZER",
  isFadingOut = false,
}) => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);

  useEffect(() => {
    if (message) return;
    const interval = setInterval(() => {
      setCurrentStatusIndex((prev) => (prev + 1) % DEFAULT_STATUS_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [message]);

  const activeMessage = message || DEFAULT_STATUS_MESSAGES[currentStatusIndex];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080c] select-none transition-opacity duration-500 ease-out ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-live="polite"
      role="status"
    >
      {/* Background Cyber Glow & Radial Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-green-400/15 rounded-full blur-[80px]" />
        
        {/* Subtle Cyber Grid */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(to right, #22c55e 1px, transparent 1px), linear-gradient(to bottom, #22c55e 1px, transparent 1px)",
            backgroundSize: "36px 36px"
          }}
        />
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 flex flex-col items-center px-6 max-w-md w-full text-center">
        
        {/* Logo Container with Breathing Neon Aura */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-r from-emerald-500/30 to-green-400/30 rounded-2xl blur-xl animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0d1117] border border-emerald-500/40 p-3 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Pokky Stozy"
              className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(74,222,128,0.5)] animate-[pulse_2s_ease-in-out_infinite]"
            />
          </div>
        </div>

        {/* Brand Title */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-black tracking-wider text-xl sm:text-2xl text-white font-sans">
            POKKY
          </span>
          <span className="font-black tracking-wider text-xl sm:text-2xl text-green-400 font-sans">
            STOZY
          </span>
        </div>

        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] sm:text-xs font-mono tracking-widest text-emerald-300 font-semibold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span>{subMessage}</span>
        </div>

        {/* Cyber Progress Loading Bar */}
        <div className="w-full max-w-xs h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-emerald-500/20 mb-4 p-[1px]">
          <div className="h-full w-full bg-gradient-to-r from-emerald-600 via-green-400 to-emerald-300 rounded-full animate-indeterminate origin-left" />
        </div>

        {/* Dynamic Status Text */}
        <div className="h-6 flex items-center justify-center">
          <p className="text-xs sm:text-sm font-sans text-slate-300 tracking-wide transition-opacity duration-300">
            {activeMessage}
          </p>
        </div>

        {/* System Indicators Footer */}
        <div className="mt-8 flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SERVER: ONLINE
          </span>
          <span className="text-slate-700">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            LATENCY: 1ms
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">100% FREE</span>
        </div>

      </div>
    </div>
  );
};
