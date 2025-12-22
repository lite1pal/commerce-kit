import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Search from "../components/Search";
import { formatCentsToDollars } from "@/lib/price";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products in the CommerceKit storefront.",

  alternates: {
    canonical: `${process.env.APP_URL}/products`,
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const query = (await searchParams)?.q?.trim();
  if (query === "") redirect("/products");

  // Split query into words and search for products containing all words
  const words = query ? query.split(/\s+/).filter(Boolean) : [];

  const attributes = await prisma.attribute.findMany({
    include: { values: true },
    orderBy: { name: "asc" },
  });

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(words.length > 0 && {
        AND: words.map((word) => ({
          name: {
            contains: word,
            mode: "insensitive",
          },
        })),
      }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      variants: { orderBy: { priceCents: "asc" }, take: 1 },
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">Products</h1>
      <Search query={query} />
      <div className="flex gap-8 mt-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="space-y-6">
            {attributes.map((attr) => (
              <div key={attr.id}>
                <div className="font-semibold mb-2">{attr.name}</div>
                <div className="flex flex-wrap gap-4">
                  {attr.values.map((val) => (
                    <label
                      key={val.id}
                      className="flex items-center gap-1 text-sm"
                    >
                      <input type="checkbox" /> {val.value}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {" "}
          {/* Filters sidebar */}
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
      </div>
    </main>
  );
}
