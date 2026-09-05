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
import { ArrowUp } from "lucide-react";

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
          onViewDetails={setSelectedProduct}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
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
        onClose={() => setSelectedProduct(null)}
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
