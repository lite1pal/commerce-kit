"use client";

import { useTransition } from "react";
import { clearCart } from "@/app/actions/cart";

export default function ClearCartButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(clearCart)}
      disabled={pending}
      className="text-sm text-neutral-500 hover:text-black transition-colors disabled:opacity-40"
    >
      {pending ? "Clearing..." : "Clear cart"}
    </button>
  );
}
