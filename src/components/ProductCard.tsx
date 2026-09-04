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
      className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 border ${
        isPopular
          ? "bg-[#111420] border-cyan-500/50 hover:border-cyan-400 shadow-lg shadow-cyan-950/20 hover:shadow-cyan-950/40"
          : "bg-[#0f1118]/90 border-white/10 hover:border-green-400/50 shadow-md hover:shadow-lg"
      }`}
    >
      <div>
        
        {/* Top File Meta & Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 font-semibold">
            <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
            {product.fileFormat} • {product.fileSize}
          </span>
          {isPopular && (
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-slate-950 shadow-sm">
              ยอดนิยม
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-base sm:text-lg font-bold text-white hover:text-green-400 transition-colors cursor-pointer mb-1.5 leading-snug"
        >
          {product.name}
        </h3>

        {/* Short Tagline */}
        <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

      </div>

      {/* Bottom Area: Free Badge & Download Action */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-bold font-mono px-2.5 py-0.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/40">
              แจกฟรี 100%
            </span>
            <span className="text-xs font-mono text-slate-400">
              {product.downloadsCount.toLocaleString()} โหลดแล้ว
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <button
            onClick={() => onViewDetails(product)}
            className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            ข้อมูลไฟล์
          </button>
          <button
            onClick={() => onBuyNow(product)}
            className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-green-500/20 hover:shadow-green-500/35"
          >
            <Download className="w-3.5 h-3.5" />
            ดาวน์โหลดฟรี
          </button>
        </div>
      </div>

    </div>
  );
};
