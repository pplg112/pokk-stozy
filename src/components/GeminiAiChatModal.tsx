"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Download,
  Eye,
  Key,
  RotateCcw,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { DigitalProduct } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
  recommendedProducts?: DigitalProduct[];
  timestamp: string;
}

interface GeminiAiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProducts: DigitalProduct[];
  onDownloadProduct: (product: DigitalProduct) => void;
  onViewProduct: (product: DigitalProduct) => void;
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  { label: "⚡ ดัน FPS Valorant", query: "เล่น Valorant แล้วเฟรมตก เล็งยิงไม่ค่อยคม แนะนำสคริปต์ปรับแต่งหน่อยครับ" },
  { label: "🚗 แก้ FiveM กระตุกในเมือง", query: "เล่น FiveM ขับรถเร็วๆ แล้วแมพโหลดไม่ทัน เฟรมดรอป มีตัวช่วยมั้ยครับ" },
  { label: "🌐 ลด Ping & เน็ตแล็ก", query: "เล่นเกมออนไลน์แล้วปิงแกว่ง Packet loss ขึ้นบ่อย แก้ยังไงดีครับ" },
  { label: "🎯 ลด Input Delay เมาส์", query: "อยากลด Input Delay เมาส์และคีย์บอร์ดให้ตอบสนองไวขึ้น ต้องใช้ตัวไหนครับ" },
  { label: "🧹 เคลียร์ RAM & ขยะ Win 11", query: "Windows 11 แรม 8GB-16GB รู้สึกเครื่องหน่วงและกินแรมเยอะ แนะนำตัวล้างระบบหน่อยครับ" },
];

export const GeminiAiChatModal: React.FC<GeminiAiChatModalProps> = ({
  isOpen,
  onClose,
  allProducts,
  onDownloadProduct,
  onViewProduct,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 **ยินดีต้อนรับสู่ Pokky Gemini AI Assistant!**

ผมคือ AI ผู้ช่วยวิเคราะห์และแนะนำการปรับแต่ง PC สำหรับเกมเมอร์ประจำ **Pokky Stozy**
คุณสามารถบอกชื่อเกมที่คุณเล่น (เช่น Valorant, FiveM, Apex) หรืออาการที่พบ (เฟรมตก, ปิงแกว่ง, เมาส์หน่วง) เพื่อให้ผมแนะนำสคริปต์ฟรีที่ตรงจุดที่สุดได้เลยครับ!`,
      source: "Google Gemini 2.5 Flash",
      timestamp: "ตอนนี้",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved key from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("pokky_gemini_api_key") || "";
      setUserApiKey(saved);
      setTempApiKey(saved);
    }
  }, []);

  // Handle initialPrompt if provided
  useEffect(() => {
    if (isOpen && initialPrompt) {
      handleSendMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setUserApiKey(trimmed);
    if (typeof window !== "undefined") {
      if (trimmed) {
        localStorage.setItem("pokky_gemini_api_key", trimmed);
      } else {
        localStorage.removeItem("pokky_gemini_api_key");
      }
    }
    setShowKeyModal(false);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    setInputMessage("");

    const userMsg: Message = {
      id: "msg-" + Date.now(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build history
      const historyPayload = messages
        .filter((m) => m.id !== "welcome")
        .slice(-6)
        .map((m) => ({
          role: m.role === "user" ? "user" : "model",
          content: m.content,
        }));

      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: historyPayload,
          userApiKey: userApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Resolve recommended products from IDs
        const matchedProducts: DigitalProduct[] = [];
        if (Array.isArray(data.recommendedProductIds)) {
          for (const pid of data.recommendedProductIds) {
            const found = allProducts.find((p) => p.id === pid);
            if (found && !matchedProducts.some((p) => p.id === found.id)) {
              matchedProducts.push(found);
            }
          }
        }

        const aiMsg: Message = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content: data.reply,
          source: data.source || "Google Gemini AI",
          recommendedProducts: matchedProducts,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: Message = {
          id: "err-" + Date.now(),
          role: "assistant",
          content: `⚠️ เกิดข้อผิดพลาด: ${data.error || "ไม่สามารถเชื่อมต่อระบบ AI ได้"} กรุณาลองใหม่อีกครั้งครับ`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: Message = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: "⚠️ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่อีกครั้งครับ",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: `👋 เริ่มการสนทนาใหม่แล้วครับ!

บอกชื่อเกม หรือปัญหาเครื่องที่คุณต้องการแก้ไขได้เลยครับ ผมพร้อมวิเคราะห์และแนะนำสคริปต์ที่ตรงจุดให้ทันที`,
        source: "Google Gemini AI",
        timestamp: "ตอนนี้",
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn font-sans">
      <div
        className={`relative w-full ${
          isExpanded ? "sm:max-w-4xl h-[92vh]" : "sm:max-w-2xl h-[85vh] sm:h-[650px]"
        } bg-[#0b0e14] border border-green-500/30 sm:rounded-3xl rounded-t-3xl flex flex-col overflow-hidden shadow-2xl shadow-green-950/40 transition-all duration-200`}
      >
        {/* Neon Glow Accents */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-green-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-32 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-5 py-4 border-b border-white/10 bg-[#0e121b]/95 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-green-500/20 via-emerald-500/15 to-cyan-500/20 border border-green-500/40 text-green-400 shadow-md shadow-green-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Pokky Gemini AI Assistant
                </h3>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-green-400/20 border border-green-400/30 text-green-300">
                  v2.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400"></span>
                <span>ผู้เชี่ยวชาญ Optimize PC & Esports สคริปต์ฟรี</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* API Key Config Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              title="ตั้งค่า Gemini API Key (ตัวเลือกเสริม)"
              className={`p-2 rounded-xl text-xs transition-colors border ${
                userApiKey
                  ? "bg-green-500/15 border-green-500/30 text-green-300 hover:bg-green-500/25"
                  : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Key className="w-4 h-4" />
            </button>

            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              title="เริ่มบทสนทนาใหม่"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Expand / Minimize (desktop only) */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "ย่อหน้าต่าง" : "ขยายหน้าต่าง"}
              className="hidden sm:inline-flex p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Custom API Key Setting Overlay */}
        {showKeyModal && (
          <div className="relative z-20 px-5 py-3.5 bg-[#121723] border-b border-green-500/25 animate-fadeIn text-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-green-300 font-bold">
                <Key className="w-3.5 h-3.5" />
                <span>ตั้งค่า Google Gemini API Key ของคุณ (ตัวเลือกเสริม)</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-400 text-[11px] mb-2 leading-relaxed">
              โดยปกติระบบมี AI ในตัวคอยบริการฟรี หากคุณมี Gemini API Key ส่วนตัว สามารถวางเพื่อใช้งานโมเดล Gemini โดยตรงแบบไม่จำกัดโควตาได้
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="วางคีย์ AIzaSy... ที่นี่ (ปล่อยว่างเพื่อใช้ค่าเริ่มต้นของร้าน)"
                className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-green-400 font-mono"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-3.5 py-1.5 rounded-xl bg-green-400 hover:bg-green-300 text-slate-950 font-bold text-xs transition-colors shrink-0"
              >
                บันทึก
              </button>
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-400 h-8 w-8 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 text-slate-100 rounded-tr-sm"
                    : "bg-[#111520] border border-white/10 text-slate-200 rounded-tl-sm"
                }`}
              >
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/5 text-[11px] text-slate-400">
                  <span className="font-semibold flex items-center gap-1">
                    {msg.role === "user" ? (
                      <>
                        <User className="w-3 h-3 text-green-400" />
                        <span>คุณ (ผู้สอบถาม)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-green-400" />
                        <span>{msg.source || "Pokky Gemini AI"}</span>
                      </>
                    )}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{msg.timestamp}</span>
                </div>

                {/* Message Content */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                  {msg.content.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="break-words">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Recommended Product Cards inside AI Message */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-green-500/20 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-green-400 font-bold text-xs tracking-wide">
                      <Zap className="w-3.5 h-3.5" />
                      <span>สคริปต์ที่แนะนำสำหรับแก้ไขปัญหานี้:</span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="group relative p-3 rounded-xl bg-black/40 border border-green-500/25 hover:border-green-400/60 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-xs sm:text-sm group-hover:text-green-300 transition-colors truncate">
                                {prod.name}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-green-500/15 text-green-400 border border-green-500/30">
                                100% FREE
                              </span>
                            </div>
                            <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5">
                              {prod.tagline}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto">
                            <button
                              onClick={() => {
                                onViewProduct(prod);
                                onClose();
                              }}
                              className="flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>ดูรายละเอียด</span>
                            </button>
                            <button
                              onClick={() => {
                                onDownloadProduct(prod);
                                onClose();
                              }}
                              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-green-400 hover:bg-green-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-green-500/20 transition-all active:scale-95"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>ดาวน์โหลดฟรี</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-slate-300 h-8 w-8 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 text-green-400 h-8 w-8 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#111520] border border-white/10 text-slate-300 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs text-slate-400">Gemini กำลังวิเคราะห์อาการและค้นหาสคริปต์ที่ตรงจุด...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips */}
        <div className="px-4 py-2 border-t border-white/5 bg-[#0e121b]/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0 flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-green-400" />
            <span>คำถามยอดฮิต:</span>
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.query)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-green-500/15 border border-white/10 hover:border-green-500/30 text-[11px] text-slate-300 hover:text-green-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0e121b]/95 backdrop-blur-md">
          <div className="relative flex items-center gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์คำถาม เช่น 'Valorant กระตุก แนะนำสคริปต์หน่อย' (กด Enter เพื่อส่ง)..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none bg-black/40 border border-white/15 focus:border-green-400/80 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all max-h-24"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 text-slate-950 font-bold shadow-lg shadow-green-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-green-400" />
              <span>สคริปต์แจกฟรี 100% ปลอดภัย มีไฟล์ Revert คืนค่าให้ทุกตัว</span>
            </span>
            <span className="hidden sm:inline font-mono text-[10px]">
              Powered by Google Gemini
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
