"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { RealProduct } from "@/data/realProducts";
import { LoadingScreen } from "@/components/LoadingScreen";
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
  AlertTriangle,
  X,
  Loader2,
  Bot,
  Key,
  Cpu
} from "lucide-react";

const CATEGORY_COVER_PRESETS: Record<string, string> = {
  "bundles": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
  "os-scripts": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
  "gpu-profiles": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
  "network": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
  "memory-bios": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80",
};

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

  // Gemini AI & Auto-Pilot State
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const [isTestingApiKey, setIsTestingApiKey] = useState(false);
  const [testKeyResult, setTestKeyResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<RealProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  // Custom Confirmation & Alert Modal State (Replacing native browser confirm/alert)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
    isDeleting: boolean;
  }>({
    isOpen: false,
    id: "",
    name: "",
    isDeleting: false,
  });

  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const showAlert = (message: string, title = "แจ้งเตือนระบบ") => {
    setAlertModal({ isOpen: true, title, message });
  };

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
    imageUrl: "",
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
    const savedKey = typeof window !== "undefined" ? localStorage.getItem("pokky_gemini_api_key") || "" : "";
    setGeminiApiKey(savedKey);
    setTempApiKey(savedKey);
  }, []);

  const handleTestApiKey = async () => {
    const keyToTest = tempApiKey.trim();
    if (!keyToTest) {
      setTestKeyResult({ success: false, message: "กรุณาระบุ API Key ก่อนกดทดสอบ" });
      return;
    }

    setIsTestingApiKey(true);
    setTestKeyResult(null);

    try {
      const res = await fetch("/api/admin/gemini-test", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ apiKey: keyToTest }),
      });
      const data = await res.json();
      if (data.success) {
        setTestKeyResult({
          success: true,
          message: data.message || `เชื่อมต่อสำเร็จ (${data.model || "Gemini Flash"})`,
        });
      } else {
        setTestKeyResult({
          success: false,
          message: data.error || "ไม่สามารถเชื่อมต่อ Gemini ได้",
        });
      }
    } catch {
      setTestKeyResult({
        success: false,
        message: "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
      });
    } finally {
      setIsTestingApiKey(false);
    }
  };

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    localStorage.setItem("pokky_gemini_api_key", trimmed);
    setGeminiApiKey(trimmed);
    setIsApiKeyModalOpen(false);
    setTestKeyResult(null);
    setMessage(trimmed ? "บันทึก Google Gemini API Key เรียบร้อยแล้ว (เปิดใช้ AI Auto-Pilot ขั้นสูง)" : "ยกเลิกการใช้ Gemini Key (กลับสู่ระบบ Built-in Parser)");
    setTimeout(() => setMessage(""), 4500);
  };

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
      imageUrl: CATEGORY_COVER_PRESETS["bundles"],
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
      imageUrl: product.imageUrl || CATEGORY_COVER_PRESETS[product.category] || "",
      scriptContent: product.scriptContent,
      revertScript: product.revertScript,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showAlert("กรุณาเลือกไฟล์รูปภาพเท่านั้น (.png, .jpg, .webp)", "รูปแบบไฟล์ไม่ถูกต้อง");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setMessage("อัปโหลดรูปภาพปกตัวอย่างเรียบร้อยแล้ว");
      setTimeout(() => setMessage(""), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Process File with Gemini AI Auto-Pilot
  const processFileWithAI = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setIsAnalyzing(true);
    setAiStatusMessage("กำลังอ่านและอัปโหลดไฟล์สคริปต์...");

    try {
      // 1. Upload file to storage
      const body = new FormData();
      body.append("file", file);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.success) {
        showAlert(uploadData.error || "ไม่สามารถอ่านไฟล์ได้", "อัปโหลดไม่สำเร็จ");
        return;
      }

      const scriptContent = uploadData.content || "";
      const fileFormat = uploadData.fileFormat || ".BAT";
      const fileSize = uploadData.fileSize || "50 KB";

      // 2. Call Gemini AI / Parser analysis
      setAiStatusMessage(
        geminiApiKey
          ? "Google Gemini AI กำลังวิเคราะห์โค้ด ปรับแต่งข้อมูล และสร้าง Revert Script..."
          : "ระบบ Built-in AI Parser กำลังวิเคราะห์โค้ดสคริปต์..."
      );

      const analyzeRes = await fetch("/api/admin/ai-analyze", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          filename: file.name,
          content: scriptContent,
          userApiKey: geminiApiKey,
        }),
      });

      const analyzeData = await analyzeRes.json();

      if (analyzeData.success && analyzeData.data) {
        const d = analyzeData.data;
        setFormData((prev) => ({
          ...prev,
          name: d.name || prev.name || file.name.replace(/\.[^/.]+$/, ""),
          category: d.category || prev.category,
          tagline: d.tagline || prev.tagline,
          description: d.description || prev.description,
          compatibility: d.compatibility || prev.compatibility,
          fileFormat: fileFormat,
          fileSize: fileSize,
          scriptContent: scriptContent,
          revertScript: d.revertScript || prev.revertScript,
          imageUrl: prev.imageUrl || CATEGORY_COVER_PRESETS[d.category] || CATEGORY_COVER_PRESETS["bundles"],
        }));

        if (analyzeData.isGemini) {
          setMessage(`[AI Auto-Pilot] Google Gemini AI (${analyzeData.model || "Flash"}) วิเคราะห์โค้ดและสร้างเนื้อหาเฉพาะของไฟล์นี้เรียบร้อยแล้ว!`);
          setTimeout(() => setMessage(""), 5000);
        } else if (geminiApiKey) {
          showAlert(
            `ไม่สามารถเรียกใช้งาน Google Gemini ได้ (${analyzeData.fallbackReason || "ตรวจสอบความถูกต้องของคีย์หรือโควตา"}) ระบบจึงสลับมาใช้ตัววิเคราะห์ออฟไลน์แทน`,
            "แจ้งเตือนสถานะ Gemini AI"
          );
        } else {
          setMessage("[AI Auto-Pilot] ระบบ AI Parser วิเคราะห์สคริปต์และกรอกข้อมูลอัตโนมัติแล้ว");
          setTimeout(() => setMessage(""), 5000);
        }
      } else {
        // Fallback: at least set basic uploaded file data
        setFormData((prev) => ({
          ...prev,
          name: prev.name || file.name.replace(/\.[^/.]+$/, ""),
          fileFormat: fileFormat,
          fileSize: fileSize,
          scriptContent: scriptContent,
        }));
        setMessage(`อัปโหลดไฟล์ "${file.name}" สำเร็จและนำโค้ดเข้าสู่ระบบแล้ว`);
        setTimeout(() => setMessage(""), 4000);
      }
    } catch (err) {
      console.error(err);
      showAlert("เกิดข้อผิดพลาดในการประมวลผลด้วย AI", "ระบบขัดข้อง");
    } finally {
      setUploading(false);
      setIsAnalyzing(false);
      setAiStatusMessage("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFileWithAI(file);
    }
  };

  // Re-analyze existing code in Text Editor with Gemini AI
  const handleTriggerAiAnalysis = async () => {
    if (!formData.scriptContent) {
      showAlert("กรุณาใส่โค้ดสคริปต์ก่อนให้ AI วิเคราะห์", "ไม่พบโค้ดสคริปต์");
      return;
    }

    setIsAnalyzing(true);
    setAiStatusMessage(
      geminiApiKey
        ? "Google Gemini AI กำลังวิเคราะห์โค้ดที่แก้ไข..."
        : "ระบบ Built-in AI Parser กำลังวิเคราะห์โค้ด..."
    );

    try {
      const analyzeRes = await fetch("/api/admin/ai-analyze", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({
          filename: formData.name ? `${formData.name}.bat` : "custom-script.bat",
          content: formData.scriptContent,
          userApiKey: geminiApiKey,
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (analyzeData.success && analyzeData.data) {
        const d = analyzeData.data;
        setFormData((prev) => ({
          ...prev,
          name: prev.name || d.name,
          category: d.category || prev.category,
          tagline: d.tagline || prev.tagline,
          description: d.description || prev.description,
          compatibility: d.compatibility || prev.compatibility,
          revertScript: d.revertScript || prev.revertScript,
        }));

        if (analyzeData.isGemini) {
          setMessage(`[AI Auto-Pilot] Google Gemini AI (${analyzeData.model || "Flash"}) อัปเดตข้อมูลและสคริปต์ Revert สำเร็จแล้ว!`);
          setTimeout(() => setMessage(""), 5000);
        } else if (geminiApiKey) {
          showAlert(
            `ไม่สามารถเรียกใช้งาน Google Gemini ได้ (${analyzeData.fallbackReason || "ตรวจสอบความถูกต้องของคีย์หรือโควตา"}) ระบบจึงสลับมาใช้ตัววิเคราะห์ออฟไลน์แทน`,
            "แจ้งเตือนสถานะ Gemini AI"
          );
        } else {
          setMessage("[AI Auto-Pilot] ระบบ AI Parser อัปเดตข้อมูลจากโค้ดเรียบร้อยแล้ว");
          setTimeout(() => setMessage(""), 5000);
        }
      }
    } catch (err) {
      showAlert("ไม่สามารถวิเคราะห์ด้วย AI ได้", "ระบบวิเคราะห์ขัดข้อง");
    } finally {
      setIsAnalyzing(false);
      setAiStatusMessage("");
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
        showAlert(data.error || "ไม่สามารถบันทึกได้", "บันทึกไม่สำเร็จ");
      }
    } catch {
      showAlert("เกิดข้อผิดพลาดในการบันทึก", "ระบบขัดข้อง");
    } finally {
      setLoading(false);
    }
  };

  const promptDeleteProduct = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      id,
      name,
      isDeleting: false,
    });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteModal.id) return;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      const res = await fetch(`/api/admin/products/${deleteModal.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`ลบแพ็กเกจ "${deleteModal.name}" ออกจากระบบเรียบร้อย`);
        setTimeout(() => setMessage(""), 4000);
        setDeleteModal({ isOpen: false, id: "", name: "", isDeleting: false });
        await loadData();
      } else {
        showAlert(data.error || "ไม่สามารถลบแพ็กเกจได้", "เกิดข้อผิดพลาด");
        setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
      }
    } catch {
      showAlert("ไม่สามารถเชื่อมต่อเพื่อลบแพ็กเกจได้", "เกิดข้อผิดพลาด");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
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
      showAlert("ไม่สามารถเปลี่ยนสถานะได้", "เกิดข้อผิดพลาด");
    }
  };

  if (loading && products.length === 0) {
    return (
      <LoadingScreen
        message="กำลังตรวจสอบสิทธิ์และโหลดข้อมูลแดชบอร์ด..."
        subMessage="ADMINISTRATION CONSOLE"
      />
    );
  }

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

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Gemini AI Settings Button */}
            <button
              onClick={() => {
                setTempApiKey(geminiApiKey);
                setIsApiKeyModalOpen(true);
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                geminiApiKey
                  ? "bg-green-500/15 text-green-300 border-green-500/40 hover:bg-green-500/25 hover:border-green-500/60 shadow-sm shadow-green-500/15"
                  : "bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-500/50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-green-400" />
              <span>ตั้งค่า Gemini AI</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                geminiApiKey ? "bg-green-400/20 text-green-300" : "bg-cyan-400/20 text-cyan-300"
              }`}>
                {geminiApiKey ? "เปิดใช้งานแล้ว" : "ฟรี Key"}
              </span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">ดูหน้าร้านจริง</span>
            </a>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
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
                          onClick={() => promptDeleteProduct(prod.id, prod.name)}
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
              
              {/* Drag & Drop Upload Zone with Gemini AI Auto-Pilot */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    processFileWithAI(file);
                  }
                }}
                className={`relative p-6 sm:p-7 rounded-3xl border-2 border-dashed transition-all duration-300 text-center space-y-3 ${
                  isDragging
                    ? "border-green-400 bg-green-500/15 scale-[1.01] shadow-[0_0_35px_rgba(74,222,128,0.3)]"
                    : isAnalyzing
                    ? "border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.2)]"
                    : "border-white/20 hover:border-green-400/50 bg-white/[0.03] hover:bg-white/[0.05]"
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".bat,.cmd,.reg,.ps1,.zip,.txt"
                  className="hidden"
                />

                {/* AI Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-xs font-mono text-green-300">
                  <Sparkles className="w-3.5 h-3.5 text-green-400" />
                  <span>AI Auto-Pilot: {geminiApiKey ? "Google Gemini AI" : "Built-in Parser"}</span>
                </div>

                <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-400">
                  {isAnalyzing || uploading ? (
                    <Loader2 className="w-7 h-7 animate-spin text-green-400" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">
                    {isDragging
                      ? "ปล่อยไฟล์ที่นี่เพื่อให้ AI วิเคราะห์และกรอกข้อมูลทันที"
                      : isAnalyzing
                      ? aiStatusMessage || "AI กำลังวิเคราะห์โค้ดสคริปต์..."
                      : "ลากไฟล์สคริปต์มาวางที่นี่ (.bat, .cmd, .reg, .ps1, .zip)"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
                    {isAnalyzing
                      ? "ระบบกำลังสร้างชื่อ, คำโปรย, คำอธิบาย, หมวดหมู่ และ Revert Script ให้อัตโนมัติ"
                      : "แค่ลากไฟล์ลงไป ระบบ AI จะอ่านโค้ดและเติมข้อมูลลงฟอร์มทุกช่องให้อัตโนมัติใน 1 วินาที"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    disabled={uploading || isAnalyzing}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {uploading || isAnalyzing ? "กำลังประมวลผล..." : "เลือกไฟล์จากคอมพิวเตอร์"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempApiKey(geminiApiKey);
                      setIsApiKeyModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    ตั้งค่า Gemini Key
                  </button>
                </div>
              </div>

              {/* Cover Image Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>รูปภาพปกสคริปต์ (แนะนำแนวนอน 16:9 เช่น 1280x720 หรือ 1920x1080)</span>
                  </label>
                  {formData.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      ลบรูปภาพ
                    </button>
                  )}
                </div>

                {formData.imageUrl ? (
                  <div className="relative w-full aspect-video max-h-56 rounded-xl overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center group/cover">
                    <img
                      src={formData.imageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => imageFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium cursor-pointer"
                      >
                        เปลี่ยนรูป
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => imageFileInputRef.current?.click()}
                    className="w-full h-24 rounded-xl border border-dashed border-white/20 hover:border-green-400/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors bg-white/[0.02] hover:bg-white/[0.04]"
                  >
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-300">คลิกเพื่ออัปโหลดรูปภาพปกจากเครื่อง หรือเลือกภาพตัวอย่างด้านล่าง</span>
                  </div>
                )}

                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="หรือวาง URL รูปภาพ เช่น https://..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-green-400 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => imageFileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono shrink-0 transition-colors cursor-pointer"
                  >
                    เลือกรูปจากเครื่อง
                  </button>
                </div>

                {/* Cover Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">ภาพตัวอย่าง Esports:</span>
                  {Object.entries(CATEGORY_COVER_PRESETS).map(([catKey, url]) => (
                    <button
                      key={catKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: url })}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors cursor-pointer ${
                        formData.imageUrl === url
                          ? "bg-green-500/20 text-green-300 border-green-500/40"
                          : "bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white"
                      }`}
                    >
                      {catKey}
                    </button>
                  ))}
                </div>
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
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-2">
                    <span>Source Code สคริปต์หลัก (.BAT / CMD Code) *</span>
                    <span className="text-[11px] text-green-400">ไฟล์นี้จะถูกส่งให้ผู้ใช้ดาวน์โหลด</span>
                  </label>
                  <button
                    type="button"
                    disabled={isAnalyzing || !formData.scriptContent}
                    onClick={handleTriggerAiAnalysis}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/15 hover:bg-green-500/25 border border-green-500/35 text-xs font-mono text-green-300 transition-colors disabled:opacity-40 cursor-pointer"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>กำลังวิเคราะห์...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-green-400" />
                        <span>วิเคราะห์ด้วย Gemini AI ซ้ำ</span>
                      </>
                    )}
                  </button>
                </div>
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

      {/* GEMINI API KEY MODAL */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0e1017] border-2 border-white/15 shadow-2xl p-6 sm:p-7 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-base font-bold text-white">
                <Sparkles className="w-5 h-5 text-green-400" />
                <span>ตั้งค่า Google Gemini AI Key</span>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              <p>
                ใส่ <strong className="text-white">Gemini API Key</strong> เพื่อให้ระบบใช้โมเดล <strong className="text-green-400">Gemini 2.0 Flash</strong> ในการอ่านโค้ดสคริปต์อัตโนมัติ, เขียนคำอธิบายเชิงลึก, สรุปจุดเด่น และสร้าง Revert Script คืนค่าเดิมให้ทันทีเมื่อลากไฟล์ลงในกล่อง
              </p>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-300 space-y-1.5 font-sans">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-cyan-400" />
                  <span>วิธีขอรับ Free Gemini API Key (ฟรี 100%):</span>
                </div>
                <p>1. เข้าเว็บไซต์ Google AI Studio</p>
                <p>2. ล็อกอินด้วยบัญชี Google แล้วคลิก "Create API key"</p>
                <p>3. คัดลอกคีย์มาวางในช่องด้านล่าง แล้วกด "บันทึกคีย์"</p>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-green-400 hover:underline font-mono font-semibold pt-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>เปิดหน้า Google AI Studio เพื่อขอคีย์ฟรี</span>
                </a>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono text-slate-300 font-semibold">
                    Gemini API Key
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showApiKey ? "ซ่อนคีย์" : "แสดงคีย์"}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={tempApiKey}
                    onChange={(e) => {
                      setTempApiKey(e.target.value);
                      setTestKeyResult(null);
                    }}
                    placeholder="AIzaSy..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-xs sm:text-sm focus:outline-none focus:border-green-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleTestApiKey}
                    disabled={isTestingApiKey || !tempApiKey.trim()}
                    className="px-4 py-3 rounded-xl text-xs font-mono font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    {isTestingApiKey ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>กำลังทดสอบ...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>ทดสอบคีย์</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Result Feedback Box */}
                {testKeyResult && (
                  <div
                    className={`mt-2.5 p-3 rounded-xl border text-xs font-mono flex items-start gap-2 animate-in fade-in duration-200 ${
                      testKeyResult.success
                        ? "bg-green-500/10 border-green-500/30 text-green-300"
                        : "bg-red-500/10 border-red-500/30 text-red-300"
                    }`}
                  >
                    {testKeyResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{testKeyResult.message}</span>
                  </div>
                )}

                <span className="text-[11px] text-slate-400 mt-1.5 block">
                  คีย์จะถูกบันทึกอย่างปลอดภัยในเบราว์เซอร์ของคุณ (Local Storage)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              {geminiApiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setTempApiKey("");
                    localStorage.removeItem("pokky_gemini_api_key");
                    setGeminiApiKey("");
                    setIsApiKeyModalOpen(false);
                    setMessage("ลบคีย์ Gemini เรียบร้อยแล้ว (ระบบจะใช้ Built-in Code Parser แทน)");
                    setTimeout(() => setMessage(""), 4000);
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer mr-auto"
                >
                  ลบคีย์ออก
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(false)}
                className="py-2.5 px-5 rounded-xl text-xs sm:text-sm font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="py-2.5 px-6 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all shadow-md shadow-green-500/20 cursor-pointer"
              >
                บันทึกคีย์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Esports Cyber Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c0e17] border border-red-500/40 p-6 shadow-[0_0_50px_rgba(239,68,68,0.25)] text-left overflow-hidden">
            {/* Top red danger bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />
            
            {/* Corner ambient glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Header Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <button
                  onClick={() => !deleteModal.isDeleting && setDeleteModal({ isOpen: false, id: "", name: "", isDeleting: false })}
                  disabled={deleteModal.isDeleting}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Desc */}
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                ยืนยันการลบแพ็กเกจ
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                คุณแน่ใจหรือไม่ว่าต้องการลบแพ็กเกจนี้ออกจากระบบ?
              </p>

              {/* Package Card Highlight */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-red-500/20 mb-5">
                <div className="flex items-start gap-2.5">
                  <FileCode2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-white leading-snug">
                      {deleteModal.name}
                    </div>
                    <div className="text-[11px] text-red-300/80 font-mono">
                      ข้อมูลในฐานข้อมูล Supabase จะถูกลบออกถาวรทันที
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, id: "", name: "", isDeleting: false })}
                  disabled={deleteModal.isDeleting}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteProduct}
                  disabled={deleteModal.isDeleting}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {deleteModal.isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังลบ...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>ลบแพ็กเกจทันที</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Esports Cyber Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0c0e17] border border-cyan-500/30 p-6 shadow-[0_0_40px_rgba(6,182,212,0.2)] text-left overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-green-400 to-emerald-400" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <button
                  onClick={() => setAlertModal({ isOpen: false, title: "", message: "" })}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                {alertModal.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                {alertModal.message}
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setAlertModal({ isOpen: false, title: "", message: "" })}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-950 bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 transition-all shadow-md shadow-green-500/20 cursor-pointer"
                >
                  รับทราบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
