import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

export async function POST(req: Request) {
  const { query, attributeFilters } = await req.json();
  const words = query ? query.split(/\s+/).filter(Boolean) : [];
  const variantFilters = buildVariantFilters(attributeFilters);

  const products = await prisma.product.findMany({
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
    include: {
      images: { take: 1 },
      variants: { orderBy: { priceCents: "asc" }, take: 1 },
    },
    take: 12,
  });

  return NextResponse.json({ products });
}
