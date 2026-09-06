import { DownloadRecord, PurchaseRecord, DigitalProduct } from "@/types";

const STORAGE_KEY = "pokky_download_history";
const OLD_STORAGE_KEY = "pokky_purchase_history";

export function getStoredDownloads(): DownloadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    
    // Check old key for migration
    const oldRaw = localStorage.getItem(OLD_STORAGE_KEY);
    if (oldRaw) {
      const oldData: PurchaseRecord[] = JSON.parse(oldRaw);
      const migrated: DownloadRecord[] = oldData.map((d) => ({
        downloadId: d.downloadId || d.orderId || `DL-${Date.now()}`,
        productId: d.productId,
        productName: d.productName,
        version: d.version,
        fileFormat: d.fileFormat,
        fileSize: d.fileSize,
        downloadDate: d.downloadDate || d.purchaseDate || "ก่อนหน้า",
        includedFiles: d.includedFiles,
      }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return [];
  } catch (err) {
    console.error("Failed to read downloads from localStorage", err);
    return [];
  }
}

export function saveStoredDownload(record: DownloadRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredDownloads();
    const updated = [record, ...current.filter((p) => p.productId !== record.productId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save download to localStorage", err);
  }
}

export function clearStoredDownloads(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear downloads", err);
  }
}

export function recordFreeDownload(product: DigitalProduct, downloadId?: string): DownloadRecord {
  const dlId = downloadId || `DL-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  const nowStr = new Date().toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const record: DownloadRecord = {
    downloadId: dlId,
    productId: product.id,
    productName: product.name,
    version: product.version,
    fileFormat: product.fileFormat,
    fileSize: product.fileSize,
    downloadDate: nowStr,
    includedFiles: product.includedFiles,
  };

  saveStoredDownload(record);
  return record;
}

export function triggerDownload(record: DownloadRecord | PurchaseRecord): void {
  // If productId exists, download the actual package from API directly
  if (record.productId) {
    const link = document.createElement("a");
    link.href = `/api/download/${record.productId}`;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Fallback info text file if no productId is available
  const content = `========================================================================
POKKY STOZY - OFFICIAL FREE DOWNLOAD ARCHIVE
DOWNLOAD ID  : ${record.downloadId || (record as PurchaseRecord).orderId || "DL-ARCHIVE"}
PACKAGE      : ${record.productName} (${record.version})
FORMAT       : ${record.fileFormat} (${record.fileSize})
DATE         : ${record.downloadDate || (record as PurchaseRecord).purchaseDate || "N/A"}
STATUS       : 100% FREE COMMUNITY RELEASE
========================================================================

INCLUDED FILES IN THIS PACKAGE:
${record.includedFiles ? record.includedFiles.map((f, i) => `${i + 1}. ${f.filename} - ${f.description}`).join("\n") : "Complete optimization suite"}

HOW TO INSTALL:
1. Extract or run the file as administrator.
2. Ensure you create a System Restore Point before tweaking.
3. Restart your computer to finalize timer and latency improvements.

REVERT TO DEFAULTS:
To revert back to Windows standard defaults, run the included Revert script
or restore your System Restore Point from Control Panel > Recovery.

Need assistance or want to share benchmark results?
Join our Discord: https://discord.gg/eHa8MQu7mz
========================================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.productName.replace(/[^a-zA-Z0-9_-]/g, "_")}_PokkyStozy.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
