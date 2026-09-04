import fs from "fs";
import path from "path";
import { RealProduct, INITIAL_REAL_PRODUCTS } from "@/data/realProducts";
import { Review } from "@/types";
import { getSupabase } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "products.json");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

// In-memory cache for fast lookups & serverless persistence during instance lifetime
let memoryCache: RealProduct[] | null = null;
let reviewsCache: Review[] | null = null;
const fileStorage: Record<string, { filename: string; content: string }> = {};

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

export const db = {
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
          return data as RealProduct[];
        }
      } catch (e) {
        console.error("Supabase getProducts error, using fallback:", e);
      }
    }

    const products = ensureDbFile();
    const reviews = ensureReviewsFile();

    const enriched = products.map((prod) => {
      const { rating, reviewCount } = calculateProductRating(prod.id, reviews);
      return {
        ...prod,
        rating,
        reviewCount,
      };
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
          return data as RealProduct;
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
    return {
      ...prod,
      rating,
      reviewCount,
    };
  },

  async createProduct(data: Partial<RealProduct> & { name: string; category: RealProduct["category"] }): Promise<RealProduct> {
    const id = data.id || `pokky-${Date.now()}`;
    const newProd: RealProduct = {
      id,
      name: sanitizeString(data.name),
      tagline: sanitizeString(data.tagline || "สคริปต์ปรับแต่งประสิทธิภาพเกมเมอร์ระดับ Esports"),
      description: sanitizeString(data.description || "สคริปต์ปรับแต่งคอมพิวเตอร์เพื่อความเสถียรและเฟรมเรตสูงสุด"),
      imageUrl: data.imageUrl ? sanitizeString(data.imageUrl) : undefined,
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
      features: (data.features || ["ปรับแต่งระบบอัตโนมัติ", "ปลอดภัย มีไฟล์ Revert ในตัว"]).map(sanitizeString),
      requirements: (data.requirements || ["Windows 10 หรือ 11 (64-bit)", "สิทธิ์ Administrator"]).map(sanitizeString),
      includedFiles: (data.includedFiles || [
        { filename: `${id}.bat`, description: "ไฟล์สคริปต์ปรับแต่งหลัก" },
        { filename: `REVERT_${id}.bat`, description: "สคริปต์กู้คืนค่ามาตรฐานเดิม" }
      ]).map(f => ({
        filename: sanitizeString(f.filename),
        description: sanitizeString(f.description)
      })),
      scriptContent: sanitizeCode(data.scriptContent || `@echo off\ntitle ${data.name}\necho [POKKY OPTIMIZE] กำลังดำเนินการปรับแต่ง...\npause`),
      revertScript: sanitizeCode(data.revertScript || `@echo off\ntitle Revert - ${data.name}\necho คืนค่าเดิมของระบบเรียบร้อย\npause`),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const supabase = getSupabase();
    if (supabase) {
      const { data: inserted, error } = await supabase.from("products").insert(newProd).select().single();
      if (error) {
        console.error("Supabase insert product error:", error);
        throw new Error(`ไม่สามารถบันทึกลงฐานข้อมูล Supabase ได้: ${error.message || error.details || error.code}`);
      }
      if (inserted) {
        // Also update local cache for consistency
        const products = ensureDbFile();
        products.unshift(inserted as RealProduct);
        persistDb(products);
        return inserted as RealProduct;
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
    if (sanitizedUpdates.version !== undefined) sanitizedUpdates.version = sanitizeString(sanitizedUpdates.version);
    if (sanitizedUpdates.scriptContent !== undefined) sanitizedUpdates.scriptContent = sanitizeCode(sanitizedUpdates.scriptContent);
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
      const { data: updated, error } = await supabase
        .from("products")
        .update({
          ...sanitizedUpdates,
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
        const products = ensureDbFile();
        const idx = products.findIndex((p) => p.id === id);
        if (idx !== -1) {
          products[idx] = updated as RealProduct;
          persistDb(products);
        }
        return updated as RealProduct;
      }
    }

    const products = ensureDbFile();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    products[idx] = {
      ...products[idx],
      ...sanitizedUpdates,
      updatedAt: new Date().toISOString(),
    };
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
    rating: number;
    comment: string;
    imageUrl?: string;
  }): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: data.productId,
      authorName: data.authorName.trim() || "ผู้ใช้นิรนาม",
      rating: Math.max(1, Math.min(5, Math.round(data.rating))),
      comment: data.comment.trim(),
      imageUrl: data.imageUrl || undefined,
      createdAt: new Date().toISOString(),
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
    fileStorage[fileId] = { filename, content };
    return fileId;
  },

  getUploadedBlob(fileId: string) {
    return fileStorage[fileId] || null;
  }
};
