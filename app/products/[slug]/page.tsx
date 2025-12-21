import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartForm from "../components/add-to-cart-form";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;

  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || undefined,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
    },
    twitter: {
      title: product.name,
      description: product.description || undefined,
    },
  };
}

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
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        {product.description ? (
          <p className="text-slate-700">{product.description}</p>
        ) : null}
      </div>

      {product.images.length ? (
        <div className="grid grid-cols-2 gap-4">
          {product.images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt={img.alt ?? product.name}
              className="w-full"
            />
          ))}
        </div>
      ) : null}

      {product.variants.length ? (
        <section className="space-y-4">
          {product.variants.map((v) => (
            <div key={v.id} className="py-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div>{v.name}</div>
                  <div className="text-neutral-500">
                    €{(v.priceCents / 100).toFixed(2)}
                  </div>
                </div>
                <div className="text-sm text-neutral-400">{v.stock} left</div>
              </div>

              <AddToCartForm variantId={v.id} stock={v.stock} />
            </div>
          ))}
        </section>
      ) : (
        <p className="text-slate-600">No variants available.</p>
      )}
    </main>
  );
}
