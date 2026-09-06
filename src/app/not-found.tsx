import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0e1017] border border-slate-800 rounded-2xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-cyan-500 to-green-500" />
        
        <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-4 font-mono">
          404
        </div>

        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
          ไม่พบหน้าที่คุณต้องการ
        </h2>
        
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบ หรือที่อยู่ URL ไม่ถูกต้อง กรุณากลับสู่หน้าหลักของร้านค้า
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-green-500/20"
          >
            <Home className="w-4 h-4" />
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}