"use client";

import React, { useEffect, useRef } from "react";
import { ADS_CONFIG } from "@/config/ads";
import { Sparkles, ExternalLink, ShieldCheck, Zap } from "lucide-react";

interface AdBannerProps {
  slot: "modal" | "leaderboard" | "infeed";
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot, className = "" }) => {
  if (!ADS_CONFIG.enabled) return null;

  const provider = ADS_CONFIG.activeProvider;
  const partner = ADS_CONFIG.affiliatePartner;

  useEffect(() => {
    if (provider === "adsense") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
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
      <div className={`w-full overflow-hidden my-6 ${className}`}>
        {/* AdSense Watermark & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 mb-2.5 px-1">
          <div className="flex items-center gap-1.5 text-green-400 font-semibold">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span>พาร์ทเนอร์ผู้สนับสนุน (Sponsored Partner)</span>
          </div>
          <span className="text-[11px] text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/10">
            AdSense ID: {ADS_CONFIG.adsense.clientId}
          </span>
        </div>

        {/* Rich Esports Sponsor Card */}
        <div className="w-full rounded-2xl border-2 border-green-500/30 bg-gradient-to-r from-[#0d1512] via-[#0e1017] to-[#0c141d] p-5 sm:p-6 shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 shrink-0 mt-0.5">
                <Zap className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-white font-sans">
                    {partner.title}
                  </h4>
                  <span className="px-2 py-0.5 text-xs rounded-md bg-green-500/20 text-green-400 font-mono font-bold border border-green-500/30">
                    {partner.badgeText}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed max-w-2xl">
                  {partner.description}
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    ลด DPC Latency 70%
                  </span>
                  <span>•</span>
                  <span>เชื่อมต่อ Multipath เส้นทางตรง</span>
                  <span>•</span>
                  <span className="text-slate-300">Valorant, CS2, FiveM, Apex</span>
                </div>
              </div>
            </div>

            <a
              href={partner.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 self-start md:self-center px-6 py-3.5 rounded-xl text-sm font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40"
            >
              <span>{partner.buttonText}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Embedded Google AdSense Script ins Tag (Hidden or Auto-Displayed when Google serves live ads) */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <ins
              className="adsbygoogle"
              style={{ display: "block", textAlign: "center" }}
              data-ad-client={ADS_CONFIG.adsense.clientId}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
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
          <Sparkles className="w-3 h-3 text-green-400" />
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
      <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-green-500/10 via-white/[0.03] to-cyan-500/10 border border-green-500/30 relative overflow-hidden ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-green-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{partner.badgeText}</span>
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase">
            Sponsored Partner
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h4 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400 shrink-0" />
              <span>{partner.title}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {partner.description}
            </p>
          </div>

          <a
            href={partner.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl text-sm font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
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
        <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-white font-bold text-sm sm:text-base font-sans">
              {partner.title}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-md bg-white/5 border border-white/10 text-slate-300 font-mono">
              สปอนเซอร์
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
        className="self-start sm:self-center shrink-0 px-4 py-2.5 rounded-xl text-sm font-bold text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 transition-colors flex items-center gap-2"
      >
        <span>ดูรายละเอียด</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
};
