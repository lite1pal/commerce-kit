import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      images: { take: 1 },
      variants: { orderBy: { priceCents: "asc" }, take: 1 },
    },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">Products</h1>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const img = p.images[0]?.url;
          const price = p.variants[0]?.priceCents ?? 0;

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
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
