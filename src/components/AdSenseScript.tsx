"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { ADS_CONFIG } from "@/config/ads";

export function AdSenseScript() {
  const pathname = usePathname();

  // Never load AdSense on admin dashboards or admin sub-routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  if (!ADS_CONFIG.adsense.enabled || !ADS_CONFIG.adsense.clientId) {
    return null;
  }

  return (
    <Script
      id="google-adsense-script"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.adsense.clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
