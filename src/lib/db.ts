import fs from "fs";
import path from "path";
import { RealProduct, INITIAL_REAL_PRODUCTS } from "@/data/realProducts";
import { Review, ReviewReply, AppUser } from "@/types";
import { getSupabase } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "products.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// In-memory cache for fast lookups & serverless persistence during instance lifetime
let memoryCache: RealProduct[] | null = null;
let reviewsCache: Review[] | null = null;
let usersCache: AppUser[] | null = null;
const MAX_BLOB_STORAGE = 15;
const fileStorage = new Map<string, { filename: string; content: string }>();

function ensureDbFile(): RealProduct[] {
  if (memoryCache !== null) {
    return memoryCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {
        // Read-only filesystem on serverless
      }
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryCache = parsed;
        return memoryCache;
      }
    }

    // Seed with initial real products
    memoryCache = [...INITIAL_REAL_PRODUCTS];
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(memoryCache, null, 2), "utf-8");
    } catch {
      // Ignore if read-only
    }
    return memoryCache;
  } catch {
    memoryCache = [...INITIAL_REAL_PRODUCTS];
    return memoryCache;
  }
}

function persistDb(products: RealProduct[]) {
  memoryCache = products;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2), "utf-8");
  } catch {
    // In serverless instances where FS is read-only, memoryCache retains state
  }
}

function ensureReviewsFile(): Review[] {
  if (reviewsCache !== null) {
    return reviewsCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {
        // Read-only filesystem on serverless
      }
    }

    if (fs.existsSync(REVIEWS_FILE)) {
      const raw = fs.readFileSync(REVIEWS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        reviewsCache = parsed;
        return reviewsCache;
      }
    }

    reviewsCache = [];
    try {
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviewsCache, null, 2), "utf-8");
    } catch {
      // Ignore if read-only
    }
    return reviewsCache;
  } catch {
    reviewsCache = [];
    return reviewsCache;
  }
}

function persistReviews(reviews: Review[]) {
  reviewsCache = reviews;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
  } catch {
    // In serverless instances where FS is read-only, reviewsCache retains state
  }
}

function ensureUsersFile(): AppUser[] {
  if (usersCache !== null) {
    return usersCache;
  }

  try {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch {
        // Read-only filesystem on serverless
      }
    }

    if (fs.existsSync(USERS_FILE)) {
      const raw = fs.readFileSync(USERS_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        usersCache = parsed;
        return usersCache;
      }
    }

    usersCache = [];
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(usersCache, null, 2), "utf-8");
    } catch {
      // Ignore if read-only
    }
    return usersCache;
  } catch {
    usersCache = [];
    return usersCache;
  }
}

function persistUsers(users: AppUser[]) {
  usersCache = users;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch {
    // In serverless instances where FS is read-only, usersCache retains state
  }
}

function calculateProductRating(productId: string, reviews: Review[]) {
  const prodReviews = reviews.filter((r) => r.productId === productId);
  const reviewCount = prodReviews.length;
  const rating = reviewCount > 0
    ? Number((prodReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : 0;
  return { rating, reviewCount };
}

function sanitizeString(val: string | undefined | null): string {
  if (!val) return "";
  return val.replace(/\0/g, "").trim();
}

function sanitizeCode(val: string | undefined | null): string {
  if (!val) return "";
  return val.replace(/\0/g, "");
}

export interface SupabaseProductRow {
  id: string;
  name: string;
  tagline?: string;
  category: RealProduct["category"];
  price?: number;
  originalPrice?: number;
  isFree?: boolean;
  badge?: string;
  popular?: boolean;
  version?: string;
  fileFormat?: string;
  fileSize?: string;
  downloadsCount?: number;
  rating?: number;
  reviewCount?: number;
  compatibility?: string;
  includedFiles?: RealProduct["includedFiles"];
  features?: string[];
  requirements?: string[];
  description?: string;
  hasRevertScript?: boolean;
  downloadUrl?: string;
  imageUrl?: string;
  active?: boolean;
  scriptContent?: string;
  revertScript?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

function parseProduct(prod: SupabaseProductRow): RealProduct {
  let downloadUrl = prod.downloadUrl;
  let scriptContent = prod.scriptContent || "";

  if (!downloadUrl && typeof scriptContent === "string" && scriptContent.startsWith("DOWNLOAD_URL:")) {
    const newlineIdx = scriptContent.indexOf("\n");
    if (newlineIdx !== -1) {
      downloadUrl = scriptContent.substring("DOWNLOAD_URL:".length, newlineIdx).trim();
      scriptContent = scriptContent.substring(newlineIdx + 1).replace(/^---SCRIPT---\n?/, "");
    } else {
      downloadUrl = scriptContent.substring("DOWNLOAD_URL:".length).trim();
      scriptContent = "";
    }
  } else if (!downloadUrl && typeof scriptContent === "string" && (scriptContent.startsWith("http://") || scriptContent.startsWith("https://"))) {
    downloadUrl = scriptContent.trim();
  }

  return {
    id: prod.id,
    name: prod.name,
    tagline: prod.tagline || "",
    description: prod.description || "",
    category: prod.category,
    fileFormat: prod.fileFormat || ".BAT",
    fileSize: prod.fileSize || "50 KB",
    version: prod.version || "v1.0.0",
    compatibility: prod.compatibility || "Windows 10 / 11 (64-bit)",
    downloadsCount: typeof prod.downloadsCount === "number" ? prod.downloadsCount : 0,
    rating: typeof prod.rating === "number" ? prod.rating : 0,
    reviewCount: typeof prod.reviewCount === "number" ? prod.reviewCount : 0,
    popular: Boolean(prod.popular),
    active: prod.active !== false,
    features: Array.isArray(prod.features) ? prod.features : [],
    requirements: Array.isArray(prod.requirements) ? prod.requirements : [],
    includedFiles: Array.isArray(prod.includedFiles) ? prod.includedFiles : [],
    scriptContent,
    revertScript: prod.revertScript || "",
    imageUrl: prod.imageUrl,
    downloadUrl,
    createdAt: prod.createdAt || new Date().toISOString(),
    updatedAt: prod.updatedAt || new Date().toISOString(),
  };
}

const LISTING_COLUMNS = "id, name, tagline, description, category, fileFormat, fileSize, version, compatibility, downloadsCount, rating, reviewCount, popular, active, features, requirements, includedFiles, imageUrl, createdAt, updatedAt";

export const db = {
  /**
   * Lean listing query for store catalog - strips multi-megabyte script content & base64 payloads
   */
  async getProductsListing(activeOnly = true): Promise<RealProduct[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from("products").select(LISTING_COLUMNS);
        if (activeOnly) {
          query = query.eq("active", true);
        }
        const { data, error } = await query.order("downloadsCount", { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseProductRow[]).map((p) => {
            const parsed = parseProduct(p);
            return {
              ...parsed,
              scriptContent: "",
              revertScript: "",
            };
          });
        }
      } catch (e) {
        console.error("Supabase getProductsListing error, using fallback:", e);
      }
    }

    const products = ensureDbFile();
    const reviews = ensureReviewsFile();

    const enriched = products.map((prod) => {
      const { rating, reviewCount } = calculateProductRating(prod.id, reviews);
      return parseProduct({
        ...prod,
        rating,
        reviewCount,
        scriptContent: "",
        revertScript: "",
      });
    });

    if (activeOnly) {
      return enriched.filter((p) => p.active);
    }
    return [...enriched];
  },

  /**
   * Lean metadata query for a single product page
   */
  async getProductMetadata(id: string): Promise<RealProduct | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(LISTING_COLUMNS)
          .eq("id", id)
          .maybeSingle();
        if (!error && data) {
          const parsed = parseProduct(data as unknown as SupabaseProductRow);
          return {
            ...parsed,
            scriptContent: "",
            revertScript: "",
          };
        }
      } catch (e) {
        console.error("Supabase getProductMetadata error, using fallback:", e);
      }
    }

    const prod = await this.getProductById(id);
    if (!prod) return undefined;
    return {
      ...prod,
      scriptContent: "",
      revertScript: "",
    };
  },

  async getProducts(activeOnly = true): Promise<RealProduct[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from("products").select("*");
        if (activeOnly) {
          query = query.eq("active", true);
        }
        const { data, error } = await query.order("downloadsCount", { ascending: false });
        if (!error && data && data.length > 0) {
          return (data as unknown as SupabaseProductRow[]).map(parseProduct);
        }
      } catch (e) {
        console.error("Supabase getProducts error, using fallback:", e);
      }
    }

    const products = ensureDbFile();
    const reviews = ensureReviewsFile();

    const enriched = products.map((prod) => {
      const { rating, reviewCount } = calculateProductRating(prod.id, reviews);
      return parseProduct({
        ...prod,
        rating,
        reviewCount,
      });
    });

    if (activeOnly) {
      return enriched.filter((p) => p.active);
    }
    return [...enriched];
  },

  async getProductById(id: string): Promise<RealProduct | undefined> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return parseProduct(data);
        }
      } catch (e) {
        console.error("Supabase getProductById error, using fallback:", e);
      }
    }

    const products = ensureDbFile();
    const prod = products.find((p) => p.id === id);
    if (!prod) return undefined;

    const reviews = ensureReviewsFile();
    const { rating, reviewCount } = calculateProductRating(prod.id, reviews);
    return parseProduct({
      ...prod,
      rating,
      reviewCount,
    });
  },

  async createProduct(data: Partial<RealProduct> & { name: string; category: RealProduct["category"] }): Promise<RealProduct> {
    const id = data.id || `pokky-${Date.now()}`;
    
    const rawScript = typeof data.scriptContent === "string" ? data.scriptContent : "";
    let scriptContentToStore = rawScript.startsWith("data:")
      ? rawScript
      : sanitizeCode(rawScript || `@echo off\ntitle ${data.name}\necho [POKKY STOZY] กำลังดำเนินการปรับแต่ง...\npause`);

    if (data.downloadUrl && data.downloadUrl.trim().startsWith("http")) {
      const cleanUrl = data.downloadUrl.trim();
      if (!scriptContentToStore.includes(cleanUrl)) {
        scriptContentToStore = `DOWNLOAD_URL:${cleanUrl}\n---SCRIPT---\n${scriptContentToStore}`;
      }
    }

    const newProd: RealProduct = {
      id,
      name: sanitizeString(data.name),
      tagline: sanitizeString(data.tagline || "สคริปต์ปรับแต่งประสิทธิภาพเกมเมอร์ระดับ Esports"),
      description: sanitizeString(data.description || "สคริปต์ปรับแต่งคอมพิวเตอร์เพื่อความเสถียรและเฟรมเรตสูงสุด"),
      imageUrl: data.imageUrl ? sanitizeString(data.imageUrl) : undefined,
      downloadUrl: data.downloadUrl ? sanitizeString(data.downloadUrl) : undefined,
      category: data.category,
      fileFormat: sanitizeString(data.fileFormat || ".BAT"),
      fileSize: sanitizeString(data.fileSize || "50 KB"),
      version: sanitizeString(data.version || "v1.0.0"),
      compatibility: sanitizeString(data.compatibility || "Windows 10 / 11 (64-bit)"),
      downloadsCount: data.downloadsCount || 0,
      rating: 0,
      reviewCount: 0,
      popular: data.popular ?? false,
      active: data.active ?? true,
      features: (data.features && data.features.length > 0
        ? data.features
        : [
            "ปรับแต่งและเพิ่มความเสถียรของระบบ Windows",
            "ลด Input Delay และ Latency ในการเล่นเกม",
            "มีสคริปต์ Revert คืนค่าเดิมของระบบ ปลอดภัย 100%"
          ]
      ).map(sanitizeString),
      requirements: (data.requirements && data.requirements.length > 0
        ? data.requirements
        : ["Windows 10 หรือ 11 (64-bit ทุกรุ่น)", "สิทธิ์ Administrator (Run as Administrator)"]
      ).map(sanitizeString),
      includedFiles: (data.includedFiles && data.includedFiles.length > 0
        ? data.includedFiles
        : [
            {
              filename: `${(data.name || "Pokky_Optimizer").replace(/[^a-zA-Z0-9_\-]/g, "_").replace(/_+/g, "_")}.cmd`,
              description: "สคริปต์ปรับแต่งหลัก"
            },
            {
              filename: `REVERT_${(data.name || "Pokky_Optimizer").replace(/[^a-zA-Z0-9_\-]/g, "_").replace(/_+/g, "_")}.bat`,
              description: "สคริปต์กู้คืนค่ามาตรฐานเดิม"
            }
          ]
      ).map(f => ({
        filename: sanitizeString(f.filename),
        description: sanitizeString(f.description)
      })),
      scriptContent: scriptContentToStore,
      revertScript: sanitizeCode(data.revertScript || `@echo off\ntitle Revert - ${data.name}\necho คืนค่าเดิมของระบบเรียบร้อย\npause`),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      const { downloadUrl: _omit, ...dbProd } = newProd;
      const { data: inserted, error } = await supabase.from("products").insert(dbProd).select().single();
      if (error) {
        console.error("Supabase insert product error:", error);
        throw new Error(`ไม่สามารถบันทึกลงฐานข้อมูล Supabase ได้: ${error.message || error.details || error.code}`);
      }
      if (inserted) {
        const parsed = parseProduct(inserted);
        const products = ensureDbFile();
        products.unshift(parsed);
        persistDb(products);
        return parsed;
      }
    }

    const products = ensureDbFile();
    products.unshift(newProd);
    persistDb(products);
    return newProd;
  },

  async updateProduct(id: string, updates: Partial<RealProduct>): Promise<RealProduct | null> {
    const sanitizedUpdates: Partial<RealProduct> = { ...updates };
    if (sanitizedUpdates.name !== undefined) sanitizedUpdates.name = sanitizeString(sanitizedUpdates.name);
    if (sanitizedUpdates.tagline !== undefined) sanitizedUpdates.tagline = sanitizeString(sanitizedUpdates.tagline);
    if (sanitizedUpdates.description !== undefined) sanitizedUpdates.description = sanitizeString(sanitizedUpdates.description);
    if (sanitizedUpdates.compatibility !== undefined) sanitizedUpdates.compatibility = sanitizeString(sanitizedUpdates.compatibility);
    if (sanitizedUpdates.fileFormat !== undefined) sanitizedUpdates.fileFormat = sanitizeString(sanitizedUpdates.fileFormat);
    if (sanitizedUpdates.fileSize !== undefined) sanitizedUpdates.fileSize = sanitizeString(sanitizedUpdates.fileSize);
    
    let scriptContentToStore = sanitizedUpdates.scriptContent;
    if (typeof scriptContentToStore === "string") {
      scriptContentToStore = scriptContentToStore.startsWith("data:")
        ? scriptContentToStore
        : sanitizeCode(scriptContentToStore);
    }
    if (sanitizedUpdates.downloadUrl && sanitizedUpdates.downloadUrl.trim().startsWith("http")) {
      const cleanUrl = sanitizedUpdates.downloadUrl.trim();
      const baseContent = scriptContentToStore || "";
      if (!baseContent.includes(cleanUrl)) {
        scriptContentToStore = `DOWNLOAD_URL:${cleanUrl}\n---SCRIPT---\n${baseContent}`;
      }
    }
    if (scriptContentToStore !== undefined) {
      sanitizedUpdates.scriptContent = scriptContentToStore;
    }

    if (sanitizedUpdates.revertScript !== undefined) sanitizedUpdates.revertScript = sanitizeCode(sanitizedUpdates.revertScript);
    if (sanitizedUpdates.features) sanitizedUpdates.features = sanitizedUpdates.features.map(sanitizeString);
    if (sanitizedUpdates.requirements) sanitizedUpdates.requirements = sanitizedUpdates.requirements.map(sanitizeString);
    if (sanitizedUpdates.includedFiles) {
      sanitizedUpdates.includedFiles = sanitizedUpdates.includedFiles.map(f => ({
        filename: sanitizeString(f.filename),
        description: sanitizeString(f.description)
      }));
    }

    const supabase = getSupabase();
    if (supabase) {
      const { downloadUrl: _omit, ...dbUpdates } = sanitizedUpdates;
      const { data: updated, error } = await supabase
        .from("products")
        .update({
          ...dbUpdates,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (error) {
        console.error("Supabase update product error:", error);
        throw new Error(`ไม่สามารถอัปเดตข้อมูลบน Supabase ได้: ${error.message || error.details || error.code}`);
      }
      if (updated) {
        const parsed = parseProduct(updated);
        const products = ensureDbFile();
        const idx = products.findIndex((p) => p.id === id);
        if (idx !== -1) {
          products[idx] = parsed;
          persistDb(products);
        }
        return parsed;
      }
    }

    const products = ensureDbFile();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    products[idx] = parseProduct({
      ...products[idx],
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
    });
    persistDb(products);
    return products[idx];
  },

  async deleteProduct(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        console.error("Supabase delete product error:", error);
        throw new Error(`ไม่สามารถลบข้อมูลบน Supabase ได้: ${error.message || error.details || error.code}`);
      }
      const products = ensureDbFile();
      const filtered = products.filter((p) => p.id !== id);
      persistDb(filtered);
      return true;
    }

    const products = ensureDbFile();
    const initialLen = products.length;
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length !== initialLen) {
      persistDb(filtered);
      return true;
    }
    return false;
  },

  async incrementDownload(id: string): Promise<number> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        // Try atomic PostgreSQL RPC function if created
        const { data: rpcCount, error: rpcError } = await supabase.rpc("increment_downloads_count", { row_id: id });
        if (!rpcError && typeof rpcCount === "number") {
          return rpcCount;
        }

        // Standard fallback
        const { data: prod } = await supabase.from("products").select("downloadsCount").eq("id", id).maybeSingle();
        const currentCount = typeof prod?.downloadsCount === "number" ? prod.downloadsCount : 0;
        const newCount = currentCount + 1;
        await supabase.from("products").update({ downloadsCount: newCount }).eq("id", id);
        return newCount;
      } catch (e) {
        console.error("Supabase incrementDownload error, using fallback:", e);
      }
    }

    const products = ensureDbFile();
    const prod = products.find((p) => p.id === id);
    if (prod) {
      prod.downloadsCount = (prod.downloadsCount || 0) + 1;
      persistDb(products);
      return prod.downloadsCount;
    }
    return 0;
  },

  async getStats() {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: prods, error } = await supabase.from("products").select("downloadsCount, active, popular");
        if (!error && prods) {
          const totalDownloads = prods.reduce((sum, p) => sum + ((p.downloadsCount as number) || 0), 0);
          const totalProducts = prods.length;
          const activeProducts = prods.filter((p) => p.active).length;
          const popularCount = prods.filter((p) => p.popular).length;
          return {
            totalDownloads,
            totalProducts,
            activeProducts,
            popularCount,
          };
        }
      } catch (e) {
        console.error("Supabase getStats error, using fallback:", e);
      }
    }

    const products = ensureDbFile();
    const totalDownloads = products.reduce((sum, p) => sum + (p.downloadsCount || 0), 0);
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.active).length;
    const popularCount = products.filter((p) => p.popular).length;

    return {
      totalDownloads,
      totalProducts,
      activeProducts,
      popularCount,
    };
  },

  // --- Real User Reviews & Ratings (No Login Required) ---
  async getReviews(productId?: string): Promise<Review[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from("reviews").select("*").order("createdAt", { ascending: false });
        if (productId) {
          query = query.eq("productId", productId);
        }
        const { data, error } = await query;
        if (!error && data) {
          return data as Review[];
        }
      } catch (e) {
        console.error("Supabase getReviews error, using fallback:", e);
      }
    }

    const reviews = ensureReviewsFile();
    let result = [...reviews];
    if (productId) {
      result = result.filter((r) => r.productId === productId);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async createReview(data: {
    productId: string;
    authorName: string;
    authorAvatar?: string;
    discordId?: string;
    rating: number;
    comment: string;
    imageUrl?: string;
  }): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: data.productId,
      authorName: data.authorName.trim() || "ผู้ใช้นิรนาม",
      authorAvatar: data.authorAvatar || undefined,
      discordId: data.discordId || undefined,
      rating: Math.max(1, Math.min(5, Math.round(data.rating))),
      comment: data.comment.trim(),
      imageUrl: data.imageUrl || undefined,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: insertedReview, error: revErr } = await supabase
          .from("reviews")
          .insert(newReview)
          .select()
          .single();

        if (!revErr && insertedReview) {
          // Re-calculate product rating and update product row in Supabase
          const { data: allReviews } = await supabase
            .from("reviews")
            .select("rating")
            .eq("productId", data.productId);

          if (allReviews && allReviews.length > 0) {
            const count = allReviews.length;
            const avg = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));
            await supabase
              .from("products")
              .update({ rating: avg, reviewCount: count })
              .eq("id", data.productId);
          }

          return insertedReview as Review;
        }
        if (revErr) {
          console.error("Supabase insert review error:", revErr);
        }
      } catch (e) {
        console.error("Supabase createReview error, using fallback:", e);
      }
    }

    const reviews = ensureReviewsFile();
    reviews.unshift(newReview);
    persistReviews(reviews);

    // Update product rating and review count in local products
    const products = ensureDbFile();
    const prod = products.find((p) => p.id === data.productId);
    if (prod) {
      const { rating, reviewCount } = calculateProductRating(prod.id, reviews);
      prod.rating = rating;
      prod.reviewCount = reviewCount;
      persistDb(products);
    }

    return newReview;
  },

  async addReviewReply(
    reviewId: string,
    replyData: {
      authorName: string;
      authorAvatar?: string;
      discordId?: string;
      content: string;
    }
  ): Promise<ReviewReply | null> {
    const newReply: ReviewReply = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      reviewId,
      authorName: replyData.authorName.trim() || "สมาชิก Pokky",
      authorAvatar: replyData.authorAvatar || undefined,
      discordId: replyData.discordId || undefined,
      content: replyData.content.trim(),
      createdAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: rev } = await supabase
          .from("reviews")
          .select("replies")
          .eq("id", reviewId)
          .single();
        if (rev) {
          const updatedReplies = Array.isArray(rev.replies) ? [...rev.replies, newReply] : [newReply];
          await supabase
            .from("reviews")
            .update({ replies: updatedReplies })
            .eq("id", reviewId);
        }
      } catch (e) {
        console.error("Supabase addReviewReply error, using local fallback:", e);
      }
    }

    const reviews = ensureReviewsFile();
    const targetRev = reviews.find((r) => r.id === reviewId);
    if (!targetRev) return null;

    targetRev.replies = targetRev.replies || [];
    targetRev.replies.push(newReply);
    persistReviews(reviews);

    return newReply;
  },

  async getProductRating(productId: string): Promise<{ rating: number; reviewCount: number }> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data: reviews } = await supabase
          .from("reviews")
          .select("rating")
          .eq("productId", productId);
        if (reviews) {
          const count = reviews.length;
          const rating = count > 0
            ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
            : 0;
          return { rating, reviewCount: count };
        }
      } catch (e) {
        console.error("Supabase getProductRating error, using fallback:", e);
      }
    }

    const reviews = ensureReviewsFile();
    return calculateProductRating(productId, reviews);
  },

  saveUploadedBlob(fileId: string, filename: string, content: string) {
    if (fileStorage.size >= MAX_BLOB_STORAGE) {
      const oldestKey = fileStorage.keys().next().value;
      if (oldestKey) {
        fileStorage.delete(oldestKey);
      }
    }
    fileStorage.set(fileId, { filename, content });
    return fileId;
  },

  getUploadedBlob(fileId: string) {
    return fileStorage.get(fileId) || null;
  },

  /**
   * Upsert a user by discord_id (Unique Key)
   * If user with this discord_id exists, updates their profile and lastLoginAt.
   * If not, inserts a new user record.
   * Works across both Supabase PostgreSQL and Local JSON fallback.
   */
  async upsertDiscordUser(userData: {
    discordId: string;
    username: string;
    globalName?: string;
    email?: string;
    avatar?: string;
    avatarUrl?: string;
    role?: "user" | "admin" | "banned";
  }): Promise<AppUser> {
    const now = new Date().toISOString();
    const supabase = getSupabase();
    let internalId = `usr_${userData.discordId}`;

    if (supabase) {
      try {
        const { data: existingUsers } = await supabase
          .from("users")
          .select("*")
          .eq("discord_id", userData.discordId)
          .limit(1);

        if (existingUsers && existingUsers.length > 0) {
          const existing = existingUsers[0];
          internalId = existing.id;
          await supabase
            .from("users")
            .update({
              username: userData.username,
              global_name: userData.globalName || userData.username,
              email: userData.email || existing.email,
              avatar: userData.avatar || existing.avatar,
              avatar_url: userData.avatarUrl || existing.avatar_url,
              last_login_at: now,
            })
            .eq("id", internalId);
        } else {
          await supabase.from("users").insert({
            id: internalId,
            discord_id: userData.discordId,
            username: userData.username,
            global_name: userData.globalName || userData.username,
            email: userData.email || null,
            avatar: userData.avatar || null,
            avatar_url: userData.avatarUrl || null,
            role: userData.role || "user",
            created_at: now,
            last_login_at: now,
          });
        }
      } catch (e) {
        console.error("Supabase upsertDiscordUser error, using local fallback:", e);
      }
    }

    // Local JSON / memoryCache persistence
    const users = ensureUsersFile();
    const existingIndex = users.findIndex((u) => u.discordId === userData.discordId);

    let finalUser: AppUser;
    if (existingIndex >= 0) {
      finalUser = {
        ...users[existingIndex],
        username: userData.username,
        globalName: userData.globalName || userData.username,
        email: userData.email || users[existingIndex].email,
        avatar: userData.avatar || users[existingIndex].avatar,
        avatarUrl: userData.avatarUrl || users[existingIndex].avatarUrl,
        lastLoginAt: now,
      };
      users[existingIndex] = finalUser;
    } else {
      finalUser = {
        id: internalId,
        discordId: userData.discordId,
        username: userData.username,
        globalName: userData.globalName || userData.username,
        email: userData.email,
        avatar: userData.avatar,
        avatarUrl: userData.avatarUrl,
        role: userData.role || "user",
        createdAt: now,
        lastLoginAt: now,
      };
      users.push(finalUser);
    }

    persistUsers(users);
    return finalUser;
  },

  async getUserByDiscordId(discordId: string): Promise<AppUser | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("discord_id", discordId)
          .limit(1);
        if (data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            discordId: row.discord_id,
            username: row.username,
            globalName: row.global_name,
            email: row.email,
            avatar: row.avatar,
            avatarUrl: row.avatar_url,
            role: row.role || "user",
            createdAt: row.created_at,
            lastLoginAt: row.last_login_at,
          };
        }
      } catch (e) {
        console.error("Supabase getUserByDiscordId error:", e);
      }
    }
    const users = ensureUsersFile();
    return users.find((u) => u.discordId === discordId) || null;
  },

  async getUserById(id: string): Promise<AppUser | null> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .limit(1);
        if (data && data.length > 0) {
          const row = data[0];
          return {
            id: row.id,
            discordId: row.discord_id,
            username: row.username,
            globalName: row.global_name,
            email: row.email,
            avatar: row.avatar,
            avatarUrl: row.avatar_url,
            role: row.role || "user",
            createdAt: row.created_at,
            lastLoginAt: row.last_login_at,
          };
        }
      } catch (e) {
        console.error("Supabase getUserById error:", e);
      }
    }
    const users = ensureUsersFile();
    return users.find((u) => u.id === id) || null;
  },

  async getAllUsers(): Promise<AppUser[]> {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .order("last_login_at", { ascending: false });
        if (data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            discordId: row.discord_id,
            username: row.username,
            globalName: row.global_name,
            email: row.email,
            avatar: row.avatar,
            avatarUrl: row.avatar_url,
            role: row.role || "user",
            createdAt: row.created_at,
            lastLoginAt: row.last_login_at,
          }));
        }
      } catch (e) {
        console.error("Supabase getAllUsers error:", e);
      }
    }
    return ensureUsersFile();
  },

  async updateUserRole(idOrDiscordId: string, role: "user" | "admin" | "banned"): Promise<boolean> {
    const supabase = getSupabase();
    let updatedInSupabase = false;

    if (supabase) {
      try {
        const { error } = await supabase
          .from("users")
          .update({ role })
          .or(`id.eq.${idOrDiscordId},discord_id.eq.${idOrDiscordId}`);
        if (!error) {
          updatedInSupabase = true;
        }
      } catch (e) {
        console.error("Supabase updateUserRole error:", e);
      }
    }

    const users = ensureUsersFile();
    const idx = users.findIndex((u) => u.id === idOrDiscordId || u.discordId === idOrDiscordId);
    if (idx >= 0) {
      users[idx].role = role;
      persistUsers(users);
      return true;
    }

    return updatedInSupabase;
  },

  async deleteUser(idOrDiscordId: string): Promise<boolean> {
    const supabase = getSupabase();
    let deletedInSupabase = false;

    if (supabase) {
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .or(`id.eq.${idOrDiscordId},discord_id.eq.${idOrDiscordId}`);
        if (!error) {
          deletedInSupabase = true;
        }
      } catch (e) {
        console.error("Supabase deleteUser error:", e);
      }
    }

    const users = ensureUsersFile();
    const initialLen = users.length;
    const filtered = users.filter((u) => u.id !== idOrDiscordId && u.discordId !== idOrDiscordId);
    if (filtered.length !== initialLen) {
      persistUsers(filtered);
      return true;
    }

    return deletedInSupabase;
  }
};
