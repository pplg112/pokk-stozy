"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreHero } from "@/components/StoreHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { FreeDownloadModal } from "@/components/FreeDownloadModal";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, DownloadRecord } from "@/types";
import { ArrowUp, Gamepad2, Flame, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [productsList, setProductsList] = useState<DigitalProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [downloadingProduct, setDownloadingProduct] = useState<DigitalProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

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

  useEffect(() => {
    refreshProducts();
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

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-green-400 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Dynamic Cyber Grid & Neon Ambient Glow Background */}
      <CyberBackground />

      {/* Header */}
      <div className="relative z-40">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Vibrant Esports Hero */}
        <StoreHero />
        
        {/* Products Grid */}
        <ProductCatalog
          products={productsList}
          onBuyNow={handleStartDownload}
          onViewDetails={handleOpenProduct}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Community Highlight Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative rounded-3xl bg-gradient-to-r from-[#0d0f1a] via-[#101424] to-[#0d0f1a] border border-green-500/25 p-6 sm:p-10 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold">
                  <Flame className="w-3.5 h-3.5" />
                  <span>POKKY GAMING COMMUNITY</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ฟีดคอมมูนิตี้ชาวแก๊งค์ & ผลเทส FPS จริง
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  ดูผลเปรียบเทียบเฟรมเรต Before/After จากเพื่อนๆ ที่ใช้งานสคริปต์จริง แชร์การตั้งค่า และดาวน์โหลดสคริปต์ตามเพื่อนได้ทันที
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-white font-bold">+145 FPS</span>
                  <span className="text-slate-400">(เฉลี่ย)</span>
                </div>

                <Link
                  href="/community"
                  className="py-3 px-6 rounded-2xl bg-green-400 hover:bg-green-300 text-slate-950 font-mono font-bold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xl shadow-green-500/25 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>เปิดดูกระดานฟีดชุมชน</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
        onDownloadComplete={handleDownloadComplete}
      />

      {/* Cyber Esports Loading Screen */}
      {isLoading && (
        <LoadingScreen
          isFadingOut={isFadingOut}
          subMessage="ESPORTS SYSTEM OPTIMIZER"
        />
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 p-3 sm:p-3.5 rounded-2xl bg-black/80 hover:bg-green-400 border border-white/20 hover:border-green-400 text-white hover:text-slate-950 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer group active:scale-95"
          title="กลับขึ้นด้านบน"
        >
          <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}

    </div>
  );
}
