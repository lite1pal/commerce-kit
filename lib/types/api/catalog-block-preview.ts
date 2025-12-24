import { Product, ProductImage, Variant } from "@/generated/prisma/client";

export interface CatalogBlockPreview extends Product {
  images: ProductImage[];
  variants: Variant[];
}
