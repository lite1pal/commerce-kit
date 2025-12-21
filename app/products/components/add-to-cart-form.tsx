"use client";

import { useTransition } from "react";
import { addToCart } from "@/app/actions/cart";

export default function AddToCartForm({
  variantId,
  stock,
}: {
  variantId: string;
  stock: number;
}) {
  const [pending, startTransition] = useTransition();
  const outOfStock = stock <= 0;

  return (
    <form
      action={() =>
        startTransition(async () => {
          await addToCart(variantId);
        })
      }
    >
      <button
        type="submit"
        disabled={pending || outOfStock}
        className="w-full rounded-xl px-4 py-2 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        style={{
          backgroundColor: outOfStock ? "#9ca3af" : "#000",
        }}
      >
        {pending ? "Adding..." : outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </form>
  );
}
