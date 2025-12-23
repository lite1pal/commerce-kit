import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";
  const words = q ? q.split(/\s+/).filter(Boolean) : [];

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(words.length > 0 && {
        AND: words.map((word) => ({
          name: { contains: word, mode: "insensitive" },
        })),
      }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      variants: { orderBy: { priceCents: "asc" }, take: 1 },
    },
    take: 24,
  });

  return NextResponse.json({ products });
}
