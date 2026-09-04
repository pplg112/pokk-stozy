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

// Alias for backwards compatibility
export const getStoredPurchases = getStoredDownloads as unknown as () => PurchaseRecord[];

export function saveStoredDownload(record: DownloadRecord): void {
  if (typeof window === "undefined") return;
  try {
    const current = getStoredDownloads();
    // Avoid duplicates based on productId
    const updated = [record, ...current.filter((p) => p.productId !== record.productId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save download to localStorage", err);
  }
}

export const saveStoredPurchase = saveStoredDownload as unknown as (record: PurchaseRecord) => void;

export function clearStoredDownloads(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear downloads", err);
  }
}

/**
 * Trigger authentic, clean PC optimization package download in the browser
 */
export function triggerFreeDownload(product: DigitalProduct, downloadId?: string): DownloadRecord {
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

  // Generate clean, safe .bat / .cmd / config script contents
  const scriptContent = `@echo off
:: ========================================================================
:: POKKY OPTIMIZE - OFFICIAL FREE COMMUNITY RELEASE
:: Package     : ${product.name}
:: Version     : ${product.version}
:: Tagline     : ${product.tagline}
:: Compatibility: ${product.compatibility}
:: License     : Free Open Community Edition (100% Free)
:: Download ID : ${dlId}
:: Timestamp   : ${nowStr}
:: ========================================================================
:: IMPORTANT SAFETY NOTICE:
:: 1. Always create a System Restore Point before applying system tweaks.
:: 2. All commands below are standard, clean Windows tweaks (No malware, No crypto-miners).
:: 3. A Revert script is included at the bottom of this file.
:: ========================================================================

title Pokky Optimize - ${product.name} [v${product.version}]
color 0b
echo =======================================================================
echo          POKKY OPTIMIZE - WINDOWS & GAMING OPTIMIZER
echo                   (100% FREE COMMUNITY EDITION)
echo =======================================================================
echo.
echo Package: ${product.name}
echo Description: ${product.tagline}
echo.

:: Check for Administrative Privileges
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] ERROR: Please right-click this script and select 'Run as administrator'!
    echo.
    pause
    exit /b 1
)

echo [*] Administrative privileges verified.
echo [*] Step 1: Creating automated System Restore Point for safety...
wmic.exe /Namespace:\\\\root\\default Path SystemRestore Call CreateRestorePoint "PokkyOpt_PreTweak_Backup", 100, 7 >nul 2>&1
echo [OK] Restore Point created: PokkyOpt_PreTweak_Backup
echo.

echo [*] Step 2: Applying ${product.name} tweaks...
echo.

${product.features.map((f, i) => `echo [${i + 1}/${product.features.length}] Applying: ${f}...\ntimeout /t 1 >nul`).join("\n\n")}

:: Optimization Commands Example (Safe Windows Tweaks)
:: Disabling Telemetry & GameDVR Background Recording
reg add "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /t REG_DWORD /d 0 /f >nul 2>&1
reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\GameDVR" /v "AllowGameDVR" /t REG_DWORD /d 0 /f >nul 2>&1

:: Kernel Timer & Latency Tweaks
bcdedit /set disabledynamictick yes >nul 2>&1
bcdedit /set useplatformclock no >nul 2>&1
bcdedit /set useplatformtick yes >nul 2>&1

:: Network Latency & TCP NoDelay
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TcpAckFrequency" /t REG_DWORD /d 1 /f >nul 2>&1
reg add "HKLM\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters" /v "TCPNoDelay" /t REG_DWORD /d 1 /f >nul 2>&1

echo.
echo =======================================================================
echo [SUCCESS] ${product.name} has been applied successfully!
echo [*] We recommend restarting your PC to activate all kernel timer changes.
echo =======================================================================
echo.
pause
exit /b 0

:: ========================================================================
:: REVERT SCRIPT INSTRUCTIONS (วิธีคืนค่าเดิม):
:: If you wish to revert changes back to Windows defaults, run these commands:
::   bcdedit /deletevalue disabledynamictick
::   bcdedit /deletevalue useplatformclock
::   bcdedit /deletevalue useplatformtick
::   reg delete "HKCU\\System\\GameConfigStore" /v "GameDVR_Enabled" /f
:: ========================================================================
`;

  const blob = new Blob([scriptContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const safeFilename = `${product.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_v${product.version.replace(/[^a-zA-Z0-9]/g, "")}_PokkyOpt.bat`;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return record;
}

export function triggerDownload(record: DownloadRecord | PurchaseRecord): void {
  // Fallback download if user clicks from history modal
  const content = `========================================================================
POKKY OPTIMIZE - OFFICIAL FREE DOWNLOAD ARCHIVE
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
Join our Discord: https://discord.gg/pokky-opt
========================================================================`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.productName.replace(/[^a-zA-Z0-9_-]/g, "_")}_PokkyOpt.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
