"use client";

import React, { useState, useEffect, useRef } from "react";
import { Review, DiscordUser } from "@/types";
import {
  Star,
  MessageSquare,
  CornerDownRight,
  Send,
  Loader2,
  CheckCircle2,
  Upload,
  Trash2,
  AlertCircle,
  LogIn,
} from "lucide-react";

interface ProductReviewsSectionProps {
  productId: string;
  currentUser: DiscordUser | null;
  onOpenAuthModal: () => void;
  onReviewAdded?: (productId: string, newRating: number, newReviewCount: number) => void;
}

const RATING_LABELS: Record<number, string> = {
  5: "5 ดาว - ยอดเยี่ยมมาก แนะนำให้ทุกคนใช้",
  4: "4 ดาว - ดีมาก ใช้งานได้ราบรื่น",
  3: "3 ดาว - ปานกลาง มีประสิทธิภาพตามที่ระบุ",
  2: "2 ดาว - พอใช้ มีจุดที่ควรปรับปรุง",
  1: "1 ดาว - ต้องปรับปรุงแก้ไข",
};

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  currentUser,
  onOpenAuthModal,
  onReviewAdded,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ rating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);

  // New review form
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reply form state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthorName, setReplyAuthorName] = useState("");
  const [replyHoneypot, setReplyHoneypot] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState("");

  const loadReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
        setStats({
          rating: typeof data.rating === "number" ? data.rating : 0,
          reviewCount: typeof data.reviewCount === "number" ? data.reviewCount : 0,
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setReviewError("กรุณาเลือกไฟล์รูปภาพเท่านั้น (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 2.5 * 1024 * 1024) {
      setReviewError("ขนาดรูปภาพต้องไม่เกิน 2.5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setReviewError("");
    };
    reader.readAsDataURL(file);
  };

  // Submit Review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError("กรุณากรอกข้อความรีวิว");
      return;
    }

    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          authorName: currentUser ? (currentUser.globalName || currentUser.username) : authorName.trim() || "ผู้ใช้นิรนาม",
          authorAvatar: currentUser?.avatarUrl,
          discordId: currentUser?.id,
          rating,
          comment: comment.trim(),
          imageUrl: imagePreview || undefined,
          website_confirm: honeypot,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewSuccess("บันทึกรีวิวของคุณสำเร็จแล้ว ขอบคุณที่ร่วมแบ่งปันความคิดเห็นครับ!");
        setComment("");
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await loadReviews();
        if (onReviewAdded) {
          onReviewAdded(productId, data.rating, data.reviewCount);
        }
      } else {
        setReviewError(data.error || "เกิดข้อผิดพลาดในการส่งรีวิว");
      }
    } catch {
      setReviewError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Submit Reply
  const handleSubmitReply = async (reviewId: string) => {
    if (!replyContent.trim()) {
      setReplyError("กรุณากรอกข้อความตอบกลับ");
      return;
    }

    setSubmittingReply(true);
    setReplyError("");

    try {
      const res = await fetch(`/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent.trim(),
          authorName: currentUser ? (currentUser.globalName || currentUser.username) : replyAuthorName.trim() || "สมาชิก Pokky",
          authorAvatar: currentUser?.avatarUrl,
          discordId: currentUser?.id,
          website_confirm: replyHoneypot,
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        // Append reply to local state
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, replies: [...(r.replies || []), data.reply] }
              : r
          )
        );
        setReplyContent("");
        setReplyingReviewId(null);
      } else {
        setReplyError(data.error || "เกิดข้อผิดพลาดในการตอบกลับ");
      }
    } catch {
      setReplyError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Review Summary Header */}
      <div className="p-5 rounded-2xl bg-[#0e121b] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="text-4xl font-black text-amber-400 font-mono">
            {stats.rating > 0 ? stats.rating.toFixed(1) : "5.0"}
          </div>
          <div>
            <div className="flex items-center gap-1 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= Math.round(stats.rating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              จากทั้งหมด {stats.reviewCount} ความคิดเห็น & รีวิว
            </p>
          </div>
        </div>

        {/* Discord Login Status Callout */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#5865F2]/15 border border-[#5865F2]/30 text-xs">
              <img
                src={currentUser.avatarUrl || "https://cdn.discordapp.com/embed/avatars/0.png"}
                alt="Avatar"
                className="w-6 h-6 rounded-lg object-cover"
              />
              <div>
                <span className="font-bold text-white block leading-tight">
                  {currentUser.globalName || currentUser.username}
                </span>
                <span className="text-[10px] text-[#5865F2] font-semibold">
                  เชื่อมต่อ Discord แล้ว
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-3.5 py-2 rounded-xl bg-[#5865F2]/20 hover:bg-[#5865F2]/30 border border-[#5865F2]/40 text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer shadow-sm shadow-[#5865F2]/20 hover:scale-[1.02]"
            >
              <img src="/discord-logo.png" alt="Discord" className="w-4 h-4 object-contain" />
              <span>เข้าสู่ระบบด้วย Discord เพื่อแสดงตัวตน</span>
            </button>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      <form onSubmit={handleSubmitReview} className="p-5 rounded-2xl bg-[#0e121b] border border-white/10 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-green-400" />
          <span>เขียนรีวิวหรือความคิดเห็นเกี่ยวกับ Setting นี้</span>
        </h4>

        {/* Rating Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            ให้คะแนนความพึงพอใจ:
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
              >
                <Star
                  className={`w-6 h-6 ${
                    star <= (hoverRating || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-600"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-slate-400 ml-2">
              {RATING_LABELS[hoverRating || rating]}
            </span>
          </div>
        </div>

        {/* Author Name if not logged in */}
        {!currentUser && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ชื่อของคุณ (หรือเข้าสู่ระบบด้วย Discord ด้านบน)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="เช่น GamerPro หรือ ปล่อยว่างเป็นผู้ใช้นิรนาม"
              maxLength={40}
              className="w-full bg-black/40 border border-white/15 focus:border-green-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
            />
          </div>
        )}

        {/* Comment Textarea */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            ความคิดเห็น & ผลการทดสอบใช้งาน *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="เล่าประสบการณ์ เช่น เฟรมเรตนิ่งขึ้นกี่ FPS, ค่าปิงลดลงมั้ย, คอมสเปกไหน..."
            rows={3}
            maxLength={1000}
            required
            className="w-full bg-black/40 border border-white/15 focus:border-green-400 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Honeypot hidden input */}
        <input
          type="text"
          name="website_confirm"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Image Attachment (Optional) */}
        <div>
          {imagePreview ? (
            <div className="relative inline-block mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-20 object-cover rounded-xl border border-white/20"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id={`upload-rev-${productId}`}
              />
              <label
                htmlFor={`upload-rev-${productId}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white cursor-pointer transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-green-400" />
                <span>แนบรูปภาพผลเทส FPS (ไม่เกิน 2.5 MB)</span>
              </label>
            </div>
          )}
        </div>

        {reviewError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{reviewError}</span>
          </div>
        )}

        {reviewSuccess && (
          <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{reviewSuccess}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submittingReview || !comment.trim()}
          className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-300 hover:to-emerald-300 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95"
        >
          {submittingReview ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>กำลังบันทึกรีวิว...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>โพสต์รีวิว</span>
            </>
          )}
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <span>ความคิดเห็นจากผู้ใช้จริง ({reviews.length})</span>
        </h4>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-green-400" />
            <span>กำลังโหลดความคิดเห็น...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0e121b] border border-white/5 text-center text-slate-500 text-xs">
            ยังไม่มีความคิดเห็นสำหรับ Setting นี้ เป็นคนแรกที่รีวิวเลย!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#0e121b] border border-white/10 space-y-3"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.authorAvatar || "https://cdn.discordapp.com/embed/avatars/0.png"}
                    alt={rev.authorName}
                    className="w-8 h-8 rounded-xl object-cover bg-white/5 border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-xs sm:text-sm">
                        {rev.authorName}
                      </span>
                      {rev.discordId && (
                        <span className="px-1.5 py-0.2 rounded bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] text-[10px] font-mono font-semibold flex items-center gap-1">
                          <img src="/discord-logo.png" alt="Discord" className="w-3 h-3 object-contain" />
                          <span>Discord Verified</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {rev.comment}
              </p>

              {/* Attached Image */}
              {rev.imageUrl && (
                <div className="mt-2">
                  <img
                    src={rev.imageUrl}
                    alt="Review Attachment"
                    className="max-h-60 rounded-xl border border-white/15 object-cover cursor-pointer hover:opacity-90"
                    onClick={() => window.open(rev.imageUrl, "_blank")}
                  />
                </div>
              )}

              {/* Reply Button Trigger */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (replyingReviewId === rev.id) {
                      setReplyingReviewId(null);
                    } else {
                      setReplyingReviewId(rev.id);
                      setReplyContent("");
                      setReplyError("");
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 font-semibold cursor-pointer transition-colors"
                >
                  <CornerDownRight className="w-3.5 h-3.5" />
                  <span>ตอบกลับ{rev.replies && rev.replies.length > 0 ? ` (${rev.replies.length})` : ""}</span>
                </button>
              </div>

              {/* Inline Reply Form */}
              {replyingReviewId === rev.id && (
                <div className="mt-3 p-3.5 rounded-xl bg-black/50 border border-green-500/25 space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1 text-green-400">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>ตอบกลับความคิดเห็นของ {rev.authorName}:</span>
                    </span>
                    {!currentUser && (
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="text-[11px] text-[#5865F2] hover:underline flex items-center gap-1"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>ล็อกอิน Discord ก่อนตอบ</span>
                      </button>
                    )}
                  </div>

                  {!currentUser && (
                    <input
                      type="text"
                      value={replyAuthorName}
                      onChange={(e) => setReplyAuthorName(e.target.value)}
                      placeholder="ชื่อของคุณ (เช่น น้องเบส หรือสมาชิกแคลน)"
                      maxLength={30}
                      className="w-full bg-black/40 border border-white/15 focus:border-green-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                  )}

                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="พิมพ์ข้อความตอบกลับที่นี่..."
                    rows={2}
                    maxLength={1000}
                    className="w-full bg-black/40 border border-white/15 focus:border-green-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
                  />

                  {/* Reply Honeypot */}
                  <input
                    type="text"
                    value={replyHoneypot}
                    onChange={(e) => setReplyHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                  />

                  {replyError && (
                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {replyError}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyingReviewId(null)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-semibold"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmitReply(rev.id)}
                      disabled={submittingReply || !replyContent.trim()}
                      className="px-3.5 py-1.5 rounded-lg bg-green-400 hover:bg-green-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {submittingReply ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>กำลังส่ง...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>ส่งคำตอบ</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Nested Replies Thread */}
              {rev.replies && rev.replies.length > 0 && (
                <div className="mt-3 pl-4 sm:pl-6 border-l-2 border-green-500/30 space-y-2.5">
                  {rev.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={reply.authorAvatar || "https://cdn.discordapp.com/embed/avatars/1.png"}
                          alt={reply.authorName}
                          className="w-6 h-6 rounded-lg object-cover bg-white/5 border border-white/10"
                        />
                        <span className="font-bold text-white text-xs">
                          {reply.authorName}
                        </span>
                        {reply.discordId && (
                          <span className="px-1.5 py-0.2 rounded bg-[#5865F2]/20 border border-[#5865F2]/30 text-[#5865F2] text-[9px] font-mono">
                            Discord
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 font-mono ml-auto">
                          {new Date(reply.createdAt).toLocaleDateString("th-TH", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap pl-8">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
