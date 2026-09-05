"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { DigitalProduct, ProductCategory, DiscordUser } from "@/types";
import { ProductCard } from "./ProductCard";
import { AdBanner } from "./AdBanner";
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  Cpu, 
  Zap, 
  Wifi, 
  Activity, 
  SlidersHorizontal, 
  FolderOpen, 
  Search, 
  X, 
  RotateCcw 
} from "lucide-react";

const ITEMS_PER_PAGE = 9;

interface ProductCatalogProps {
  products?: DigitalProduct[];
  currentUser?: DiscordUser | null;
  onBuyNow: (product: DigitalProduct) => void;
  onViewDetails: (product: DigitalProduct) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  currentUser,
  onBuyNow,
  onViewDetails,
  searchQuery,
  onSearchChange,
}) => {
  const [internalList, setInternalList] = useState<DigitalProduct[]>(DIGITAL_PRODUCTS);
  const productsList = products !== undefined ? products : internalList;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("all");
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "name">("popular");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch updated products from API on mount only if not supplied by parent
  useEffect(() => {
    if (products !== undefined) return;
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setInternalList(data.products);
        }
      })
      .catch(() => {
        // Fallback to static data
      });
  }, [products]);

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
    { id: "all" as ProductCategory, label: "ทั้งหมด", icon: Layers },
    { id: "bundles" as ProductCategory, label: "ชุดรวมครบวงจร", icon: Sparkles },
    { id: "os-scripts" as ProductCategory, label: "สคริปต์ระบบ", icon: Cpu },
    { id: "gpu-profiles" as ProductCategory, label: "โปรไฟล์การ์ดจอ", icon: Zap },
    { id: "network" as ProductCategory, label: "เน็ตเวิร์ก", icon: Wifi },
    { id: "memory-bios" as ProductCategory, label: "แรม & ไบออส", icon: Activity },
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
      
      {/* Search Input & Quick Tags */}
      <div className="mb-6 space-y-3">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-green-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="ค้นหาชื่อแพ็กเกจ, หมวดหมู่, สคริปต์ เช่น Valorant, Latency, GPU, Windows..."
            className="w-full pl-11 pr-10 py-3 sm:py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.07] focus:bg-black/90 border border-white/15 focus:border-green-400 focus:shadow-[0_0_25px_rgba(74,222,128,0.25)] text-sm sm:text-base text-white placeholder-slate-500 font-sans focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange("");
                setCurrentPage(1);
              }}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="ล้างคำค้นหา"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs font-mono text-slate-400">
          <span className="text-slate-500">คำค้นยอดนิยม:</span>
          {["Valorant", "GPU", "Latency", "Windows 11", "RAM", "Debloat"].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                onSearchChange(tag);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? "bg-green-500/20 text-green-300 border-green-500/40 font-semibold"
                  : "bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 border-white/10"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pills & Sorting */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
        
        {/* Category Tabs (Horizontally scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full lg:flex-wrap">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            const count = cat.id === "all" 
              ? productsList.length 
              : productsList.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-green-500/20 text-green-300 border-2 border-green-400/80 shadow-[0_0_20px_rgba(74,222,128,0.25)]"
                    : "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10 hover:border-white/20"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-green-400" : "text-slate-400"}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? "bg-green-400/20 text-green-300" : "bg-white/5 text-slate-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>เรียงตาม:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 focus:border-green-400 focus:shadow-[0_0_15px_rgba(74,222,128,0.2)] text-xs sm:text-sm text-white focus:outline-none font-sans cursor-pointer transition-all"
          >
            <option value="popular" className="bg-[#11131a] text-white">ยอดดาวน์โหลดสูงสุด</option>
            <option value="rating" className="bg-[#11131a] text-white">เรตติ้งคะแนนรีวิว</option>
            <option value="name" className="bg-[#11131a] text-white">ชื่อไฟล์ (ก-ฮ / A-Z)</option>
          </select>
        </div>

      </div>

      {/* Search & Filter Feedback Banner */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm font-sans">
          <div className="text-slate-300">
            พบ <span className="font-bold text-green-400 font-mono text-sm sm:text-base">{filteredProducts.length}</span> แพ็กเกจ
            {searchQuery && <span> จากการค้นหา &quot;<span className="text-white font-semibold">{searchQuery}</span>&quot;</span>}
            {selectedCategory !== "all" && <span> ในหมวดหมู่ &quot;<span className="text-white font-semibold">{categories.find(c => c.id === selectedCategory)?.label}</span>&quot;</span>}
          </div>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-green-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างตัวกรองทั้งหมด</span>
          </button>
        </div>
      )}

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
                currentUser={currentUser}
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
        <div className="py-16 px-4 text-center rounded-2xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto my-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <FolderOpen className="w-8 h-8 text-slate-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-sans">
              ไม่พบแพ็กเกจที่ตรงกับเงื่อนไข
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
              ลองพิมพ์คำค้นหาอื่น หรือกดปุ่มด้านล่างเพื่อแสดงแพ็กเกจทั้งหมดที่มีในระบบ
            </p>
          </div>
          <button
            onClick={() => {
              onSearchChange("");
              setSelectedCategory("all");
              setCurrentPage(1);
            }}
            className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-semibold font-mono text-slate-950 bg-green-400 hover:bg-green-300 transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg shadow-green-500/20 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>แสดงแพ็กเกจทั้งหมด</span>
          </button>
        </div>
      )}

    </section>
  );
};
