export interface AdConfiguration {
  enabled: boolean;
  activeProvider: "adsense" | "adsterra" | "monetag" | "affiliate_sponsor";
  
  // Google AdSense Settings
  adsense: {
    enabled: boolean;
    clientId: string; // ca-pub-xxxxxxxxxxxxxxxx
    customerId: string; // Google AdSense / Ads Customer ID
    leaderboardSlot: string; // Slot ID for 728x90 / responsive
    modalSlot: string; // Slot ID for 300x250
  };

  // Adsterra Settings (Instant approval without site review)
  adsterra: {
    enabled: boolean;
    banner728x90Key: string; // Adsterra 728x90 banner script key
    banner300x250Key: string; // Adsterra 300x250 banner script key
    directSmartLinkUrl: string; // Adsterra SmartLink URL (earns per click/download)
  };

  // Monetag Settings
  monetag: {
    enabled: boolean;
    tagScriptUrl: string;
  };

  // Download Monetization Settings
  downloadMonetization: {
    countdownSeconds: number; // Time user waits before download (default 5s)
    openSmartLinkOnDownload: boolean; // Open sponsor/smartlink in background when downloading
    smartLinkUrl: string;
  };

  // Direct Affiliate Partner (Guaranteed income without ad network approval)
  affiliatePartner: {
    enabled: boolean;
    title: string;
    description: string;
    buttonText: string;
    targetUrl: string;
    badgeText: string;
  };
}

export const ADS_CONFIG: AdConfiguration = {
  enabled: true,
  // เลือกผู้ให้บริการหลัก: 'adsense' (Google), 'adsterra', หรือ 'affiliate_sponsor'
  activeProvider: "adsense",

  adsense: {
    enabled: true,
    clientId: "ca-pub-1057391684109886", // รหัสผู้เผยแพร่โฆษณา Google AdSense
    customerId: "9659834867", // รหัสลูกค้า AdSense
    leaderboardSlot: "9659834867",
    modalSlot: "9659834867",
  },

  adsterra: {
    enabled: true,
    // คีย์ตัวอย่างของ Adsterra (สามารถแทนที่ด้วยคีย์บัญชีจริงของคุณได้จาก adsterra.com)
    banner728x90Key: "b19597c5e533d3e26fb5bb31804f35eb",
    banner300x250Key: "45f9e2b10a71f760884d5930062b1a5d",
    directSmartLinkUrl: "https://www.profitablecpmrate.com/f9m40q6f?key=e86d2673d368d4a9768a35ea285098a7",
  },

  monetag: {
    enabled: false,
    tagScriptUrl: "",
  },

  downloadMonetization: {
    countdownSeconds: 5,
    openSmartLinkOnDownload: true, // เปิดลิงก์สปอนเซอร์/SmartLink ในแท็บใหม่เมื่อกดเริ่มดาวน์โหลด
    smartLinkUrl: "https://www.profitablecpmrate.com/f9m40q6f?key=e86d2673d368d4a9768a35ea285098a7",
  },

  affiliatePartner: {
    enabled: true,
    title: "ExitLag - ซอฟต์แวร์ลดปิงและ Packet Loss 70%",
    description: "แนะนำสำหรับนักแข่ง: เชื่อมต่อ Multipath ทะลวงอาการแล็ก ลด Ping เกมออนไลน์ทั่วโลก",
    buttonText: "ทดลองใช้งานฟรี 3 วัน",
    targetUrl: "https://www.exitlag.com/aff.php?aff=1000",
    badgeText: "พาร์ทเนอร์แนะนำ",
  },
};
