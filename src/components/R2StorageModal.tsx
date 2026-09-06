"use client";

import React, { useState, useEffect } from "react";
import { Cloud, X, Loader2, CheckCircle2, AlertTriangle, Key, ExternalLink, Eye, EyeOff, ShieldCheck, RefreshCw } from "lucide-react";

interface R2StorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated?: () => void;
}

export const R2StorageModal: React.FC<R2StorageModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [message, setMessage] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  const [config, setConfig] = useState({
    accountId: "",
    accessKeyId: "",
    secretAccessKey: "",
    bucketName: "pokky-packages",
    isConfigured: false,
  });

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("pokky_admin_token");
    return token ? { "x-admin-token": token } : {};
  };

  const loadConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/r2/config", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setConfig({
            accountId: data.config?.accountId || "",
            accessKeyId: data.config?.accessKeyId || "",
            secretAccessKey: data.config?.secretAccessKey || "",
            bucketName: data.config?.bucketName || "pokky-packages",
            isConfigured: Boolean(data.isConfigured),
          });
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadConfig();
      setTestResult(null);
      setMessage("");
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      const res = await fetch("/api/admin/r2/test", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      setTestResult({
        success: Boolean(data.success),
        message: data.message || (data.success ? "เชื่อมต่อ Cloudflare R2 สำเร็จ!" : "เชื่อมต่อล้มเหลว"),
      });
    } catch {
      setTestResult({ success: false, message: "ไม่สามารถส่งคำขอทดสอบได้ กรุณาตรวจสอบการเชื่อมต่อ" });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/admin/r2/config", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("บันทึกการตั้งค่า Cloudflare R2 เรียบร้อยแล้ว!");
        setConfig((prev) => ({ ...prev, isConfigured: true }));
        onConfigUpdated?.();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setTestResult({ success: false, message: data.error || "บันทึกไม่สำเร็จ" });
      }
    } catch {
      setTestResult({ success: false, message: "เกิดข้อผิดพลาดในการบันทึก" });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0c0e17] border border-orange-500/30 shadow-[0_0_50px_rgba(249,115,22,0.15)] text-left overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">ตั้งค่า Cloudflare R2 Storage</h3>
                {config.isConfigured ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> เชื่อมต่อแล้ว
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ยังไม่ได้ตั้งค่า
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">พื้นที่จัดเก็บไฟล์ขนาดใหญ่ ฟรี 10 GB ไม่จำกัดแบนด์วิดท์ดาวน์โหลด</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {message && (
            <div className="p-3.5 rounded-2xl bg-green-500/15 border border-green-500/30 text-green-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {testResult && (
            <div
              className={`p-3.5 rounded-2xl border text-xs font-mono flex items-start gap-2.5 ${
                testResult.success
                  ? "bg-green-500/15 border-green-500/30 text-green-300"
                  : "bg-rose-500/15 border-rose-500/30 text-rose-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            {/* Account ID */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>Cloudflare Account ID *</span>
                <span className="text-[11px] text-slate-400 font-sans">ดูได้จากหน้า URL หรือหน้า Overview ของ Cloudflare</span>
              </label>
              <input
                type="text"
                required
                value={config.accountId}
                onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                placeholder="เช่น 7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Access Key ID */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>R2 Access Key ID *</span>
                <span className="text-[11px] text-slate-400 font-sans">ได้จาก Manage R2 API Tokens</span>
              </label>
              <input
                type="text"
                required
                value={config.accessKeyId}
                onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
                placeholder="เช่น 31a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Secret Access Key */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>R2 Secret Access Key *</span>
                <span className="text-[11px] text-slate-400 font-sans">รหัสลับตอนสร้าง R2 API Token</span>
              </label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  required={!config.isConfigured}
                  value={config.secretAccessKey}
                  onChange={(e) => setConfig({ ...config, secretAccessKey: e.target.value })}
                  placeholder={config.isConfigured ? "•••••••••••••••••••••••• (คงค่าเดิมไว้)" : "กรอก Secret Access Key"}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bucket Name */}
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                <span>R2 Bucket Name *</span>
                <span className="text-[11px] text-slate-400 font-sans">ชื่อ Bucket ที่สร้างไว้ใน Cloudflare R2</span>
              </label>
              <input
                type="text"
                required
                value={config.bucketName}
                onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                placeholder="เช่น pokky-packages"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-orange-400"
              />
            </div>

            {/* Step-by-Step Setup Guide Box */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs text-slate-300 leading-relaxed">
              <div className="font-mono font-bold text-orange-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
                <span>วิธีรับคีย์ทั้ง 4 ตัวจาก Cloudflare Dashboard (ใช้เวลา 2 นาที):</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1 text-slate-400 font-sans">
                <li>
                  เข้าเว็บไซต์{" "}
                  <a
                    href="https://dash.cloudflare.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-orange-400 hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    dash.cloudflare.com <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  ล็อกอินด้วยบัญชีที่คุณใช้ผูกโดเมน <span className="text-white font-mono">pokkystozy.xyz</span>
                </li>
                <li>
                  ที่แถบเมนูด้านซ้าย คลิกที่เมนู <strong>R2 Object Storage</strong>
                </li>
                <li>
                  กดปุ่ม <strong>Create bucket</strong> สีฟ้า → ตั้งชื่อ Bucket เช่น{" "}
                  <span className="text-white font-mono bg-black/50 px-1.5 py-0.5 rounded border border-white/10">pokky-packages</span>{" "}
                  แล้วกด Create
                </li>
                <li>
                  กลับมาที่หน้า R2 กดที่ <strong>Manage R2 API Tokens</strong> ทางขวา → กด <strong>Create API token</strong>
                </li>
                <li>
                  เลือกสิทธิ์ (Permissions) เป็น <strong>Object Read & Write</strong> แล้วกด Create API Token ด้านล่าง
                </li>
                <li>
                  คัดลอก <strong>Account ID</strong>, <strong>Access Key ID</strong> และ <strong>Secret Access Key</strong> มาวางในช่องด้านบนได้ทันที!
                </li>
              </ol>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing || !config.accountId || !config.accessKeyId}
                className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังทดสอบ...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>ทดสอบการเชื่อมต่อ (Test)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  ปิด
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-600/30 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      <span>บันทึกการตั้งค่า R2</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
