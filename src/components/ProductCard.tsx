"use client";

import React from "react";
import { DigitalProduct } from "@/types";
import { 
  Zap, 
  FileCode2, 
  Star, 
  Eye,
  Download
} from "lucide-react";

interface ProductCardProps {
  product: DigitalProduct;
  onBuyNow: (product: DigitalProduct) => void;
  onViewDetails: (product: DigitalProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onViewDetails,
}) => {
  const isPopular = product.popular;

  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border-2 ${
        isPopular
          ? "bg-[#111420] border-cyan-500/50 hover:border-cyan-400 shadow-xl shadow-cyan-950/30 hover:shadow-cyan-950/50"
          : "bg-[#0f1118]/90 border-white/10 hover:border-green-400/50 shadow-lg hover:shadow-xl"
      }`}
    >
      <div>
        
        {/* Top File Meta & Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs sm:text-sm font-mono text-cyan-300 font-semibold">
            <FileCode2 className="w-4 h-4 text-cyan-400" />
            {product.fileFormat} • {product.fileSize}
          </span>
          {isPopular && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-slate-950 shadow-md">
              ยอดนิยม
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-lg sm:text-xl font-bold text-white hover:text-green-400 transition-colors cursor-pointer mb-2.5 leading-snug"
        >
          {product.name}
        </h3>

        {/* Short Tagline */}
        <p className="text-sm text-slate-300 mb-6 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

      </div>

      {/* Bottom Area: Free Badge & Download Action */}
      <div className="pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="text-sm sm:text-base font-bold font-mono px-3 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40">
              แจกฟรี 100%
            </span>
            <span className="text-xs sm:text-sm font-mono text-slate-400">
              {product.downloadsCount.toLocaleString()} โหลดแล้ว
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-amber-400">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            onClick={() => onViewDetails(product)}
            className="py-3 px-4 rounded-xl text-sm sm:text-base font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            ข้อมูลไฟล์
          </button>
          <button
            onClick={() => onBuyNow(product)}
            className="py-3 px-4 rounded-xl text-sm sm:text-base font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:shadow-green-500/35"
          >
            <Download className="w-4 h-4" />
            ดาวน์โหลดฟรี
          </button>
        </div>
      </div>

    </div>
  );
};
