import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CatalogProduct } from "@/lib/types/catalog-product";

function buildVariantFilters(attributeFilters: Record<string, string[]>) {
  if (!attributeFilters || Object.keys(attributeFilters).length === 0)
    return {};
  return {
    variants: {
      some: {
        variantAttributeValues: {
          some: {
            attributeValue: {
              value: { in: Object.values(attributeFilters).flat() },
              attribute: {
                name: { in: Object.keys(attributeFilters).flat() },
              },
            },
          },
        },
      },
    },
  };
}

export async function POST(req: NextRequest) {
  const { query, attributeFilters } = await req.json();
  const words = query ? query.split(/\s+/).filter(Boolean) : [];
  const variantFilters = buildVariantFilters(attributeFilters);

  const products: CatalogProduct[] = await prisma.product.findMany({
    where: {
      active: true,
      ...variantFilters,
      ...(words.length > 0 && {
        AND: words.map((word: string) => ({
          name: { contains: word, mode: "insensitive" },
        })),
      }),
    },
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      slug: true,
      name: true,
      images: { select: { url: true }, take: 1 },
      variants: {
        select: { priceCents: true },
        orderBy: { priceCents: "asc" },
        take: 1,
      },
    },
  });

  return NextResponse.json(products);
}
