export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  images: { url: string }[];
  variants: { priceCents: number }[];
};
