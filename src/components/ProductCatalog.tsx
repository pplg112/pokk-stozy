"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, ProductCategory } from "@/types";
import { ProductCard } from "./ProductCard";
import { AdBanner } from "./AdBanner";

interface ProductCatalogProps {
  onBuyNow: (product: DigitalProduct) => void;
  onViewDetails: (product: DigitalProduct) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onBuyNow,
  onViewDetails,
  searchQuery,
  onSearchChange,
}) => {
  const [productsList, setProductsList] = useState<DigitalProduct[]>(DIGITAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "name">("popular");

  // Fetch updated products from API on mount
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProductsList(data.products);
        }
      })
      .catch(() => {
        // Fallback to static data
      });
  }, []);

  const categories = [
    { id: "all" as ProductCategory, label: "ทั้งหมด" },
    { id: "bundles" as ProductCategory, label: "ชุดรวมครบวงจร" },
    { id: "os-scripts" as ProductCategory, label: "สคริปต์ระบบ" },
    { id: "gpu-profiles" as ProductCategory, label: "โปรไฟล์การ์ดจอ" },
    { id: "network" as ProductCategory, label: "เน็ตเวิร์ก" },
    { id: "memory-bios" as ProductCategory, label: "แรม & ไบออส" },
  ];

  const filteredProducts = useMemo(() => {
    return productsList.filter((prod) => {
      const matchCat = selectedCategory === "all" || prod.category === selectedCategory;
      const matchQuery = 
        !searchQuery || 
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.fileFormat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.downloadsCount - a.downloadsCount;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name") return a.name.localeCompare(b.name, "th");
      return 0;
    });
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="products" className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Category Pills & Sorting */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-green-500/20 text-green-300 border-2 border-green-500/40 shadow-md shadow-green-500/15"
                    : "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
          <span className="text-xs sm:text-sm text-slate-400 font-medium">เรียงตาม:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-white/[0.06] border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-green-400 font-sans cursor-pointer"
          >
            <option value="popular" className="bg-[#11131a] text-white">ยอดดาวน์โหลดสูงสุด</option>
            <option value="rating" className="bg-[#11131a] text-white">เรตติ้งคะแนนรีวิว</option>
            <option value="name" className="bg-[#11131a] text-white">ชื่อไฟล์ (ก-ฮ / A-Z)</option>
          </select>
        </div>

      </div>

      {/* Leaderboard Monetization Slot */}
      <AdBanner slot="leaderboard" className="mb-6" />

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onBuyNow={onBuyNow}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-white/[0.03] border border-white/10 text-base sm:text-lg text-slate-300">
          <p className="mb-3 font-semibold">ไม่พบไฟล์ที่ตรงกับคำค้นหา "{searchQuery}"</p>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedCategory("all");
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

    </section>
  );
};
