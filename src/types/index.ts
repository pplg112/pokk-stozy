export type ProductCategory = 
  | "all"
  | "bundles"
  | "os-scripts"
  | "gpu-profiles"
  | "network"
  | "memory-bios";

export interface DigitalProduct {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number; // 0 for free
  originalPrice?: number;
  isFree?: boolean;
  badge?: string;
  popular?: boolean;
  version: string;
  fileFormat: string; // e.g., ".ZIP", ".BAT", ".REG", ".POW"
  fileSize: string; // e.g., "18.4 MB", "85 KB"
  downloadsCount: number;
  rating: number; // e.g., 4.9
  reviewCount: number;
  compatibility: string; // e.g., "Windows 10 / 11 (All Builds)"
  includedFiles: {
    filename: string;
    description: string;
  }[];
  features: string[];
  requirements: string[];
  description: string;
  hasRevertScript: boolean;
  downloadUrl?: string;
  imageUrl?: string;
  active?: boolean;
  scriptContent?: string;
  revertScript?: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

export interface DownloadRecord {
  downloadId: string;
  productId: string;
  productName: string;
  version: string;
  fileFormat: string;
  fileSize: string;
  downloadDate: string;
  includedFiles: {
    filename: string;
    description: string;
  }[];
}

export interface PurchaseRecord {
  orderId: string;
  productId: string;
  productName: string;
  version: string;
  fileFormat: string;
  fileSize: string;
  price: number;
  purchaseDate: string;
  licenseKey: string;
  includedFiles: {
    filename: string;
    description: string;
  }[];
  downloadId?: string;
  downloadDate?: string;
}
