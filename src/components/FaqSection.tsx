"use client";

import React, { useState } from "react";
import { STORE_FAQS } from "@/data/faqs";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>HELP & FREQUENTLY ASKED</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
          คำถามที่พบบ่อย
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          ข้อมูลเกี่ยวกับการดาวน์โหลด ความปลอดภัยของระบบ และการคืนค่าเดิม
        </p>
      </div>

      <div className="space-y-3">
        {STORE_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-white/[0.05] border-green-400/50 shadow-lg shadow-green-950/20"
                  : "bg-white/[0.02] hover:bg-white/[0.04] border-white/10"
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className={`text-sm sm:text-base font-bold transition-colors ${
                  isOpen ? "text-green-300" : "text-white"
                }`}>
                  {faq.question}
                </span>
                <span className={`shrink-0 p-1.5 rounded-lg transition-colors ${
                  isOpen ? "bg-green-500/20 text-green-300" : "text-slate-400 bg-white/5"
                }`}>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4 font-normal">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
