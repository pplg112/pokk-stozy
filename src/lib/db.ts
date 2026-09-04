import fs from "fs";
import path from "path";
import { RealProduct, INITIAL_REAL_PRODUCTS } from "@/data/realProducts";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "products.json");

// In-memory memory cache for fast lookups & Vercel serverless persistence during instance lifetime
let memoryCache: RealProduct[] | null = null;
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

export const db = {
  getProducts(activeOnly = true): RealProduct[] {
    const products = ensureDbFile();
    if (activeOnly) {
      return products.filter((p) => p.active);
    }
    return [...products];
  },

  getProductById(id: string): RealProduct | undefined {
    const products = ensureDbFile();
    return products.find((p) => p.id === id);
  },

  createProduct(data: Partial<RealProduct> & { name: string; category: RealProduct["category"] }): RealProduct {
    const products = ensureDbFile();
    const id = data.id || `pokky-${Date.now()}`;
    const newProd: RealProduct = {
      id,
      name: data.name,
      tagline: data.tagline || "สคริปต์ปรับแต่งประสิทธิภาพเกมเมอร์ระดับ Esports",
      description: data.description || "สคริปต์ปรับแต่งคอมพิวเตอร์เพื่อความเสถียรและเฟรมเรตสูงสุด",
      category: data.category,
      fileFormat: data.fileFormat || ".BAT",
      fileSize: data.fileSize || "50 KB",
      version: data.version || "v1.0.0",
      compatibility: data.compatibility || "Windows 10 / 11 (64-bit)",
      downloadsCount: data.downloadsCount || 0,
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 1,
      popular: data.popular ?? false,
      active: data.active ?? true,
      features: data.features || ["ปรับแต่งระบบอัตโนมัติ", "ปลอดภัย มีไฟล์ Revert ในตัว"],
      requirements: data.requirements || ["Windows 10 หรือ 11 (64-bit)", "สิทธิ์ Administrator"],
      includedFiles: data.includedFiles || [
        { filename: `${id}.bat`, description: "ไฟล์สคริปต์ปรับแต่งหลัก" },
        { filename: `REVERT_${id}.bat`, description: "สคริปต์กู้คืนค่ามาตรฐานเดิม" }
      ],
      scriptContent: data.scriptContent || `@echo off\ntitle ${data.name}\necho [POKKY OPTIMIZE] กำลังดำเนินการปรับแต่ง...\npause`,
      revertScript: data.revertScript || `@echo off\ntitle Revert - ${data.name}\necho คืนค่าเดิมของระบบเรียบร้อย\npause`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    products.unshift(newProd);
    persistDb(products);
    return newProd;
  },

  updateProduct(id: string, updates: Partial<RealProduct>): RealProduct | null {
    const products = ensureDbFile();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    products[idx] = {
      ...products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    persistDb(products);
    return products[idx];
  },

  deleteProduct(id: string): boolean {
    const products = ensureDbFile();
    const initialLen = products.length;
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length !== initialLen) {
      persistDb(filtered);
      return true;
    }
    return false;
  },

  incrementDownload(id: string): number {
    const products = ensureDbFile();
    const prod = products.find((p) => p.id === id);
    if (prod) {
      prod.downloadsCount = (prod.downloadsCount || 0) + 1;
      persistDb(products);
      return prod.downloadsCount;
    }
    return 0;
  },

  getStats() {
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

  saveUploadedBlob(fileId: string, filename: string, content: string) {
    fileStorage[fileId] = { filename, content };
    return fileId;
  },

  getUploadedBlob(fileId: string) {
    return fileStorage[fileId] || null;
  }
};
