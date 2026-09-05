"use client";

import React, { useState, useEffect } from "react";
import { PostAuthor, DigitalProduct } from "@/types";
import { 
  X, 
  Gamepad2, 
  Send, 
  Sparkles, 
  Cpu, 
  TrendingUp, 
  AlertCircle, 
  Loader2, 
  CheckCircle2,
  LogIn,
  UserCheck
} from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  products: DigitalProduct[];
  currentUser: PostAuthor | null;
  onLoginDiscord: (author: PostAuthor) => void;
}

const GAME_OPTIONS = [
  "Valorant",
  "FiveM",
  "CS2",
  "Apex Legends",
  "Overwatch 2",
  "PUBG",
  "GTA V",
  "Windows & System",
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
  products,
  currentUser,
  onLoginDiscord,
}) => {
  // Form fields
  const [content, setContent] = useState("");
  const [gameTag, setGameTag] = useState("Valorant");
  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [beforeFps, setBeforeFps] = useState("");
  const [afterFps, setAfterFps] = useState("");
  const [taggedProductId, setTaggedProductId] = useState("");
  const [honeypot, setHoneypot] = useState("");

  // Discord connect state (for guests)
  const [discordName, setDiscordName] = useState("");
  const [discordTag, setDiscordTag] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-fill tagged product from first product if available
  useEffect(() => {
    if (products.length > 0 && !taggedProductId) {
      setTaggedProductId(products[0].id);
    }
  }, [products, taggedProductId]);

  if (!isOpen) return null;

  const handleQuickDiscordConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discordName.trim()) {
      setError("กรุณากรอกชื่อ Discord ของคุณ");
      return;
    }

    const randomAvatars = [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80",
    ];
    const pickedAvatar = randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    const author: PostAuthor = {
      id: `discord-${Date.now()}`,
      name: discordName.trim(),
      discordTag: discordTag.trim() || discordName.trim().toLowerCase(),
      avatar: pickedAvatar,
      badge: "Verified Gamer",
    };

    onLoginDiscord(author);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentUser) {
      setError("กรุณายืนยันตัวตน Discord ก่อนโพสต์");
      return;
    }

    if (!content.trim() || content.trim().length < 5) {
      setError("กรุณากรอกข้อความอย่างน้อย 5 ตัวอักษร");
      return;
    }

    setSubmitting(true);

    try {
      const taggedProd = products.find((p) => p.id === taggedProductId);

      const payload = {
        author: currentUser,
        content: content.trim(),
        gameTag,
        specs: (cpu || gpu || ram) ? {
          cpu: cpu.trim() || undefined,
          gpu: gpu.trim() || undefined,
          ram: ram.trim() || undefined,
        } : undefined,
        taggedProductId: taggedProd?.id,
        taggedProductName: taggedProd?.name,
        taggedProductFormat: taggedProd?.fileFormat,
        beforeAfter: (beforeFps || afterFps) ? {
          beforeFps: beforeFps.trim() || undefined,
          afterFps: afterFps.trim() || undefined,
        } : undefined,
        website_confirm: honeypot,
      };

      const res = await fetch("/api/community/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess("สร้างโพสต์สำเร็จ!");
        setTimeout(() => {
          onPostCreated();
          onClose();
        }, 1200);
      } else {
        setError(data.error || "เกิดข้อผิดพลาดในการสร้างโพสต์");
      }
    } catch {
      setError("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0e1017] border border-white/15 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-4">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-white/[0.03] shrink-0">
          <div className="flex items-center gap-2 text-sm font-mono text-green-400 font-bold">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-white">แชร์ผลเทส & พูดคุยในคอมมูนิตี้</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
          
          {/* STEP 1: Connect Discord (If not logged in) */}
          {!currentUser ? (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold">
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบด้วย Discord ก่อนโพสต์</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                เพื่อป้องกันบอทและสแปม กรุณาระบุชื่อบัญชี Discord ของคุณเพื่อแสดงผลเป็นป้าย Verified Gamer บนหัวโพสต์
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="ชื่อ Discord (เช่น PokkyMaster)"
                  value={discordName}
                  onChange={(e) => setDiscordName(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none text-xs"
                />
                <input
                  type="text"
                  placeholder="Tag หรือ Username ย่อ (ไม่บังคับ)"
                  value={discordTag}
                  onChange={(e) => setDiscordTag(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-slate-500 focus:border-indigo-400 focus:outline-none text-xs"
                />
              </div>
              <button
                type="button"
                onClick={handleQuickDiscordConnect}
                className="w-full py-2 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>เชื่อมต่อโปรไฟล์ Discord ทันที</span>
              </button>
            </div>
          ) : (
            /* Current User Active Profile Bar */
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-lg object-cover border border-white/10"
                />
                <div>
                  <span className="font-bold text-white text-xs block leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] font-mono text-indigo-300">@{currentUser.discordTag || currentUser.name}</span>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                <UserCheck className="w-3 h-3" />
                <span>Verified Discord</span>
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Honeypot Trap */}
            <div className="absolute -left-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
              <input
                type="text"
                name="website_confirm"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
              />
            </div>

            {/* Post Content */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1 font-bold">
                ข้อความโพสต์ / รีวิวความลื่น:
              </label>
              <textarea
                rows={3}
                placeholder="พิมพ์ข้อความรีวิว สัมผัสความลื่น หรือการตั้งค่าที่อยากบอกต่อเพื่อนๆ ในแก๊ง..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-green-400 font-sans leading-relaxed resize-y text-xs sm:text-sm"
                required
              />
            </div>

            {/* Game Tag & Tagged Script */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  หมวดหมู่เกม:
                </label>
                <select
                  value={gameTag}
                  onChange={(e) => setGameTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-green-400 font-mono text-xs cursor-pointer"
                >
                  {GAME_OPTIONS.map((g) => (
                    <option key={g} value={g} className="bg-[#0e1017] text-white">
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  แท็กสคริปต์ของร้านที่ใช้:
                </label>
                <select
                  value={taggedProductId}
                  onChange={(e) => setTaggedProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-green-400 font-sans text-xs cursor-pointer truncate"
                >
                  <option value="" className="bg-[#0e1017] text-slate-400">
                    -- ไม่ได้แท็กสคริปต์ --
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#0e1017] text-white truncate">
                      {p.name} ({p.fileFormat})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PC Specs (Optional) */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold">
                <Cpu className="w-3.5 h-3.5" />
                <span>สเปกคอมพิวเตอร์ของคุณ (ไม่บังคับ):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="CPU (เช่น i5-12400F)"
                  value={cpu}
                  onChange={(e) => setCpu(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="GPU (เช่น RTX 4060)"
                  value={gpu}
                  onChange={(e) => setGpu(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="RAM (เช่น 32GB 3200MHz)"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-slate-500 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Before / After FPS (Optional) */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-green-400 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>ผลการทดสอบ FPS ก่อน/หลัง (ไม่บังคับ):</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="ก่อนจูน เช่น 140 FPS"
                  value={beforeFps}
                  onChange={(e) => setBeforeFps(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-red-500/30 text-white placeholder-slate-500 text-xs font-mono focus:border-red-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="หลังจูน เช่น 285 FPS"
                  value={afterFps}
                  onChange={(e) => setAfterFps(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-green-500/30 text-white placeholder-slate-500 text-xs font-mono focus:border-green-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Feedback */}
            {error && (
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 rounded-xl text-xs font-mono text-slate-300 hover:text-white border border-white/10 bg-white/5 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={submitting || !currentUser}
                className="py-2 px-5 rounded-xl text-xs sm:text-sm font-bold font-sans text-slate-950 bg-green-400 hover:bg-green-300 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-green-500/25 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังแชร์โพสต์...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>เผยแพร่สู่คอมมูนิตี้</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
