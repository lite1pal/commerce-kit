import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const img = p.images[0]?.url;
            const v = p.variants[0];
            const price = v?.priceCents ?? 0;
            const outOfStock = !v || v.stock <= 0;

            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="rounded-2xl border p-4 hover:shadow-sm transition"
              >
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-neutral-100">
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
                      From €{(price / 100).toFixed(2)}
                    </div>
                    {outOfStock ? (
                      <div className="mt-1 text-xs font-medium text-red-600">
                        Out of stock
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-green-700">
                        In stock
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
