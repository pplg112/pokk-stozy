"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, ProductCategory } from "@/types";
import { ProductCard } from "./ProductCard";
import { AdBanner } from "./AdBanner";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 9;

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
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch updated products from API on mount
  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
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

  // Reset to page 1 whenever filters change
  const handleCategoryChange = (catId: ProductCategory) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: "popular" | "rating" | "name") => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

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
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  // 9 Slots Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const scrollToTop = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

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
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
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
            onChange={(e) => handleSortChange(e.target.value as any)}
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

      {/* Product Cards Grid (Max 9 slots per page) */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {paginatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onBuyNow={onBuyNow}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>

          {/* Pagination Controls (เลื่อนหน้าเมื่อมีมากกว่า 9 รายการ) */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="text-xs sm:text-sm text-slate-400 font-mono">
                แสดงหน้า <span className="text-white font-bold">{currentPage}</span> จาก <span className="text-white font-bold">{totalPages}</span> (ทั้งหมด {filteredProducts.length} รายการ, 9 รายการต่อหน้า)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === 1}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>ก่อนหน้า</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        scrollToTop();
                      }}
                      className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-green-400 text-slate-950 shadow-md shadow-green-500/20"
                          : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    scrollToTop();
                  }}
                  disabled={currentPage === totalPages}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>ถัดไป</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-white/[0.03] border border-white/10 text-base sm:text-lg text-slate-300">
          <p className="mb-3 font-semibold">ไม่พบไฟล์ที่ตรงกับคำค้นหา "{searchQuery}"</p>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            ล้างตัวกรองทั้งหมด
          </button>
        </div>
      )}

    </section>
  );
};
