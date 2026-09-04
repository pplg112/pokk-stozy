import { DigitalProduct } from "@/types";
import { INITIAL_REAL_PRODUCTS } from "./realProducts";

export const CATEGORY_DEFAULT_COVERS: Record<string, string> = {
  "bundles": "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
  "os-scripts": "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
  "gpu-profiles": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
  "network": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
  "memory-bios": "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80",
};

export const DIGITAL_PRODUCTS: DigitalProduct[] = INITIAL_REAL_PRODUCTS.map((prod) => ({
  id: prod.id,
  name: prod.name,
  tagline: prod.tagline,
  category: prod.category,
  price: 0,
  isFree: true,
  popular: prod.popular,
  version: prod.version,
  fileFormat: prod.fileFormat,
  fileSize: prod.fileSize,
  downloadsCount: prod.downloadsCount,
  rating: prod.rating,
  reviewCount: prod.reviewCount,
  compatibility: prod.compatibility,
  includedFiles: prod.includedFiles,
  features: prod.features,
  requirements: prod.requirements,
  description: prod.description,
  hasRevertScript: true,
  imageUrl: prod.imageUrl || CATEGORY_DEFAULT_COVERS[prod.category] || CATEGORY_DEFAULT_COVERS["bundles"],
  active: prod.active,
  scriptContent: prod.scriptContent,
  revertScript: prod.revertScript,
}));
