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
        className="w-full px-4 py-3 text-sm transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          backgroundColor: outOfStock ? "#d1d5db" : "#000",
          color: "#fff",
        }}
      >
        {pending ? "Adding..." : outOfStock ? "Out of stock" : "Add to cart"}
      </button>
    </form>
  );
}
