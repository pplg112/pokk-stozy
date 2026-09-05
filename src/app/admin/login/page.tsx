"use client";

import React, { useState, useEffect } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect to /admin immediately
  useEffect(() => {
    fetch("/api/admin/auth", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          window.location.href = "/admin";
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.token) {
          try {
            localStorage.setItem("pokky_admin_token", data.token);
            document.cookie = `pokky_admin_token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
          } catch {}
        }
        // Force full page navigation to clear Next.js client-router cache
        window.location.href = "/admin";
      } else {
        setError(data.error || "รหัสผ่านไม่ถูกต้อง");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        
        {/* Top Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-mono text-green-400 mb-3">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>POKKY STOZY ADMIN SECURITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            เข้าสู่ระบบแอดมิน
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            จัดการแพ็กเกจสคริปต์ อัปโหลดไฟล์แจก และดูสถิติระบบ
          </p>
        </div>

        {/* Login Box */}
        <div className="p-8 rounded-3xl bg-[#0e1017] border-2 border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
                รหัสผ่านผู้ดูแลระบบ (ADMIN PASSWORD)
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-500 pointer-events-none" />
                <input
                  type="password"
                  placeholder="กรอกรหัสผ่านผู้ดูแลระบบ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-400 transition-colors font-mono"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl font-bold font-mono text-sm text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? "กำลังตรวจสอบสิทธิ์..." : "เข้าสู่ระบบจัดการ"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors font-mono"
          >
            ← กลับสู่หน้าร้านค้าแจกฟรี
          </a>
        </div>

      </div>
    </div>
  );
}
