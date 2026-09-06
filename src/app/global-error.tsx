"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Critical root error captured by global error boundary:", error);
  }, [error]);

  return (
    <html lang="th" className="dark">
      <body className="min-h-screen bg-[#08090d] text-slate-100 flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full bg-[#0e1017] border border-red-500/20 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            ระบบพบข้อผิดพลาดระดับร้ายแรง
          </h2>
          
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            ไม่สามารถเริ่มต้นโหลดระบบโครงสร้างหลักได้ กรุณารีเฟรชหรือกดปุ่มลองใหม่อีกครั้ง
          </p>

          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-green-500/20"
          >
            <RotateCcw className="w-4 h-4" />
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </body>
    </html>
  );
}