import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Search from "@/components/Search";
import { buildFilterUrl } from "@/lib/domain/products-filters";
import CatalogGrid from "@/components/CatalogGrid";

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
    where: {
      values: {
        some: { variantAttributeValues: { some: {} } },
      },
    },
    include: {
      values: {
        where: { variantAttributeValues: { some: {} } },
        orderBy: { value: "asc" },
      },
    },
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
                  {attr.values.map((val) => {
                    const key = attr.name.toLowerCase();
                    const selected = false;
                    return (
                      <Link
                        key={val.id}
                        href={buildFilterUrl(key, [], val.value, selected)}
                        className={`flex items-center gap-1 text-sm ${
                          selected ? "font-bold underline" : ""
                        }`}
                        prefetch={false}
                      >
                        <input type="checkbox" checked={selected} readOnly />{" "}
                        {val.value}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <CatalogGrid products={products} />
      </div>
    </main>
  );
}
