import Link from "next/link";
import { formatCentsToDollars } from "@/lib/price";
import { CatalogProduct } from "@/lib/types/catalog-product";

export type CatalogGridProps = {
  products: CatalogProduct[];
  className?: string;
};

export default function CatalogGrid({
  products,
  className = "",
}: CatalogGridProps) {
  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {products.map((p) => {
        const img = p.images[0]?.url;
        const price = p.variants[0]?.priceCents ?? 0;
        return (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="block hover:opacity-80 transition-opacity"
          >
            <div className="aspect-square w-full overflow-hidden mb-3">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="mt-1 text-sm text-neutral-600">
                  From €{formatCentsToDollars(price)}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
