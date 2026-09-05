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
  metadataBase: new URL("https://pokkystozy.xyz"),
  title: "Pokky Stozy",
  description: "ศูนย์รวมไฟล์และสคริปต์ปรับแต่ง Windows & Gaming PC สำหรับผู้เล่นสายแข่งขัน ลด DPC Latency เพิ่ม FPS ดาวน์โหลดฟรี 100% ปลอดภัย พร้อมไฟล์ Revert",
  keywords: [
    "Pokky Stozy",
    "pokkystozy",
    "pokky stozy",
    "pokkystozy.xyz",
    "Pokky Stozy Optimize",
    "Optimize PC",
    "ลด Latency",
    "เพิ่ม FPS",
    "สคริปต์ Windows",
    "Gaming Optimizer",
  ],
  alternates: {
    canonical: "https://pokkystozy.xyz",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Pokky Stozy",
    description: "ศูนย์รวมไฟล์และสคริปต์ปรับแต่ง Windows & Gaming PC ลด DPC Latency เพิ่ม FPS ดาวน์โหลดฟรี 100%",
    url: "https://pokkystozy.xyz",
    siteName: "Pokky Stozy",
    locale: "th_TH",
    type: "website",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Pokky Stozy",
    alternateName: ["pokkystozy", "Pokky Stozy Optimize Store"],
    url: "https://pokkystozy.xyz",
    description: "ศูนย์รวมไฟล์และสคริปต์ปรับแต่ง Windows & Gaming PC สำหรับผู้เล่นสายแข่งขัน ลด DPC Latency เพิ่ม FPS ดาวน์โหลดฟรี 100%",
  };

  return (
    <html lang="th" className={`dark scroll-smooth ${promptFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
