import { DigitalProduct } from "@/types";
import { INITIAL_REAL_PRODUCTS } from "./realProducts";

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
  active: prod.active,
  scriptContent: prod.scriptContent,
  revertScript: prod.revertScript,
}));
