"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RealProduct } from "@/data/realProducts";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  LogOut, 
  ExternalLink, 
  CheckCircle2, 
  FileCode2, 
  Eye, 
  EyeOff, 
  BarChart3, 
  Layers, 
  Sparkles, 
  Terminal, 
  AlertCircle,
  X
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<RealProduct[]>([]);
  const [stats, setStats] = useState({
    totalDownloads: 0,
    totalProducts: 0,
    activeProducts: 0,
    popularCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RealProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    description: "",
    category: "bundles" as RealProduct["category"],
    version: "v1.0.0",
    fileFormat: ".BAT",
    fileSize: "50 KB",
    compatibility: "Windows 10 / 11 (64-bit)",
    popular: false,
    active: true,
    scriptContent: `@echo off\ntitle Optimization Script\necho [POKKY OPTIMIZE] กำลังเริ่มการปรับแต่ง...\npause`,
    revertScript: `@echo off\ntitle Revert Script\necho [POKKY OPTIMIZE] คืนค่าเดิมของระบบ...\npause`,
  });

  const getAuthHeaders = (): Record<string, string> => {
    if (typeof window === "undefined") return {};
    const token = localStorage.getItem("pokky_admin_token");
    return token ? { "x-admin-token": token } : {};
  };

  // Verify Auth & Load Data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/products", {
        cache: "no-store",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setStats(data.stats || {
          totalDownloads: 0,
          totalProducts: 0,
          activeProducts: 0,
          popularCount: 0,
        });
      }
    } catch {
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("pokky_admin_token");
      document.cookie = "pokky_admin_token=; path=/; max-age=0;";
      await fetch("/api/admin/auth", { method: "DELETE", credentials: "include" });
    } catch {}
    window.location.href = "/admin/login";
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      tagline: "",
      description: "",
      category: "bundles",
      version: "v1.0.0",
      fileFormat: ".BAT",
      fileSize: "50 KB",
      compatibility: "Windows 10 / 11 (64-bit)",
      popular: false,
      active: true,
      scriptContent: `@echo off\ntitle My Optimization Script\necho [POKKY OPTIMIZE] กำลังเริ่มการปรับแต่ง...\npause`,
      revertScript: `@echo off\ntitle Revert Script\necho [POKKY OPTIMIZE] คืนค่าเดิมของระบบ...\npause`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: RealProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      category: product.category,
      version: product.version,
      fileFormat: product.fileFormat,
      fileSize: product.fileSize,
      compatibility: product.compatibility,
      popular: product.popular,
      active: product.active,
      scriptContent: product.scriptContent,
      revertScript: product.revertScript,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
          fileFormat: data.fileFormat,
          fileSize: data.fileSize,
          scriptContent: data.content || prev.scriptContent,
        }));
        setMessage(`อัปโหลดไฟล์ "${file.name}" สำเร็จและนำโค้ดเข้าสู่ระบบแล้ว`);
        setTimeout(() => setMessage(""), 4000);
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการอัปโหลด");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการส่งไฟล์");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isEdit = !!editingProduct;
      const url = isEdit ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setMessage(isEdit ? "บันทึกการแก้ไขแพ็กเกจเรียบร้อยแล้ว" : "สร้างแพ็กเกจสคริปต์ใหม่สำเร็จแล้ว");
        setTimeout(() => setMessage(""), 4000);
        await loadData();
      } else {
        alert(data.error || "ไม่สามารถบันทึกได้");
      }
    } catch {
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบแพ็กเกจ "${name}" ใช่หรือไม่?`)) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`ลบแพ็กเกจ "${name}" เรียบร้อย`);
        setTimeout(() => setMessage(""), 4000);
        await loadData();
      }
    } catch {
      alert("ไม่สามารถลบแพ็กเกจได้");
    }
  };

  const handleToggleActive = async (product: RealProduct) => {
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ active: !product.active }),
      });
      await loadData();
    } catch {
      alert("ไม่สามารถเปลี่ยนสถานะได้");
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 font-sans pb-20">
      
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0e1017]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img src="/logo.png" alt="Logo" className="h-11 w-auto" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white">POKKY OPTIMIZE</span>
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-mono text-xs font-bold border border-green-500/30">
                  ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">ศูนย์จัดการสคริปต์และอัปโหลดไฟล์แจกฟรี</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>ดูหน้าร้านจริง</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 space-y-8">
        
        {/* Flash Notification */}
        {message && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm flex items-center gap-3 font-mono">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10">
            <div className="flex items-center justify-between gap-2 text-slate-400 mb-2">
              <span className="text-xs font-mono font-semibold uppercase">ยอดดาวน์โหลดรวมทั้งหมด</span>
              <Download className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">
              {stats.totalDownloads.toLocaleString()} <span className="text-sm font-normal text-slate-400">ครั้ง</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10">
            <div className="flex items-center justify-between gap-2 text-slate-400 mb-2">
              <span className="text-xs font-mono font-semibold uppercase">จำนวนแพ็กเกจในระบบ</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">
              {stats.totalProducts} <span className="text-sm font-normal text-slate-400">ชุด</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10">
            <div className="flex items-center justify-between gap-2 text-slate-400 mb-2">
              <span className="text-xs font-mono font-semibold uppercase">กำลังเปิดแจกฟรี</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black font-mono text-white">
              {stats.activeProducts} <span className="text-sm font-normal text-slate-400">ชุด</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0e1017] border border-white/10">
            <div className="flex items-center justify-between gap-2 text-slate-400 mb-2">
              <span className="text-xs font-mono font-semibold uppercase">Google AdSense</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-mono text-green-400 font-bold truncate">
              pub-1057391684109886
            </div>
            <div className="text-xs text-slate-500 font-mono mt-1">Slot: 9659834867</div>
          </div>
        </div>

        {/* Section Header & Create Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              รายการแพ็กเกจสคริปต์ปรับแต่ง (Optimization Packages)
            </h2>
            <p className="text-sm text-slate-400">
              จัดการไฟล์ที่เปิดให้ผู้ใช้ดาวน์โหลด อัปเดต Source Code และดูสถิติ
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="py-3 px-6 rounded-xl font-bold font-mono text-sm text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>เพิ่มแพ็กเกจสคริปต์ใหม่</span>
          </button>
        </div>

        {/* Product Table / Cards */}
        <div className="rounded-2xl border border-white/10 bg-[#0e1017] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs font-mono uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-4">ชื่อแพ็กเกจ / ไฟล์</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">เวอร์ชัน / ขนาด</th>
                  <th className="px-6 py-4">ยอดดาวน์โหลด</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 shrink-0">
                          <FileCode2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-base flex items-center gap-2">
                            <span>{prod.name}</span>
                            {prod.popular && (
                              <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-400/20 text-cyan-400 border border-cyan-400/30">
                                ยอดนิยม
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{prod.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10">
                        {prod.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      <div>{prod.version}</div>
                      <div className="text-slate-500">{prod.fileFormat} • {prod.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-bold text-green-400">
                      {prod.downloadsCount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-colors cursor-pointer ${
                          prod.active
                            ? "bg-green-500/20 text-green-400 border border-green-500/30"
                            : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                        }`}
                      >
                        {prod.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{prod.active ? "เปิดแจกฟรี" : "ซ่อนไว้"}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/download/${prod.id}`}
                          download
                          title="ทดสอบดาวน์โหลดไฟล์จริง"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          title="แก้ไขข้อมูลและสคริปต์"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          title="ลบแพ็กเกจนี้"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
          <div className="relative w-full max-w-3xl rounded-3xl bg-[#0e1017] border-2 border-white/15 shadow-2xl my-8 overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/[0.03]">
              <div className="flex items-center gap-2.5 text-base font-bold text-white">
                <FileCode2 className="w-5 h-5 text-green-400" />
                <span>{editingProduct ? "แก้ไขแพ็กเกจสคริปต์" : "สร้างแพ็กเกจสคริปต์แจกฟรีใหม่"}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Direct File Upload Area */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border-2 border-dashed border-white/15 text-center space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".bat,.cmd,.reg,.ps1,.zip,.txt"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    อัปโหลดไฟล์สคริปต์จากเครื่อง (.bat, .cmd, .reg, .ps1, .zip)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    ระบบจะตรวจจับชื่อไฟล์ ขนาดไฟล์ และดึงโค้ดเข้าสู่ Text Editor อัตโนมัติ
                  </p>
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                >
                  {uploading ? "กำลังอ่านไฟล์..." : "เลือกไฟล์จากคอมพิวเตอร์"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
                    ชื่อแพ็กเกจสคริปต์ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น Pokky Ultimate Gaming Optimizer Suite"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
                    หมวดหมู่ *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
                  >
                    <option value="bundles" className="bg-[#11131a]">ชุดรวมครบวงจร (bundles)</option>
                    <option value="os-scripts" className="bg-[#11131a]">สคริปต์ระบบ (os-scripts)</option>
                    <option value="gpu-profiles" className="bg-[#11131a]">โปรไฟล์การ์ดจอ (gpu-profiles)</option>
                    <option value="network" className="bg-[#11131a]">เน็ตเวิร์ก (network)</option>
                    <option value="memory-bios" className="bg-[#11131a]">แรม & ไบออส (memory-bios)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
                  คำโปรยสั้น (Tagline) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="เช่น ชุดรวมสคริปต์ปรับแต่งประสิทธิภาพระดับ Esports ครบจบในคลิกเดียว"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-2">
                  รายละเอียดแพ็กเกจ (Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="อธิบายว่าสคริปต์นี้ทำอะไร ช่วยเรื่องอะไรบ้าง..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-green-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">เวอร์ชัน</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ฟอร์แมตไฟล์</label>
                  <input
                    type="text"
                    value={formData.fileFormat}
                    onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">ขนาดไฟล์</label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Code Editor for Main Script */}
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-2 flex items-center justify-between">
                  <span>Source Code สคริปต์หลัก (.BAT / CMD Code) *</span>
                  <span className="text-[11px] text-green-400">ไฟล์นี้จะถูกส่งให้ผู้ใช้ดาวน์โหลด</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.scriptContent}
                  onChange={(e) => setFormData({ ...formData, scriptContent: e.target.value })}
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-green-400 font-mono text-xs leading-relaxed focus:outline-none focus:border-green-400"
                />
              </div>

              {/* Code Editor for Revert Script */}
              <div>
                <label className="block text-xs font-mono text-slate-300 font-semibold mb-2 flex items-center justify-between">
                  <span>Source Code สคริปต์กู้คืน (REVERT Script Code) *</span>
                  <span className="text-[11px] text-amber-400">สำหรับให้ผู้ใช้คืนค่าเดิมของระบบ</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.revertScript}
                  onChange={(e) => setFormData({ ...formData, revertScript: e.target.value })}
                  className="w-full p-4 rounded-xl bg-black/60 border border-white/10 text-amber-400 font-mono text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Checkbox Options */}
              <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-green-400 focus:ring-0"
                  />
                  <span>แสดงป้าย "ยอดนิยม" (Popular Badge)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded bg-white/10 border-white/20 text-green-400 focus:ring-0"
                  />
                  <span>เปิดให้ดาวน์โหลดบนหน้าเว็บทันที (Active)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-3 px-6 rounded-xl text-sm font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-8 rounded-xl text-sm font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "กำลังบันทึก..." : editingProduct ? "บันทึกการแก้ไข" : "สร้างและเผยแพร่สคริปต์"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
