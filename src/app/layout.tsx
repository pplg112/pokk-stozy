import type { Metadata, Viewport } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

import Script from "next/script";
import { ADS_CONFIG } from "@/config/ads";

export const metadata: Metadata = {
  title: "Pokky Optimize | ศูนย์รวมไฟล์และสคริปต์ Optimize PC แจกฟรี 100%",
  description: "ศูนย์รวมไฟล์และสคริปต์ปรับแต่ง Windows & Gaming PC สำหรับผู้เล่นสายแข่งขัน ลด DPC Latency เพิ่ม FPS ดาวน์โหลดฟรี 100% ปลอดภัย พร้อมไฟล์ Revert",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  other: {
    "google-adsense-account": "ca-pub-1057391684109886",
  },
};

export const viewport: Viewport = {
  themeColor: "#090A0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`dark scroll-smooth ${promptFont.variable}`}>
      <head>
        {ADS_CONFIG.adsense.enabled && ADS_CONFIG.adsense.clientId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.adsense.clientId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen bg-[#08090d] text-slate-100 antialiased selection:bg-green-500 selection:text-slate-950 font-sans font-normal">
        {children}
      </body>
    </html>
  );
}
