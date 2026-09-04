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
    <section id="faqs" className="py-20 max-w-4xl mx-auto px-6 sm:px-8 font-sans">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-2.5">
          คำถามที่พบบ่อย
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          ข้อมูลเกี่ยวกับการดาวน์โหลด ความปลอดภัย และการคืนค่าเดิม
        </p>
      </div>

      <div className="space-y-3">
        {STORE_FAQS.slice(0, 4).map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-white/[0.06] transition-colors"
              >
                <span className="text-base sm:text-lg font-semibold text-white">
                  {faq.question}
                </span>
                <span className="text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 text-sm sm:text-base text-slate-300 leading-relaxed border-t border-white/10 pt-3">
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
