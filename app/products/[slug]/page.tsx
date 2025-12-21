import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartForm from "../components/add-to-cart-form";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true },
  });

  if (!product || !product.active) return notFound();

  const v = product.variants[0];

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        {product.description ? (
          <p className="text-slate-700">{product.description}</p>
        ) : null}
      </div>

      {product.images.length ? (
        <div className="grid grid-cols-2 gap-3">
          {product.images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt={img.alt ?? product.name}
              className="rounded-xl border"
            />
          ))}
        </div>
      ) : null}

      {v ? (
        <section className="rounded-2xl border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{v.name}</div>
              <div className="text-slate-600">
                {(v.priceCents / 100).toFixed(2)} €
              </div>
            </div>
            <div className="text-sm text-slate-500">Stock: {v.stock}</div>
          </div>

          <AddToCartForm variantId={v.id} />
        </section>
      ) : (
        <p className="text-slate-600">No variants available.</p>
      )}
    </main>
  );
}
