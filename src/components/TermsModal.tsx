"use client";

import React from "react";
import { X, ShieldAlert, AlertTriangle } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0e1017] border border-white/15 shadow-2xl my-6 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <span className="text-white uppercase tracking-wider">
              ข้อตกลงการใช้งานและข้อจำกัดความรับผิดชอบ
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-red-950/25 border border-red-500/30 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold font-mono text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>สรุปสาระสำคัญ (อ่านก่อนใช้งาน):</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              ไฟล์ สคริปต์ และโปรไฟล์ปรับแต่งทั้งหมดที่เผยแพร่บน <strong>Pokky Stozy</strong> จัดทำขึ้นเพื่อการศึกษา ทดสอบ และเพิ่มประสิทธิภาพของระบบคอมพิวเตอร์เท่านั้น ผู้ใช้งานตกลงยินยอมรับความเสี่ยงที่อาจเกิดขึ้นด้วยความสมัครใจของตนเองทั้งหมด (Use strictly at your own risk)
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-green-400 flex items-center justify-center text-xs font-mono">1</span>
              <span>การปฏิเสธความรับผิดชอบอย่างสมบูรณ์ (No Liability)</span>
            </h4>
            <p className="pl-8 text-slate-300">
              ทาง <strong>Pokky Stozy</strong> ผู้พัฒนา ผู้ดูแลระบบ และผู้จัดทำไฟล์ ขอปฏิเสธความรับผิดชอบต่อความเสียหายใดๆ ทั้งสิ้น ไม่ว่าจะเป็นความเสียหายโดยตรง ทางอ้อม หรือผลสืบเนื่อง เช่น ข้อผิดพลาดของระบบปฏิบัติการ Windows, ฮาร์ดแวร์ทำงานผิดปกติ, โปรแกรมหรือเกมขัดข้อง, หรือการสูญหายของข้อมูลทุกกรณี
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-green-400 flex items-center justify-center text-xs font-mono">2</span>
              <span>หน้าที่ของผู้ใช้ในการสำรองข้อมูล (System Restore Point)</span>
            </h4>
            <p className="pl-8 text-slate-300">
              ก่อนเริ่มรันสคริปต์หรือปรับแต่งการตั้งค่าใดๆ ผู้ใช้ตกลงที่จะสร้างจุดคืนค่าระบบ (System Restore Point) และสำรองข้อมูลที่สำคัญไว้ล่วงหน้าเสมอ ทั้งนี้สคริปต์ของระบบได้ใส่คำสั่งช่วยสร้างจุดสำรองอัตโนมัติไว้เป็นชั้นความปลอดภัยเพิ่มเติม
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-green-400 flex items-center justify-center text-xs font-mono">3</span>
              <span>ความโปร่งใสและสิทธิ์ในการตรวจสอบ (Open Source Inspection)</span>
            </h4>
            <p className="pl-8 text-slate-300">
              สคริปต์คำสั่งทั้งหมด (.bat, .cmd, .reg, .ps1) เป็นไฟล์โค้ดแบบเปิดเผย ผู้ใช้มีสิทธิ์และควรอ่านตรวจสอบคำสั่งทุกบรรทัดด้วยโปรแกรม Notepad ก่อนตัดสินใจสั่งทำงาน เพื่อให้มั่นใจในความปลอดภัยและเข้าใจสิ่งที่ระบบจะทำการปรับแต่ง
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-green-400 flex items-center justify-center text-xs font-mono">4</span>
              <span>การกู้คืนค่ามาตรฐานเดิม (Revert System)</span>
            </h4>
            <p className="pl-8 text-slate-300">
              ในทุกแพ็กเกจจะมีไฟล์ Revert Script สำหรับคืนค่าการตั้งค่าเดิมของ Windows ให้เสมอ หากผู้ใช้รู้สึกว่าระบบทำงานผิดปกติหรือไม่ถูกใจ สามารถรันไฟล์ Revert หรือย้อนกลับด้วย System Restore Point ได้ตลอดเวลา
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-base font-bold text-white font-sans flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white/10 text-green-400 flex items-center justify-center text-xs font-mono">5</span>
              <span>ข้อตกลงการแจกฟรีเพื่อชุมชน (Community Edition)</span>
            </h4>
            <p className="pl-8 text-slate-300">
              ไฟล์ทั้งหมดเผยแพร่ให้ดาวน์โหลดฟรี 100% โดยไม่มีค่าบริการแอบแฝงใดๆ ผู้ใช้ตกลงว่าจะไม่นำไฟล์ไปจำหน่ายต่อในเชิงพาณิชย์ และการดาวน์โหลดเป็นการยอมรับข้อตกลงทั้งหมดนี้โดยสมบูรณ์
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-slate-400">
            อัปเดตล่าสุด: กันยายน 2026
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all cursor-pointer shadow-lg shadow-green-500/20"
          >
            รับทราบและปิดหน้านี้
          </button>
        </div>

      </div>
    </div>
  );
};
