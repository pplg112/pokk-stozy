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

    </div>
  );
}
