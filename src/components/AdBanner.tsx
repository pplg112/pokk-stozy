"use client";

import React, { useEffect, useState } from "react";
import { ADS_CONFIG } from "@/config/ads";
import { Sparkles, ExternalLink, Copy, Check } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  slot: "modal" | "leaderboard" | "infeed";
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = "" }) => {
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  if (!ADS_CONFIG.enabled) return null;

  const provider = ADS_CONFIG.activeProvider;
  const partner = ADS_CONFIG.affiliatePartner;

  const handleCopyCoupon = () => {
    if (partner.couponCode) {
      navigator.clipboard.writeText(partner.couponCode);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  };

  useEffect(() => {
    if (provider === "adsense") {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense script already initialized or blocked by client
      }
    }
  }, [provider, slot]);

  // 1. Google AdSense Provider (With Rich Sponsor Creative & Safe AdSense Embed)
  if (provider === "adsense" && ADS_CONFIG.adsense.enabled && ADS_CONFIG.adsense.clientId) {
    const slotId =
      slot === "modal"
        ? ADS_CONFIG.adsense.modalSlot
        : ADS_CONFIG.adsense.leaderboardSlot;

    return (
      <div className={`w-full overflow-hidden my-4 sm:my-5 ${className}`}>
        {/* Ad Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400 mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-red-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>พาร์ทเนอร์ผู้สนับสนุนทางการ (Official Gaming Partner)</span>
          </div>
          <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            AdSense ID: {ADS_CONFIG.adsense.clientId}
          </span>
        </div>

        {/* High-Converting ExitLag Sponsor Card */}
        <div className="w-full rounded-2xl border border-red-500/35 bg-gradient-to-r from-[#160d0f] via-[#0d1017] to-[#0c141d] p-4.5 sm:p-5 shadow-[0_0_35px_rgba(239,68,68,0.14)] relative overflow-hidden group">
          {/* Ambient red neon glow */}
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
            {/* Left: Logo & Info */}
            <div className="flex items-start sm:items-center gap-3.5">
              {/* Official ExitLag Logo */}
              <a 
                href={partner.targetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative p-2 rounded-2xl bg-black/75 border border-red-500/40 shadow-md shadow-red-950/40 shrink-0 hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={partner.logoUrl || "/exitlag-logo.png"}
                  alt="ExitLag Logo"
                  className="w-11 h-11 sm:w-13 sm:h-13 object-contain drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                />
              </a>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a 
                    href={partner.targetUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm sm:text-base font-extrabold text-white font-sans hover:text-red-400 transition-colors"
                  >
                    {partner.title}
                  </a>
                  <span className="px-2 py-0.5 text-[10px] rounded-md bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/35">
                    {partner.badgeText}
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] rounded-md bg-white/5 text-slate-300 font-mono border border-white/10">
                    ลดปิง & Packet Loss
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-2xl">
                  {partner.description}
                </p>

                {/* Coupon Code Pill */}
                {partner.couponCode && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-xs font-mono">
                      <span className="text-slate-400 text-[11px]">คูปองลดพิเศษ:</span>
                      <span className="font-extrabold text-amber-400 tracking-wider">
                        {partner.couponCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCoupon}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/30 transition-all flex items-center gap-1 cursor-pointer"
                        title="คลิกเพื่อคัดลอกโค้ดคูปอง"
                      >
                        {copiedCoupon ? (
                          <>
                            <Check className="w-3 h-3 text-green-400" />
                            <span className="text-green-300">คัดลอกแล้ว</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-amber-300" />
                            <span>คัดลอก</span>
                          </>
                        )}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 font-sans hidden sm:inline">
                      (กรอกคูปองในเว็บเพื่อรับสิทธิ์และส่วนลด)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="shrink-0 flex items-center gap-3">
              <a
                href={partner.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-mono font-bold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{partner.buttonText}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Adsterra / CPM Network Provider (Real Banner Embed via Clean Iframe)
  if (provider === "adsterra" && ADS_CONFIG.adsterra.enabled) {
    const isModal = slot === "modal";
    const width = isModal ? 300 : 728;
    const height = isModal ? 250 : 90;
    const key = isModal ? ADS_CONFIG.adsterra.banner300x250Key : ADS_CONFIG.adsterra.banner728x90Key;

    const adHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; align-items: center; overflow: hidden; }
</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key' : '${key}',
    'format' : 'iframe',
    'height' : ${height},
    'width' : ${width},
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.topcreativeformat.com/${key}/invoke.js"></script>
</body>
</html>`;

    return (
      <div className={`w-full flex flex-col items-center justify-center my-3 ${className}`}>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-1 uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-red-400" />
          <span>Sponsored Advertisement / ผู้สนับสนุน</span>
        </div>
        <div className="w-full flex justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 p-1">
          <iframe
            title={`Adsterra Ad ${slot}`}
            srcDoc={adHtml}
            width={width}
            height={height}
            className="border-0 max-w-full"
            scrolling="no"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    );
  }

  // 3. Fallback: High-Converting Gaming Affiliate Sponsor
  if (slot === "modal") {
    return (
      <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-red-500/10 via-white/[0.03] to-[#0c141d] border border-red-500/35 relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{partner.badgeText}</span>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">
            Official Partner
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={partner.logoUrl || "/exitlag-logo.png"}
              alt="ExitLag Logo"
              className="w-10 h-10 object-contain shrink-0 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            />
            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-white font-sans">
                {partner.title}
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {partner.description}
              </p>
              {partner.couponCode && (
                <div className="flex items-center gap-2 pt-1 text-xs font-mono">
                  <span className="text-slate-400">คูปอง:</span>
                  <span className="text-amber-400 font-bold">{partner.couponCode}</span>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold"
                  >
                    {copiedCoupon ? "คัดลอกแล้ว" : "คัดลอก"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <a
            href={partner.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl text-sm font-mono font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 cursor-pointer"
          >
            <span>{partner.buttonText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-sans ${className}`}>
      <div className="flex items-center gap-4">
        <img
          src={partner.logoUrl || "/exitlag-logo.png"}
          alt="ExitLag Logo"
          className="w-9 h-9 object-contain shrink-0"
        />
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-white font-bold text-sm sm:text-base font-sans">
              {partner.title}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-md bg-red-500/15 border border-red-500/30 text-red-400 font-mono">
              {partner.badgeText}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans line-clamp-1 mt-1">
            {partner.description}
          </p>
        </div>
      </div>

      <a
        href={partner.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start sm:self-center shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-2"
      >
        <span>ดูรายละเอียด</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};
