import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductReviews } from "../components/product-reviews";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const variant = (await searchParams).variant;

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

import { getCurrentUser } from "@/app/(storefront)/auth/actions";
import { ProductAttributes } from "./product-attributes";
import VariantSelector from "./variant-selector";
import AddToCartForm from "../components/add-to-cart-form";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant: string }>;
}) {
  const { slug } = await params;
  const variant = (await searchParams).variant;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: true,
      variants: {
        include: {
          variantAttributeValues: {
            include: { attributeValue: { include: { attribute: true } } },
          },
        },
      },
    },
  });
  const user = await getCurrentUser();

  if (!product || !product.active) return notFound();

  const selectedVariant =
    product.variants.find((v) => v.id === variant) || product.variants[0];

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Left: Product Image */}
        <div className="flex-1 flex items-center justify-center bg-neutral-100 rounded-xl p-6 min-h-125">
          {product.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.images[0].url}
              alt={product.images[0].alt ?? product.name}
              className="max-h-105 w-auto object-contain mx-auto"
            />
          ) : (
            <div className="w-full h-105 bg-neutral-200 flex items-center justify-center rounded">
              No image
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl mx-auto">
          <div>
            <h1 className="text-4xl font-bold mb-2 font-sans">
              {product.name}
            </h1>
            {/* Variant selector */}
            <VariantSelector
              product={product}
              selectedVariant={selectedVariant}
            />
            <div className="text-sm text-neutral-500 mb-4">
              Free shipping when you spend $90.00+ for everyone. Promotion
              auto-applied on checkout.
            </div>
            {product.description && (
              <p className="mb-4 whitespace-pre-line">{product.description}</p>
            )}
            <div className="mb-4">
              <span className="font-mono text-base">
                High Quality Cuffed Beanie
              </span>
            </div>
          </div>

          <AddToCartForm
            variantId={selectedVariant.id}
            stock={selectedVariant.stock}
          />

          {/* Product attributes */}
          <ProductAttributes productId={product.id} />

          {/* Collapsible sections (static for now) */}
          <div className="divide-y border-t border-b mt-6">
            <details className="py-4 group" open>
              <summary className="font-semibold cursor-pointer flex justify-between items-center">
                More details <span className="ml-2">+</span>
              </summary>
              <div className="mt-2 text-sm text-neutral-700 font-mono">
                High Quality Cuffed Beanie
              </div>
            </details>
            <details className="py-4 group">
              <summary className="font-semibold cursor-pointer flex justify-between items-center">
                Size &amp; Fit <span className="ml-2">-</span>
              </summary>
              <div className="mt-2 text-sm text-neutral-700 font-mono">
                • Circumference: 17 ¾" - 18 ½"
              </div>
            </details>
            <details className="py-4 group">
              <summary className="font-semibold cursor-pointer flex justify-between items-center">
                Quality Guarantee &amp; Returns <span className="ml-2">+</span>
              </summary>
              <div className="mt-2 text-sm text-neutral-700 font-mono">
                30-day return policy. Satisfaction guaranteed.
              </div>
            </details>
          </div>
        </div>
      </div>
      {/* Product reviews section */}
      <div className="mt-12">
        <ProductReviews productId={product.id} userId={user?.id} />
      </div>
    </main>
  );
}
