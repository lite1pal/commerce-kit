import prisma from "@/lib/prisma";
import Link from "next/link";
import Search from "../../components/Search";
import { formatCentsToDollars } from "@/lib/price";
import { buildFilterUrl, parseFilters } from "@/lib/domain/products-filters";

export const metadata = {
  title: "Products",
  description: "Browse all products in the CommerceKit storefront.",
};

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ filters?: string[] }>;
}) {
  const filtersParam = (await params).filters ?? [];

  const filterMap = parseFilters(filtersParam);

  const variantFilters =
    Object.keys(filterMap).length > 0
      ? {
          variants: {
            some: {
              variantAttributeValues: {
                some: {
                  attributeValue: {
                    value: { in: Object.values(filterMap).flat() },
                    attribute: {
                      name: {
                        in: Object.keys(filterMap).map(
                          (k) => k.charAt(0).toUpperCase() + k.slice(1)
                        ),
                      },
                    },
                  },
                },
              },
            },
          },
        }
      : {};

  const attributes = await prisma.attribute.findMany({
    include: { values: true },
    orderBy: { name: "asc" },
  });

  console.log(filterMap, Object.values(filterMap).flat());

  const products = await prisma.product.findMany({
    where: {
      active: true,
      // ...variantFilters,
      variants: {
        some: {
          variantAttributeValues: {
            some: {
              attributeValue: {
                value: { in: Object.values(filterMap).flat() },
                attribute: {
                  name: {
                    in: Object.keys(filterMap).flat(),
                  },
                },
              },
            },
          },
        },
      },
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
      <Search />
      <div className="flex gap-8 mt-8">
        <aside className="w-64 shrink-0 hidden md:block">
          <div className="space-y-6">
            {attributes.map((attr) => (
              <div key={attr.id}>
                <div className="font-semibold mb-2">{attr.name}</div>
                <div className="flex flex-wrap gap-4">
                  {attr.values.map((val) => {
                    const key = attr.name.toLowerCase();
                    const selected =
                      filterMap[key]?.includes(val.value) ?? false;
                    return (
                      <Link
                        key={val.id}
                        href={buildFilterUrl(
                          key,
                          filtersParam,
                          val.value,
                          selected
                        )}
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
