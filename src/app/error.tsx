"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log client-side error cleanly
    console.error("Application error captured by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0e1017] border border-red-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />
        
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          เกิดข้อผิดพลาดในการโหลดหน้าเว็บ
        </h2>
        
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          ระบบพบข้อขัดข้องชั่วคราวในการประมวลผล กรุณาลองใหม่อีกครั้ง หรือกลับสู่หน้าหลัก
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            ลองใหม่อีกครั้ง
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
        </div>

        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-6 text-left p-3 rounded-lg bg-black/40 border border-red-500/20 text-xs text-red-300 font-mono overflow-auto max-h-32">
            {error.message}
          </div>
        )}
      </div>
    </div>
  );
}