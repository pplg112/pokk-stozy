"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreHero } from "@/components/StoreHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { FreeDownloadModal } from "@/components/FreeDownloadModal";
import { GeminiAiChatModal } from "@/components/GeminiAiChatModal";
import { DiscordAuthModal } from "@/components/DiscordAuthModal";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, DownloadRecord, DiscordUser } from "@/types";
import { ArrowUp, Sparkles, Bot, ArrowRight, Zap, Flame, Wifi, Cpu } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [productsList, setProductsList] = useState<DigitalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [downloadingProduct, setDownloadingProduct] = useState<DigitalProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState("");
  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDiscordConfigured, setIsDiscordConfigured] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const refreshProducts = async () => {
    const startTime = Date.now();
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProductsList(data.products);
      } else {
        // API returned empty, use static fallback
        setProductsList(DIGITAL_PRODUCTS);
      }
    } catch {
      // Network error, use static fallback
      setProductsList(DIGITAL_PRODUCTS);
    } finally {
      const elapsed = Date.now() - startTime;
      const minDuration = 650;
      const delay = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }, delay);
    }
  };

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
    refreshProducts();
    checkUserSession();
  }, []);

  const handleOpenProduct = (product: DigitalProduct) => {
    setSelectedProduct(product);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("product", product.id);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("product");
      const newUrl = url.pathname + (url.search ? url.search : "");
      window.history.replaceState(null, "", newUrl);
    }
  };

  // Auto-open product modal if ?product=ID is present in URL
  useEffect(() => {
    if (productsList.length > 0 && typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get("product");
      if (prodId && !selectedProduct) {
        const found = productsList.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
        }
      }
    }
  }, [productsList, selectedProduct]);

  const handleStartDownload = (product: DigitalProduct) => {
    setDownloadingProduct(product);
  };

  const handleCloseDownload = () => {
    setDownloadingProduct(null);
  };

  const handleDownloadComplete = (record: DownloadRecord) => {
    // Increment local download count immediately
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === record.productId
          ? { ...p, downloadsCount: (p.downloadsCount || 0) + 1 }
          : p
      )
    );
  };

  const handleReviewAdded = (productId: string, newRating: number, newReviewCount: number) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, rating: newRating, reviewCount: newReviewCount }
          : p
      )
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev
          ? { ...prev, rating: newRating, reviewCount: newReviewCount }
          : null
      );
    }
  };

  const handleOpenAiChat = (prompt?: string) => {
    setAiInitialPrompt(prompt || "");
    setIsAiChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-green-400 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Dynamic Cyber Grid & Neon Ambient Glow Background */}
      <CyberBackground />

      {/* Header */}
      <div className="relative z-40">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAiChat={() => handleOpenAiChat()}
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

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Vibrant Esports Hero */}
        <StoreHero onOpenAiChat={() => handleOpenAiChat()} currentUser={currentUser} />

        {/* Products Grid */}
        <div id="products">
          <ProductCatalog
            products={productsList}
            currentUser={currentUser}
            onBuyNow={handleStartDownload}
            onViewDetails={handleOpenProduct}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
        
        {/* Gemini AI PC Optimizer Assistant Banner - Sleek Dark Theme */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-3xl bg-[#0b0e17] border border-white/10 p-6 sm:p-10 overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>POKKY GEMINI AI • ผู้ช่วยปรับแต่งคอมพิวเตอร์อัจฉริยะ</span>
                </div>
                
                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                  ไม่แน่ใจว่าใช้สคริปต์ไหนดี?{" "}
                  <span className="text-emerald-400">
                    ปรึกษา Gemini AI ได้ฟรี
                  </span>
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  ถาม AI ช่วยวิเคราะห์อาการคอมกระตุก เฟรมดรอปใน Valorant หรือ FiveM, ปัญหาเน็ตแกว่งปิงสูง, หรืออาการเมาส์หน่วง ระบบจะคัดสรรสคริปต์ที่ตรงจุดที่สุดให้ดาวน์โหลดทันที
                </p>

                {/* Popular Quick Prompt Chips */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                  <button
                    onClick={() => handleOpenAiChat("เล่น Valorant แล้วเฟรมตก เล็งยิงไม่ค่อยคม แนะนำสคริปต์ปรับแต่งหน่อยครับ")}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 text-xs text-slate-300 hover:text-green-300 transition-all cursor-pointer flex items-center gap-1.5 group active:scale-95"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>ดัน FPS Valorant</span>
                  </button>
                  <button
                    onClick={() => handleOpenAiChat("เล่น FiveM ขับรถเร็วๆ แล้วแมพโหลดไม่ทัน เฟรมดรอป มีตัวช่วยมั้ยครับ")}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 text-xs text-slate-300 hover:text-green-300 transition-all cursor-pointer flex items-center gap-1.5 group active:scale-95"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span>แก้ FiveM กระตุกในเมือง</span>
                  </button>
                  <button
                    onClick={() => handleOpenAiChat("เล่นเกมออนไลน์แล้วปิงแกว่ง Packet loss ขึ้นบ่อย แก้ยังไงดีครับ")}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 text-xs text-slate-300 hover:text-green-300 transition-all cursor-pointer flex items-center gap-1.5 group active:scale-95"
                  >
                    <Wifi className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>ลด Ping & Packet Loss</span>
                  </button>
                  <button
                    onClick={() => handleOpenAiChat("Windows 11 แรม 8GB-16GB รู้สึกเครื่องหน่วงและกินแรมเยอะ แนะนำตัวล้างระบบหน่อยครับ")}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 text-xs text-slate-300 hover:text-green-300 transition-all cursor-pointer flex items-center gap-1.5 group active:scale-95"
                  >
                    <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>เคลียร์ RAM Win 11</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                <button
                  onClick={() => handleOpenAiChat()}
                  className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-300 hover:from-green-300 hover:to-emerald-200 text-slate-950 font-mono font-bold text-sm transition-all flex items-center gap-2.5 shadow-xl shadow-green-500/25 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Bot className="w-5 h-5" />
                  <span>เริ่มคุยกับ Gemini AI</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span>AI พร้อมให้คำปรึกษาตลอด 24 ชั่วโมง</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={handleCloseProduct}
        onBuyNow={handleStartDownload}
        onReviewAdded={handleReviewAdded}
      />

      {/* 100% Free Download Modal */}
      <FreeDownloadModal
        isOpen={!!downloadingProduct}
        onClose={handleCloseDownload}
        product={downloadingProduct}
        currentUser={currentUser}
        onDownloadComplete={handleDownloadComplete}
      />

      {/* Gemini AI Chat Assistant Modal */}
      <GeminiAiChatModal
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        allProducts={productsList}
        onDownloadProduct={handleStartDownload}
        onViewProduct={handleOpenProduct}
        initialPrompt={aiInitialPrompt}
      />

      {/* Cyber Esports Loading Screen */}
      {isLoading && (
        <LoadingScreen
          isFadingOut={isFadingOut}
          subMessage="ESPORTS SYSTEM OPTIMIZER"
        />
      )}

      {/* Floating Gemini AI Trigger Button */}
      <button
        onClick={() => handleOpenAiChat()}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0d131f] via-[#101b2b] to-[#0c1824] border border-green-500/40 hover:border-green-400 text-white shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:shadow-[0_0_35px_rgba(34,197,94,0.5)] backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer group active:scale-95"
        title="ปรึกษาและถามปัญหากับ Pokky Gemini AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-white group-hover:text-green-300 transition-colors flex items-center gap-1">
            <span>ถาม Gemini AI</span>
            <span className="text-[9px] bg-green-400 text-black px-1 rounded font-mono font-black">PRO</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">วิเคราะห์สเปก & สคริปต์ฟรี</span>
        </div>
      </button>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-22 right-6 z-30 p-3 sm:p-3 rounded-2xl bg-black/80 hover:bg-green-400 border border-white/20 hover:border-green-400 text-white hover:text-slate-950 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer group active:scale-95"
          title="กลับขึ้นด้านบน"
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}

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
