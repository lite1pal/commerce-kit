import prisma from "@/lib/prisma";
import Link from "next/link";
import Search from "../../components/Search";
import CatalogGrid from "../../components/CatalogGrid";
import { buildFilterUrl, parseFilters } from "@/lib/domain/products-filters";
import { redirect } from "next/navigation";

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

  if (filtersParam.length === 0) redirect("/products");

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
                        in: Object.keys(filterMap).flat(),
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
    where: {
      values: {
        some: {
          variantAttributeValues: {
            some: {
              variant: {
                product: {
                  active: true,
                  ...variantFilters,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
    include: {
      values: {
        where: {
          variantAttributeValues: {
            some: {
              variant: {
                product: {
                  active: true,
                  ...variantFilters,
                },
              },
            },
          },
        },
        orderBy: { value: "asc" },
      },
    },
  });

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...variantFilters,
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
        <CatalogGrid products={products} />
      </div>
    </main>
  );
}
