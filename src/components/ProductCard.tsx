"use client";

import React from "react";
import Link from "next/link";
import { DigitalProduct, DiscordUser } from "@/types";
import { DiscordIcon } from "@/components/icons/DiscordIcon";
import { 
  FileCode2, 
  Star, 
  Eye, 
  Download, 
  CheckCircle2 
} from "lucide-react";

interface ProductCardProps {
  product: DigitalProduct;
  currentUser?: DiscordUser | null;
  onBuyNow: (product: DigitalProduct) => void;
  onViewDetails: (product: DigitalProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentUser,
  onBuyNow,
  onViewDetails,
}) => {
  const isPopular = product.popular;
  const topFeatures = product.features?.slice(0, 2) || [];

  return (
    <div
      className={`group relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 border overflow-hidden hover:-translate-y-1.5 ${
        isPopular
          ? "bg-[#0d101c]/90 border-cyan-500/40 hover:border-cyan-400/80 shadow-lg shadow-cyan-950/25 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
          : "bg-[#0c0e17]/85 border-white/10 hover:border-green-400/60 shadow-md shadow-black/40 hover:shadow-[0_0_30px_rgba(74,222,128,0.18)]"
      }`}
    >
      <div className="relative z-10">
        {/* Product Cover Image / Banner (Aspect 16:9 Full View) */}
        {product.imageUrl ? (
          <div className="mb-3.5">
            <Link
              href={`/setting/${product.id}`}
              className="block relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 cursor-pointer group/img"
            >
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
              />
            </Link>

            {/* Meta badges placed cleanly below image so nothing is covered */}
            <div className="flex items-center justify-between gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-cyan-300 font-semibold group-hover:border-cyan-500/30 transition-colors">
                <FileCode2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{product.fileFormat}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">{product.fileSize}</span>
              </span>
              {isPopular ? (
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-slate-950 shadow-md shadow-cyan-500/20">
                  ยอดนิยม
                </span>
              ) : (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 border border-white/10">
                  {product.version}
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Top File Meta & Badges (Fallback if no image) */
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-xs font-mono text-cyan-300 font-semibold group-hover:border-cyan-500/30 transition-colors">
              <FileCode2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{product.fileFormat}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">{product.fileSize}</span>
            </span>
            {isPopular ? (
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-cyan-400 to-green-400 text-slate-950 shadow-md shadow-cyan-500/20">
                ยอดนิยม
              </span>
            ) : (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400 border border-white/10">
                {product.version}
              </span>
            )}
          </div>
        )}

        {/* Product Title */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="text-base sm:text-lg font-bold text-white group-hover:text-green-400 transition-colors cursor-pointer mb-2 leading-snug tracking-tight"
        >
          {product.name}
        </h3>

        {/* Short Tagline */}
        <p className="text-xs text-slate-300/90 mb-3.5 line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Top Feature Bullets */}
        {topFeatures.length > 0 && (
          <div className="mb-4 space-y-1.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            {topFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 font-sans">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feat}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Area: Free Badge & Download Action */}
      <div className="relative z-10 pt-3.5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-green-500/20 text-green-300 border border-green-500/40 shadow-sm shadow-green-500/15">
              แจกฟรี 100%
            </span>
            {product.downloadsCount > 0 && (
              <span className="text-[11px] sm:text-xs font-mono text-slate-400 flex items-center gap-1">
                <Download className="w-3 h-3 text-slate-500" />
                {product.downloadsCount.toLocaleString()} โหลด
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-mono font-bold">
            {product.reviewCount > 0 ? (
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-[11px] text-slate-400 font-normal">({product.reviewCount})</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 font-sans font-normal">ยังไม่มีรีวิว</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
          <Link
            href={`/setting/${product.id}`}
            className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            ข้อมูลไฟล์
          </Link>
          {!currentUser ? (
            <button
              onClick={() => onBuyNow(product)}
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] border border-[#7289da]/60 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#5865F2]/25 hover:scale-[1.02] active:scale-95 cursor-pointer font-sans"
              title="เข้าสู่ระบบ Discord เพื่อดาวน์โหลดฟรี"
            >
              <DiscordIcon className="w-3.5 h-3.5 text-white shrink-0" />
              <span>ล็อกอินโหลดฟรี</span>
            </button>
          ) : (
            <button
              onClick={() => onBuyNow(product)}
              className="py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer font-sans"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>ดาวน์โหลดฟรี</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
