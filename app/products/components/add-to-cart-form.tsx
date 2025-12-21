"use client";

import { useTransition } from "react";

import Button from "@/app/components/Button";
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
      <Button
        type="submit"
        fullWidth
        disabled={pending || outOfStock}
        aria-disabled={pending || outOfStock}
      >
        {pending ? "Adding..." : outOfStock ? "Out of stock" : "Add to cart"}
      </Button>
    </form>
  );
}
