import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { formatCentsToDollars } from "@/lib/price";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const collection = await prisma.collection.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description || undefined,
    openGraph: {
      title: collection.name,
      description: collection.description || undefined,
      type: "website",
    },
    twitter: {
      title: collection.name,
      description: collection.description || undefined,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug },
  });

  if (!collection) return notFound();

  const productsOnCollection = await prisma.productCollection.findMany({
    where: { collectionId: collection.id },
    select: {
      product: {
        include: {
          images: { take: 1 },
          variants: { orderBy: { priceCents: "asc" }, take: 1 },
        },
      },
    },
    orderBy: { assignedAt: "asc" },
  });

  const products = productsOnCollection.map((pc) => pc.product);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">{collection.name}</h1>
      {collection.description ? (
        <p className="text-slate-700 mt-2">{collection.description}</p>
      ) : null}

      {products.length === 0 ? (
        <p className="mt-6 text-slate-600">No products in this collection.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const img = p.images[0]?.url;
            const v = p.variants[0];
            const price = v?.priceCents ?? 0;
            const outOfStock = !v || v.stock <= 0;

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

                <div>
                  <div className="mb-1">{p.name}</div>
                  <div className="text-sm text-neutral-500  dark:text-neutral-200">
                    €{formatCentsToDollars(price)}
                  </div>
                  {outOfStock && (
                    <div className="text-xs text-neutral-400 mt-1">
                      Out of stock
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
