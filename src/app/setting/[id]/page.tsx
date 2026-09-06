"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { FreeDownloadModal } from "@/components/FreeDownloadModal";
import { GeminiAiChatModal } from "@/components/GeminiAiChatModal";
import { DiscordAuthModal } from "@/components/DiscordAuthModal";
import { ProductReviewsSection } from "@/components/ProductReviewsSection";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, DiscordUser } from "@/types";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import {
  ArrowLeft,
  Download,
  Share2,
  Check,
  Star,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Sparkles,
  FileCode2,
  CheckCircle2,
  Terminal,
  Copy,
  ChevronRight,
  Info,
  Layers,
  MessageSquare,
  Zap,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SettingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "code" | "reviews">("overview");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedRevert, setCopiedRevert] = useState(false);

  // Modals state
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(null);
  const [isDiscordConfigured, setIsDiscordConfigured] = useState(false);

  // Check Discord user session
  const checkUserSession = async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user || null);
        setIsDiscordConfigured(Boolean(data.isDiscordConfigured));
      }
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
    } catch {}
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  // Fetch product data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.product) {
            setProduct(data.product);
            return;
          }
        }
        // Fallback search in static products
        const staticFound = DIGITAL_PRODUCTS.find((p) => p.id === productId);
        setProduct(staticFound || null);
      } catch {
        const staticFound = DIGITAL_PRODUCTS.find((p) => p.id === productId);
        setProduct(staticFound || null);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId]);

  const handleCopyShareUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = (code: string, type: "script" | "revert") => {
    navigator.clipboard.writeText(code);
    if (type === "script") {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedRevert(true);
      setTimeout(() => setCopiedRevert(false), 2000);
    }
  };

  const handleOpenAiChatWithProduct = () => {
    if (!product) return;
    setAiInitialPrompt(`อยากสอบถามเกี่ยวกับการใช้งานสคริปต์ "${product.name}" สเปกคอมของผมควรปรับแต่งยังไงดีครับ?`);
    setIsAiChatOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col items-center justify-center font-sans">
        <CyberBackground />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono text-green-400">กำลังโหลดข้อมูล Setting...</span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans">
        <CyberBackground />
        <Navbar onOpenAiChat={() => setIsAiChatOpen(true)} />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-20 text-center relative z-10">
          <div className="p-8 rounded-3xl bg-[#0e121b] border border-white/10 space-y-4">
            <h2 className="text-2xl font-bold text-white">ไม่พบแพ็กเกจ Setting ที่ต้องการ</h2>
            <p className="text-sm text-slate-400">
              แพ็กเกจนี้อาจถูกย้าย หรือไม่มีอยู่ในระบบ กรุณาตรวจสอบรหัส ID หรือเลือกดูแพ็กเกจทั้งหมดที่หน้าหลัก
            </p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-400 hover:bg-green-300 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-green-500/20"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>กลับสู่หน้ารวมแพ็กเกจ</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const relatedProducts = DIGITAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-green-400 selection:text-slate-950 relative overflow-x-hidden">
      <CyberBackground />

      {/* Navigation Bar */}
      <div className="relative z-40">
        <Navbar
          onOpenAiChat={() => setIsAiChatOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            if (isDiscordConfigured) {
              window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onLogout={handleLogout}
        />
      </div>

      <main className="flex-1 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-green-400 transition-colors flex items-center gap-1">
            <span>หน้าแรก</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link href="/#products" className="hover:text-green-400 transition-colors">
            แพ็กเกจ Setting
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-green-400 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Product Showcase & Download CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="p-5 rounded-3xl bg-[#0b0e17] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-60 h-60 bg-green-500/10 blur-3xl pointer-events-none" />

              {/* Cover Image */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 mb-4 shadow-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-green-400 text-slate-950 font-mono font-bold text-xs shadow-md">
                    100% FREE
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white font-mono text-xs">
                    {product.version || "v1.0.0"}
                  </span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h1 className="text-xl sm:text-2xl font-black text-white leading-snug tracking-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {product.tagline}
              </p>

              {/* Quick Meta Badges */}
              <div className="grid grid-cols-3 gap-2 my-5 py-3 border-y border-white/10 text-center font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">รูปแบบ</span>
                  <span className="font-bold text-cyan-300">{product.fileFormat || ".ZIP"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">ขนาดไฟล์</span>
                  <span className="font-bold text-white">{product.fileSize || "1.2 MB"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">คะแนนรีวิว</span>
                  <span className="font-bold text-amber-400 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating > 0 ? product.rating.toFixed(1) : "5.0"}
                  </span>
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="space-y-3">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => setIsDownloading(true)}
                      className="w-full py-4 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
                    >
                      <Download className="w-5 h-5 stroke-[2.5]" />
                      <span>ดาวน์โหลดแพ็กเกจ ({product.fileFormat || ".ZIP"}) ฟรี</span>
                    </button>
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                      <img
                        src={currentUser.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"}
                        alt=""
                        className="w-6 h-6 rounded-lg object-cover ring-1 ring-emerald-400/50 shrink-0"
                      />
                      <span className="text-slate-300 truncate">
                        สิทธิ์สมาชิก: <strong className="text-white">{currentUser.globalName || currentUser.username}</strong>
                      </span>
                      <span className="ml-auto text-[10px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25 shrink-0">
                        VERIFIED
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        window.location.href = `/api/auth/discord/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
                      }}
                      className="w-full py-4 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-[#5865F2]/30 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
                    >
                      <DiscordIcon className="w-5 h-5 text-white shrink-0 group-hover:scale-110 transition-transform" />
                      <span>เข้าสู่ระบบ Discord เพื่อดาวน์โหลด</span>
                    </button>
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/25 text-xs text-slate-300">
                      <ShieldAlert className="w-4 h-4 text-[#5865F2] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        ต้องเข้าสู่ระบบด้วย Discord ก่อนดาวน์โหลดไฟล์ (เพื่อป้องกันบอทและสแปม)
                      </span>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopyShareUrl}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-cyan-400" />}
                    <span>{copiedLink ? "คัดลอกลิงก์แล้ว!" : "แชร์หน้านี้"}</span>
                  </button>

                  <button
                    onClick={handleOpenAiChatWithProduct}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-green-500/15 to-cyan-500/15 hover:from-green-500/25 hover:to-cyan-500/25 border border-green-500/30 text-green-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span>ถาม Gemini AI</span>
                  </button>
                </div>
              </div>

              {/* Safety Badges */}
              <div className="mt-5 pt-4 border-t border-white/5 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                  <span>ปลอดภัย 100% ไร้ไวรัส เปิดตรวจโค้ดด้วย Notepad ได้</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>มีสคริปต์ Revert คืนค่าเดิมของ Windows แถมให้ในตัว</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Tabs, Specs, Code Viewer, and Reviews (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tabs Header */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b0e17] border border-white/10 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-green-400 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Info className="w-4 h-4" />
                <span>รายละเอียด & ฟีเจอร์</span>
              </button>

              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "code"
                    ? "bg-green-400 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>เปิดดู Source Code</span>
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-green-400 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>รีวิว & ตอบกลับคอมเมนต์</span>
              </button>
            </div>

            {/* Tab 1: Overview & Features */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fadeIn">
                {/* Detailed Description */}
                <div className="p-6 rounded-3xl bg-[#0b0e17] border border-white/10 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCode2 className="w-5 h-5 text-green-400" />
                    <span>คำอธิบายของสคริปต์นี้</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {product.description}
                  </p>
                </div>

                {/* Features List */}
                {product.features && product.features.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0b0e17] border border-white/10 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-5 h-5 text-green-400" />
                      <span>จุดเด่นและการปรับแต่งที่รวมอยู่ในแพ็กเกจ</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-2.5 text-xs text-slate-200"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Included Files */}
                {product.includedFiles && product.includedFiles.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0b0e17] border border-white/10 space-y-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-cyan-400" />
                      <span>ไฟล์ทั้งหมดที่ได้รับในแพ็กเกจ</span>
                    </h3>
                    <div className="space-y-2">
                      {product.includedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <FileCode2 className="w-4 h-4 text-slate-400" />
                            <span className="font-mono text-white font-semibold">{file.filename}</span>
                          </div>
                          <span className="text-slate-400 text-[11px]">{file.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Source Code Transparency */}
            {activeTab === "code" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-6 rounded-3xl bg-[#0b0e17] border border-white/10 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-green-400" />
                      <span>Source Code ของสคริปต์ ({product.name})</span>
                    </h3>
                    {product.scriptContent && (
                      <button
                        onClick={() => handleCopyCode(product.scriptContent!, "script")}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? "คัดลอกโค้ดแล้ว!" : "Copy Source Code"}</span>
                      </button>
                    )}
                  </div>

                  <div className="rounded-2xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-green-300 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {product.scriptContent || ":: โค้ดคำสั่งถูกบรรจุอยู่ในไฟล์ .ZIP ที่ท่านดาวน์โหลดเรียบร้อยแล้ว"}
                  </div>
                </div>

                {/* Revert Script Preview */}
                {product.revertScript && (
                  <div className="p-6 rounded-3xl bg-[#0b0e17] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <RotateCcw className="w-5 h-5 text-cyan-400" />
                        <span>Source Code สำหรับ Revert คืนค่าเดิมของ Windows</span>
                      </h3>
                      <button
                        onClick={() => handleCopyCode(product.revertScript!, "revert")}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedRevert ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedRevert ? "คัดลอกแล้ว!" : "Copy Revert Code"}</span>
                      </button>
                    </div>

                    <div className="rounded-2xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-cyan-300 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      {product.revertScript}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Reviews & Comment Reply Thread */}
            {activeTab === "reviews" && (
              <div className="animate-fadeIn">
                <ProductReviewsSection
                  productId={product.id}
                  currentUser={currentUser}
                  onOpenAuthModal={() => setIsAuthModalOpen(true)}
                  onReviewAdded={(pid, newRating, newCount) => {
                    setProduct((prev) => (prev ? { ...prev, rating: newRating, reviewCount: newCount } : null));
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Related Settings Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-white/10 space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-white">
              สคริปต์และแพ็กเกจ Setting อื่นๆ ที่เกี่ยวข้อง
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/setting/${rel.id}`}
                  className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10 hover:border-green-400/60 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden bg-black/60 mb-3 border border-white/5">
                      <img
                        src={rel.imageUrl}
                        alt={rel.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h4 className="font-bold text-sm text-white group-hover:text-green-300 transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-slate-400 text-xs line-clamp-2 mt-1">
                      {rel.tagline}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5 text-xs">
                    <span className="text-green-400 font-mono font-bold">100% FREE</span>
                    <span className="text-slate-400 flex items-center gap-1 group-hover:text-white">
                      <span>ดูรายละเอียด</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Free Download Modal */}
      <FreeDownloadModal
        isOpen={isDownloading}
        onClose={() => setIsDownloading(false)}
        product={product}
        onDownloadComplete={() => {
          setProduct((prev) => (prev ? { ...prev, downloadsCount: (prev.downloadsCount || 0) + 1 } : null));
        }}
      />

      {/* Gemini AI Assistant Modal */}
      <GeminiAiChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        allProducts={DIGITAL_PRODUCTS}
        onDownloadProduct={() => setIsDownloading(true)}
        onViewProduct={() => {}}
        initialPrompt={aiInitialPrompt}
      />

      {/* Discord Auth Modal */}
      <DiscordAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
        isDiscordConfigured={isDiscordConfigured}
      />
    </div>
  );
}
