"use client";

import React, { useState } from "react";
import { STORE_FAQS } from "@/data/faqs";
import { ChevronDown, ChevronUp } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-10 sm:py-14 max-w-4xl mx-auto px-4 sm:px-6 font-sans">
      <div className="text-center mb-8">
        <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-2">
          คำถามที่พบบ่อย
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          ข้อมูลเกี่ยวกับการดาวน์โหลด ความปลอดภัย และการคืนค่าเดิม
        </p>
      </div>

      <div className="space-y-2.5">
        {STORE_FAQS.slice(0, 4).map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold text-white">
                  {faq.question}
                </span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
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
