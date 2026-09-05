"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CyberBackground } from "@/components/CyberBackground";
import { CommunityFeedCard } from "@/components/CommunityFeedCard";
import { CreatePostModal } from "@/components/CreatePostModal";
import { FreeDownloadModal } from "@/components/FreeDownloadModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CommunityPost, DigitalProduct, PostAuthor, DownloadRecord } from "@/types";
import { DIGITAL_PRODUCTS } from "@/data/products";
import { 
  Gamepad2, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Flame, 
  Loader2, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  LogIn
} from "lucide-react";
import Link from "next/link";

const CATEGORY_TABS = [
  { id: "all", label: "ทั้งหมด (All Feeds)" },
  { id: "Valorant", label: "Valorant" },
  { id: "FiveM", label: "FiveM" },
  { id: "CS2", label: "CS2" },
  { id: "Apex Legends", label: "Apex Legends" },
  { id: "Windows & System", label: "Windows & System" },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>(DIGITAL_PRODUCTS);
  const [selectedTag, setSelectedTag] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Active user session
  const [currentUser, setCurrentUser] = useState<PostAuthor | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Download & detail modal
  const [downloadingProduct, setDownloadingProduct] = useState<DigitalProduct | null>(null);
  const [viewingProduct, setViewingProduct] = useState<DigitalProduct | null>(null);

  // Load active Discord user and admin token from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("pokky_discord_user");
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const adminToken = localStorage.getItem("pokky_admin_token");
      if (adminToken) {
        setIsAdmin(true);
      }
    } catch {}
  }, []);

  // Save Discord user
  const handleLoginDiscord = (author: PostAuthor) => {
    setCurrentUser(author);
    try {
      localStorage.setItem("pokky_discord_user", JSON.stringify(author));
    } catch {}
  };

  // Load products catalog from API
  useEffect(() => {
    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  // Load community posts
  const loadPosts = async () => {
    setLoading(true);
    try {
      const url = selectedTag && selectedTag !== "all" 
        ? `/api/community/posts?tag=${encodeURIComponent(selectedTag)}` 
        : "/api/community/posts";
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [selectedTag]);

  // Handle Like Toggle
  const handleLikeToggle = async (postId: string) => {
    const userId = currentUser ? currentUser.id : `guest-${Date.now()}`;
    
    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const likedBy = p.likedBy || [];
        const isLiked = likedBy.includes(userId);
        return {
          ...p,
          likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
          likedBy: isLiked ? likedBy.filter((id) => id !== userId) : [...likedBy, userId],
        };
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
    } catch {}
  };

  // Handle Tagged Product Download trigger
  const handleOpenProductDownload = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setDownloadingProduct(found);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์นี้ออกจากคอมมูนิตี้?")) return;
    try {
      const token = localStorage.getItem("pokky_admin_token") || "";
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch {}
  };

  const handleTogglePin = async (postId: string, newPinned: boolean) => {
    try {
      const token = localStorage.getItem("pokky_admin_token") || "";
      const res = await fetch(`/api/community/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ isPinned: newPinned }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, isPinned: newPinned } : p))
        );
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-green-400 selection:text-slate-950 relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <CyberBackground />

      {/* Header Navbar */}
      <div className="relative z-40">
        <Navbar />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-green-400 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>กลับสู่หน้าร้านหลัก</span>
          </Link>

          {currentUser ? (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/10">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-bold text-white">{currentUser.name}</span>
              <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">
                Verified
              </span>
            </div>
          ) : (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-xl border border-indigo-500/25 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบด้วย Discord</span>
            </button>
          )}
        </div>

        {/* Hero Banner Header */}
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>POKKY ESPORTS COMMUNITY HUB</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                ศูนย์รวมคอมมูนิตี้ชาวเกมเมอร์ & ผลเทส FPS
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                แลกเปลี่ยนผลลัพธ์การปรับแต่งคอมพิวเตอร์จริง โชว์เฟรมเรต Before/After ปรึกษาปัญหาคอมแลค และดาวน์โหลดการตั้งค่าตามเพื่อนในแก๊งค์ฟรี 100%
              </p>
            </div>

            {/* Create Post Button CTA */}
            <div className="shrink-0">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-green-400 hover:bg-green-300 text-slate-950 font-mono font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-green-500/25 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>แชร์ผลเทส / โพสต์พูดคุย</span>
              </button>
            </div>
          </div>

          {/* Mini Stats Bar */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-white/10 text-center font-mono">
            <div>
              <span className="text-lg sm:text-2xl font-black text-white block">5,200+</span>
              <span className="text-[11px] sm:text-xs text-slate-400">สมาชิกเกมเมอร์</span>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black text-green-400 block">+145 FPS</span>
              <span className="text-[11px] sm:text-xs text-slate-400">อัตราเฟรมเฉลี่ยที่เพิ่มขึ้น</span>
            </div>
            <div>
              <span className="text-lg sm:text-2xl font-black text-cyan-400 block">100% Free</span>
              <span className="text-[11px] sm:text-xs text-slate-400">ไม่มีค่าใช้จ่าย</span>
            </div>
          </div>
        </div>

        {/* Category Filters Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTag(tab.id)}
              className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedTag === tab.id
                  ? "bg-green-400 text-slate-950 font-bold shadow-lg shadow-green-500/20"
                  : "bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feed Cards Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-mono text-sm flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-green-400" />
              <span>กำลังโหลดฟีดคอมมูนิตี้ล่าสุด...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 space-y-3 p-6">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-base font-bold text-slate-300">ยังไม่มีโพสต์ในหมวดหมู่นี้</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                เป็นคนแรกที่แชร์ผลลัพธ์ความลื่น หรือตั้งกระทู้พูดคุยในหมวดนี้
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="py-2 px-4 rounded-xl bg-green-400/20 text-green-300 border border-green-500/30 font-mono text-xs font-bold hover:bg-green-400/30 transition-colors cursor-pointer"
              >
                สร้างโพสต์แรกเลย
              </button>
            </div>
          ) : (
            posts.map((post) => (
              <CommunityFeedCard
                key={post.id}
                post={post}
                currentUserId={currentUser?.id}
                onLikeToggle={handleLikeToggle}
                onOpenProductDownload={handleOpenProductDownload}
                isAdmin={isAdmin}
                onDeletePost={handleDeletePost}
                onTogglePin={handleTogglePin}
              />
            ))
          )}
        </div>

      </main>

      {/* Footer */}
      <div className="relative z-10 mt-12">
        <Footer />
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={loadPosts}
        products={products}
        currentUser={currentUser}
        onLoginDiscord={handleLoginDiscord}
      />

      {/* Free Download Modal (triggered when clicking a tagged script) */}
      <FreeDownloadModal
        isOpen={!!downloadingProduct}
        onClose={() => setDownloadingProduct(null)}
        product={downloadingProduct}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={viewingProduct}
        onClose={() => setViewingProduct(null)}
        onBuyNow={(prod) => {
          setViewingProduct(null);
          setDownloadingProduct(prod);
        }}
      />

    </div>
  );
}
