"use client";

import React, { useState } from "react";
import { CommunityPost, DigitalProduct } from "@/types";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Pin, 
  Cpu, 
  Gamepad2, 
  Download, 
  Check, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  Trash2,
  CheckCircle2
} from "lucide-react";

interface CommunityFeedCardProps {
  post: CommunityPost;
  currentUserId?: string;
  onLikeToggle: (postId: string) => void;
  onOpenProductDownload?: (productId: string) => void;
  isAdmin?: boolean;
  onDeletePost?: (postId: string) => void;
  onTogglePin?: (postId: string, newPinned: boolean) => void;
}

export const CommunityFeedCard: React.FC<CommunityFeedCardProps> = ({
  post,
  currentUserId,
  onLikeToggle,
  onOpenProductDownload,
  isAdmin = false,
  onDeletePost,
  onTogglePin,
}) => {
  const [copied, setCopied] = useState(false);
  const isLiked = currentUserId && post.likedBy ? post.likedBy.includes(currentUserId) : false;

  const handleShare = () => {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/community#${post.id}` : "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "เมื่อสักครู่";

  return (
    <div 
      id={post.id}
      className={`relative rounded-2xl bg-[#0d0f17] border transition-all duration-300 p-5 sm:p-6 shadow-xl ${
        post.isPinned 
          ? "border-green-500/40 bg-gradient-to-b from-green-950/15 to-[#0d0f17] shadow-green-500/5" 
          : "border-white/10 hover:border-white/20"
      }`}
    >
      {/* Pinned Badge */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-xs font-mono text-green-400 mb-3 bg-green-500/10 border border-green-500/20 w-fit px-2.5 py-1 rounded-full">
          <Pin className="w-3.5 h-3.5" />
          <span className="font-bold">โพสต์ไฮไลท์ยอดเยี่ยม</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80"}
            alt={post.author.name}
            className="w-11 h-11 rounded-xl object-cover border border-white/15 shadow-md bg-black/40"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm sm:text-base font-sans">
                {post.author.name}
              </span>
              {post.author.badge && (
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  {post.author.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
              {post.author.discordTag && (
                <span className="text-indigo-400/90 font-medium">@{post.author.discordTag}</span>
              )}
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Game Tag Badge */}
        {post.gameTag && (
          <div className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-300">
            <Gamepad2 className="w-3.5 h-3.5 text-green-400" />
            <span>{post.gameTag}</span>
          </div>
        )}
      </div>

      {/* PC Specs Tag (if provided) */}
      {post.specs && (post.specs.cpu || post.specs.gpu) && (
        <div className="flex items-center gap-2 flex-wrap mb-3.5 text-[11px] font-mono text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-slate-400">สเปกทดสอบ:</span>
          {post.specs.cpu && <span className="text-white font-semibold">{post.specs.cpu}</span>}
          {post.specs.cpu && post.specs.gpu && <span className="text-slate-500">•</span>}
          {post.specs.gpu && <span className="text-green-300 font-semibold">{post.specs.gpu}</span>}
          {post.specs.ram && <span className="text-slate-500">•</span>}
          {post.specs.ram && <span className="text-slate-300">{post.specs.ram}</span>}
        </div>
      )}

      {/* Post Text Content */}
      <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans mb-4 whitespace-pre-line">
        {post.content}
      </p>

      {/* Before / After FPS Compare Banner */}
      {post.beforeAfter && (post.beforeAfter.beforeFps || post.beforeAfter.afterFps) && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-green-500/20 mb-4 font-mono">
          <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-green-400 font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>ผลลัพธ์การเปรียบเทียบ FPS</span>
            </span>
            <span className="text-[11px] text-slate-500">ผลทดสอบจริงจากเกมเมอร์</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
            <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/25">
              <span className="text-[11px] text-red-400 block mb-0.5">ก่อนปรับแต่ง (Before)</span>
              <span className="text-base sm:text-lg font-black text-red-300">{post.beforeAfter.beforeFps || "N/A"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-green-950/20 border border-green-500/30">
              <span className="text-[11px] text-green-400 block mb-0.5">หลังปรับแต่ง (After)</span>
              <span className="text-base sm:text-lg font-black text-green-300">{post.beforeAfter.afterFps || "N/A"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tagged Shop Script Call-to-Action */}
      {post.taggedProductName && (
        <div className="p-3 sm:p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase">สคริปต์ที่ใช้ในโพสต์นี้:</span>
              <span className="text-xs sm:text-sm font-bold text-white font-sans truncate block">
                {post.taggedProductName} {post.taggedProductFormat && <span className="font-mono text-xs text-slate-400">({post.taggedProductFormat})</span>}
              </span>
            </div>
          </div>
          {onOpenProductDownload && post.taggedProductId && (
            <button
              onClick={() => onOpenProductDownload(post.taggedProductId!)}
              className="shrink-0 py-1.5 px-3.5 rounded-lg bg-green-400 hover:bg-green-300 text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดฟรีตามเพื่อน</span>
            </button>
          )}
        </div>
      )}

      {/* Card Actions Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono">
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={() => onLikeToggle(post.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              isLiked
                ? "bg-red-500/15 border-red-500/30 text-red-400 font-bold"
                : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-400 text-red-400" : ""}`} />
            <span>{post.likes || 0}</span>
          </button>

          {/* Comments Count Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-slate-400">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentsCount || 0}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="คัดลอกลิงก์โพสต์"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span className="text-green-300">คัดลอกแล้ว</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>แชร์</span>
              </>
            )}
          </button>

          {/* Admin Moderation Controls */}
          {isAdmin && (
            <>
              {onTogglePin && (
                <button
                  onClick={() => onTogglePin(post.id, !post.isPinned)}
                  className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-colors cursor-pointer"
                  title={post.isPinned ? "ยกเลิกปักหมุด" : "ปักหมุดโพสต์"}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>
              )}
              {onDeletePost && (
                <button
                  onClick={() => onDeletePost(post.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors cursor-pointer"
                  title="ลบโพสต์นี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
