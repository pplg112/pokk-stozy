"use client";

import React, { useState, useEffect, useRef } from "react";
import { DigitalProduct, Review } from "@/types";
import { 
  X, 
  FileCode2, 
  CheckCircle2, 
  Download, 
  Star, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  MessageSquare,
  Image as ImageIcon,
  Trash2,
  Upload,
  AlertCircle,
  Loader2,
  ZoomIn,
  BookOpen,
  Share2,
  Check
} from "lucide-react";

interface ProductDetailModalProps {
  product: DigitalProduct | null;
  onClose: () => void;
  onBuyNow: (product: DigitalProduct) => void;
  onReviewAdded?: (productId: string, newRating: number, newReviewCount: number) => void;
}

const RATING_LABELS: Record<number, string> = {
  5: "5 ดาว - ยอดเยี่ยมมาก แนะนำให้ทุกคนใช้",
  4: "4 ดาว - ดีมาก ใช้งานได้ราบรื่น",
  3: "3 ดาว - ปานกลาง มีประสิทธิภาพตามที่ระบุ",
  2: "2 ดาว - พอใช้ มีจุดที่ควรปรับปรุง",
  1: "1 ดาว - ต้องปรับปรุงแก้ไข",
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
  onReviewAdded,
}) => {
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [stats, setStats] = useState({ rating: 0, reviewCount: 0 });

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "install" | "reviews">("overview");
  const [copiedLink, setCopiedLink] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load reviews whenever product opens
  useEffect(() => {
    if (!product) return;

    setActiveTab("overview");
    setCopiedLink(false);
    setStats({ rating: product.rating || 0, reviewCount: product.reviewCount || 0 });
    setFormError("");
    setFormSuccess("");
    setComment("");
    setImagePreview(null);
    setRating(5);

    setLoadingReviews(true);
    fetch(`/api/reviews?productId=${product.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
          setStats({
            rating: typeof data.rating === "number" ? data.rating : 0,
            reviewCount: typeof data.reviewCount === "number" ? data.reviewCount : 0,
          });
        }
      })
      .catch(() => {
        // Fallback gracefully
      })
      .finally(() => {
        setLoadingReviews(false);
      });
  }, [product]);

  // Handle Escape key to close expanded image first, or modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (expandedImage) {
          setExpandedImage(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedImage, onClose]);

  if (!product) return null;

  // Handle client-side image compression
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("กรุณาเลือกไฟล์รูปภาพเท่านั้น (.png, .jpg, .webp)");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setFormError("ขนาดไฟล์รูปภาพต้นฉบับต้องไม่เกิน 12 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.82);
          setImagePreview(compressed);
          setFormError("");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Review (100% No Login Required)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!comment.trim()) {
      setFormError("กรุณากรอกข้อความรีวิวหรือความคิดเห็นการใช้งาน");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: authorName.trim() || "ผู้ใช้นิรนาม",
          rating,
          comment: comment.trim(),
          imageUrl: imagePreview || undefined,
          website_confirm: honeypot,
        }),
      });

      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        const newRating = data.rating ?? rating;
        const newCount = data.reviewCount ?? (reviews.length + 1);
        setStats({ rating: newRating, reviewCount: newCount });

        // Reset form
        setComment("");
        setHoneypot("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setFormSuccess("ส่งรีวิวเรียบร้อยแล้ว ขอบคุณที่ร่วมแชร์ผลลัพธ์!");

        if (onReviewAdded) {
          onReviewAdded(product.id, newRating, newCount);
        }
      } else {
        setFormError(data.error || "เกิดข้อผิดพลาดในการส่งรีวิว กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      setFormError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
        <div className="relative w-full max-w-2xl sm:max-w-3xl rounded-2xl bg-[#0e1017] border border-white/15 shadow-2xl my-4 overflow-hidden max-h-[92vh] flex flex-col">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-white/[0.03] shrink-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-400 font-bold">
              <FileCode2 className="w-4 h-4" />
              <span className="text-white uppercase">{product.fileFormat} • {product.version}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
            
            {/* Cover Image Banner in Modal (Full View 16:9, No Crop, Click to Expand) */}
            {product.imageUrl && (
              <div 
                onClick={() => setExpandedImage(product.imageUrl || null)}
                className="relative w-full aspect-video max-h-[380px] sm:max-h-[440px] rounded-2xl overflow-hidden border border-white/10 hover:border-green-400/40 bg-black/80 shadow-xl flex items-center justify-center group cursor-pointer transition-colors"
                title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-mono">
                  <ZoomIn className="w-4 h-4" />
                  <span>ดูรูปภาพขนาดเต็ม</span>
                </div>
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 rounded-lg bg-green-500/30 backdrop-blur-md border border-green-500/50 text-green-300 font-mono text-xs font-bold shadow-lg">
                    แจกฟรี 100%
                  </span>
                </div>
              </div>
            )}

            {/* Title, Tagline & Share */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300">
                  {product.tagline}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const shareUrl = `${window.location.origin}/?product=${product.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors cursor-pointer"
                title="คัดลอกลิงก์สำหรับแชร์"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-300">คัดลอกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>แชร์ลิงก์</span>
                  </>
                )}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 shrink-0 sticky top-0 z-20 backdrop-blur-md bg-[#0e1017]/95">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-green-500/20 text-green-300 border border-green-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>ข้อมูลและไฟล์</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("install")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "install"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>วิธีติดตั้ง & ความปลอดภัย</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>รีวิว ({reviews.length})</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW & INCLUDED FILES */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                {/* Meta Specs Pill Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">ขนาดไฟล์:</span>
                    <span className="text-white font-bold text-sm">{product.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">เรตติ้งผู้ใช้:</span>
                    {stats.reviewCount > 0 ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1.5 text-sm">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{stats.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal text-xs font-sans">({stats.reviewCount} รีวิว)</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 font-sans text-xs">ยังไม่มีรีวิว</span>
                    )}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">ความเข้ากันได้:</span>
                    <span className="text-white font-bold text-xs sm:text-sm truncate block">{product.compatibility}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">การคืนสภาพเดิม:</span>
                    <span className="text-green-400 font-bold text-xs sm:text-sm">100% Revert</span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
                  {product.description}
                </div>

                {/* Real Archive Files List */}
                {(product.fileFormat?.toUpperCase().includes("ZIP") || product.downloadUrl) && product.includedFiles && product.includedFiles.length > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-3 font-sans">
                    <h4 className="text-xs sm:text-sm font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <FileCode2 className="w-4 h-4 text-cyan-400" />
                      <span>ไฟล์และเครื่องมือภายในแพ็กเกจ ({product.includedFiles.length} รายการ):</span>
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs sm:text-sm">
                      {product.includedFiles.map((file, idx) => (
                        <div 
                          key={idx}
                          className="p-2.5 sm:p-3 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 text-cyan-300 font-medium truncate">
                            <FileCode2 className="w-4 h-4 text-cyan-400 shrink-0" />
                            <span className="truncate">{file.filename}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-sans shrink-0">
                            {file.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features & Requirements */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <h5 className="text-xs sm:text-sm font-mono font-bold text-white mb-2.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      จุดเด่นที่คุณจะได้รับ:
                    </h5>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                      {product.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <span className="text-green-400">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10">
                    <h5 className="text-xs sm:text-sm font-mono font-bold text-white mb-2.5 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      ความต้องการของระบบ:
                    </h5>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300 font-mono">
                      {product.requirements.map((r, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INSTALL GUIDE & SAFETY */}
            {activeTab === "install" && (
              <div className="space-y-4 font-sans">
                {/* 4 Step Visual Flow */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <h4 className="text-xs sm:text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>ขั้นตอนการใช้งานแพ็กเกจนี้:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-xs sm:text-sm">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-green-400 font-mono font-bold text-xs">ขั้นตอนที่ 1: แตกไฟล์</div>
                      <p className="text-slate-300 text-xs">คลิกขวาที่ไฟล์ .zip แล้วเลือก Extract All (แตกไฟล์ทั้งหมด) ไปยังโฟลเดอร์ที่สะดวก</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-green-400 font-mono font-bold text-xs">ขั้นตอนที่ 2: สิทธิ์ Admin</div>
                      <p className="text-slate-300 text-xs">คลิกขวาที่ไฟล์สคริปต์ แล้วเลือก &quot;Run as administrator&quot; เพื่อให้คำสั่งทำงานสมบูรณ์</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-green-400 font-mono font-bold text-xs">ขั้นตอนที่ 3: รีสตาร์ท</div>
                      <p className="text-slate-300 text-xs">เมื่อสคริปต์ทำงานเสร็จสิ้น ให้รีสตาร์ทคอมพิวเตอร์ 1 รอบ เพื่อให้ระบบโหลดค่าใหม่</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="text-green-400 font-mono font-bold text-xs">ขั้นตอนที่ 4: การคืนค่าเดิม</div>
                      <p className="text-slate-300 text-xs">หากต้องการกลับไปใช้ค่าเดิม สามารถรันไฟล์ Revert Script ที่แนบไว้ได้ตลอดเวลา</p>
                    </div>
                  </div>
                </div>

                {/* Safety Guarantee Alert */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono text-xs sm:text-sm">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>ความปลอดภัยและความโปร่งใส 100%:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc pl-5 leading-relaxed">
                    <li>สคริปต์ทุกไฟล์เขียนด้วยคำสั่งมาตรฐานของ Windows (Batch / Registry / PowerShell) สามารถคลิกขวา Edit ด้วย Notepad ตรวจสอบโค้ดได้ก่อนรัน</li>
                    <li>แนะนำให้ตั้งค่า System Restore Point ก่อนการปรับแต่งระบบ Windows ทุกครั้ง เพื่อความปลอดภัยสูงสุด</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 3: REAL USER REVIEWS & RATINGS SECTION */}
            {activeTab === "reviews" && (
              <div className="pt-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-400" />
                    <h4 className="text-sm sm:text-base font-bold text-white font-sans">
                      รีวิวและคะแนนจากผู้ใช้งานจริง ({stats.reviewCount} รีวิว)
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    {stats.reviewCount > 0 ? (
                      <>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-amber-400 font-bold text-sm">{stats.rating.toFixed(1)}</span>
                        <span>/ 5.0 คะแนนเฉลี่ยจริง</span>
                      </>
                    ) : (
                      <span>ยังไม่มีคะแนนรีวิว</span>
                    )}
                  </div>
                </div>

                {/* Review Submission Form (No Login) */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/15 mb-5 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white font-sans">
                      เขียนรีวิวและมอบดาว (ไม่ต้องเข้าสู่ระบบ)
                    </span>
                    <span className="text-[11px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                      เปิดให้ทุกคนรีวิวอิสระ
                    </span>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-3.5">
                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-mono text-slate-300 mb-1.5">
                        ให้คะแนนดาวความพึงพอใจ:
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((starValue) => {
                            const isFilled = (hoverRating || rating) >= starValue;
                            return (
                              <button
                                key={starValue}
                                type="button"
                                onClick={() => setRating(starValue)}
                                onMouseEnter={() => setHoverRating(starValue)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 rounded-lg transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                                title={`${starValue} ดาว`}
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    isFilled
                                      ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.35)]"
                                      : "text-slate-600 hover:text-slate-400"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-xs font-mono text-amber-300/90 font-medium">
                          {RATING_LABELS[hoverRating || rating]}
                        </span>
                      </div>
                    </div>

                    {/* Invisible Honeypot Anti-Bot Field */}
                    <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                      <label htmlFor="website_confirm">Website</label>
                      <input
                        id="website_confirm"
                        type="text"
                        name="website_confirm"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    {/* Author Display Name Input & Image Attachment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">
                          ชื่อของคุณ (ตั้งชื่อได้อิสระ):
                        </label>
                        <input
                          type="text"
                          placeholder="เช่น PokkyGamer (เว้นว่างเป็น ผู้ใช้นิรนาม)"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          maxLength={50}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-400 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">
                          แนบรูปถ่ายผลลัพธ์ / ค่า FPS / หน่วงเมาส์ (ไม่บังคับ):
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            className="hidden"
                            id="review-image-upload"
                          />
                          <label
                            htmlFor="review-image-upload"
                            className="flex-1 px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-green-400/50 text-xs text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                          >
                            <Upload className="w-3.5 h-3.5 text-green-400" />
                            <span className="truncate">
                              {imagePreview ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพแนบ..."}
                            </span>
                          </label>

                          {imagePreview && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              title="ลบรูปภาพ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-xs font-sans">ลบรูป</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Attachment Preview Thumbnail */}
                    {imagePreview && (
                      <div className="relative inline-block mt-1">
                        <div 
                          onClick={() => setExpandedImage(imagePreview)}
                          className="p-1 rounded-xl bg-black/50 border border-white/15 hover:border-green-400 inline-block group cursor-pointer transition-colors"
                          title="คลิกเพื่อดูรูปขยาย"
                        >
                          <img
                            src={imagePreview}
                            alt="Review Preview"
                            className="h-20 w-auto rounded-lg object-cover max-w-xs"
                          />
                          <span className="block text-[10px] font-mono text-slate-400 group-hover:text-green-300 mt-1 px-1 flex items-center gap-1">
                            <ZoomIn className="w-3 h-3" />
                            รูปพร้อมแนบ (คลิกเพื่อดูรูปขยาย)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Review Text Comment */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-mono text-slate-300">
                          ข้อความรีวิวและผลการใช้งาน:
                        </label>
                        <span className="text-[10px] font-mono text-slate-500">
                          {comment.length} / 1000 ตัวอักษร
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="บอกเล่าประสบการณ์ใช้งาน เช่น ความลื่นไหล, ค่า FPS ที่เพิ่มขึ้น, ค่าความหน่วงเมาส์ หรือข้อเสนอแนะ..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        maxLength={1000}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-400 font-sans leading-relaxed resize-y"
                        required
                      />
                    </div>

                    {/* Error & Success Feedback */}
                    {formError && (
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2 font-mono">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {formSuccess && (
                      <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs flex items-center gap-2 font-mono">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{formSuccess}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="py-2 px-5 rounded-xl text-xs sm:text-sm font-bold font-sans text-slate-950 bg-green-400 hover:bg-green-300 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-green-500/20 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>กำลังส่งรีวิว...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-4 h-4" />
                            <span>ส่งรีวิวของคุณ</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-3">
                  {loadingReviews ? (
                    <div className="py-8 text-center text-slate-400 font-mono text-xs flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-green-400" />
                      <span>กำลังโหลดรีวิวจากผู้ใช้...</span>
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="p-6 text-center rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5">
                      <div className="text-xs sm:text-sm font-semibold text-slate-400 font-sans">
                        ยังไม่มีรีวิวสำหรับแพ็กเกจนี้
                      </div>
                      <div className="text-xs text-slate-500">
                        เป็นคนแรกที่ให้คะแนนดาวและแชร์ผลลัพธ์การใช้งานในแบบฟอร์มด้านบน
                      </div>
                    </div>
                  ) : (
                    reviews.map((rev) => {
                      const dateStr = rev.createdAt 
                        ? new Date(rev.createdAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "เมื่อสักครู่";

                      return (
                        <div
                          key={rev.id}
                          className="p-3.5 sm:p-4 rounded-xl bg-black/40 border border-white/10 space-y-2.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="font-bold text-xs sm:text-sm text-white font-sans">
                                {rev.authorName}
                              </span>
                              <div className="flex items-center gap-0.5 text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                                    }`}
                                  />
                                ))}
                                <span className="text-[11px] font-mono font-semibold ml-1">
                                  {rev.rating}.0
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] sm:text-[11px] font-mono text-slate-500">
                              {dateStr}
                            </span>
                          </div>

                          {/* Comment text */}
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                            {rev.comment}
                          </p>

                          {/* Attached Image (if any) */}
                          {rev.imageUrl && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedImage(rev.imageUrl || null);
                                }}
                                className="relative inline-block rounded-xl overflow-hidden border border-white/15 hover:border-green-400 transition-all group cursor-pointer"
                                title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
                              >
                                <img
                                  src={rev.imageUrl}
                                  alt="รูปภาพแนบจากรีวิว"
                                  className="h-28 sm:h-36 w-auto max-w-xs object-cover rounded-xl transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-mono font-bold">
                                  <ZoomIn className="w-4 h-4 text-green-400" />
                                  <span>ดูรูปขยาย</span>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

              </div>
            )}

          </div>

          {/* Modal Bottom Free Download Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-white/[0.03] flex flex-col sm:flex-row items-center justify-between gap-3.5 shrink-0">
            <div className="self-start sm:self-center">
              <div className="text-xs font-mono text-slate-400">สถานะแพ็กเกจ:</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black font-mono text-green-400">
                  แจกฟรี 100%
                </span>
                <span className="text-xs font-mono text-slate-400">
                  (ดาวน์โหลดได้ทันที)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl text-xs sm:text-sm font-mono text-slate-300 hover:text-white border border-white/15 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBuyNow(product);
                }}
                className="flex-1 sm:flex-initial py-2.5 px-6 rounded-xl text-xs sm:text-sm font-mono font-bold text-slate-950 bg-green-400 hover:bg-green-300 transition-all flex items-center justify-center gap-2 shadow-xl shadow-green-500/25 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                ดาวน์โหลดไฟล์นี้ฟรีทันที
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal for Attached Image Zoom */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md cursor-zoom-out select-none"
          onClick={() => setExpandedImage(null)}
        >
          <div 
            className="relative max-w-5xl max-h-[92vh] flex flex-col items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="w-full flex items-center justify-between pb-2 px-1 text-slate-300 font-mono text-xs">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-green-400" />
                <span>ภาพขยายเต็มจอ</span>
              </span>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white hover:text-green-400 text-xs font-mono transition-all cursor-pointer shadow-lg"
                title="ปิดรูปขยาย (Esc)"
              >
                <X className="w-4 h-4" />
                <span>ปิด (ESC)</span>
              </button>
            </div>

            {/* Expanded Image Container */}
            <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#08090d] shadow-2xl p-1 sm:p-2 flex items-center justify-center">
              <img
                src={expandedImage}
                alt="รูปภาพขนาดเต็ม"
                className="max-h-[82vh] max-w-full object-contain rounded-xl select-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
