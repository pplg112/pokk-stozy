"use client";

import React, { useState } from "react";
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
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [downloadingProduct, setDownloadingProduct] = useState<DigitalProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartDownload = (product: DigitalProduct) => {
    setDownloadingProduct(product);
  };

  const handleCloseDownload = () => {
    setDownloadingProduct(null);
  };

  const handleDownloadComplete = (record: DownloadRecord) => {
    // Handled smoothly
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex flex-col font-sans selection:bg-green-400 selection:text-slate-950">
      
      {/* Minimal Header */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Clean Hero */}
        <StoreHero />
        
        {/* Products Grid */}
        <ProductCatalog
          onBuyNow={handleStartDownload}
          onViewDetails={setSelectedProduct}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        {/* Minimal FAQ */}
        <FaqSection />
      </main>

      {/* Minimal Footer */}
      <Footer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleStartDownload}
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
