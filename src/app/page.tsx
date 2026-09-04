"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StoreHero } from "@/components/StoreHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { FreeDownloadModal } from "@/components/FreeDownloadModal";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, DownloadRecord } from "@/types";

export default function HomePage() {
  const [productsList, setProductsList] = useState<DigitalProduct[]>(DIGITAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [downloadingProduct, setDownloadingProduct] = useState<DigitalProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const refreshProducts = () => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(() => {});
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
      <div className="fixed inset-0 bg-grid-cyber pointer-events-none opacity-30 z-0" />
      <div className="fixed -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-gradient-to-b from-green-500/15 via-emerald-500/10 to-transparent blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -left-48 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/10 to-transparent blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-0 -right-48 w-[600px] h-[450px] bg-gradient-to-l from-emerald-500/10 via-green-500/5 to-transparent blur-[150px] pointer-events-none z-0" />

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

    </div>
  );
}
