"use client";

import { useTransition } from "react";
import { addToCart } from "@/app/actions/cart";

export default function AddToCartForm({ variantId }: { variantId: string }) {
  const [pending, startTransition] = useTransition();

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
        disabled={pending}
        className="w-full rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add to cart"}
      </button>
    </form>
  );
}
