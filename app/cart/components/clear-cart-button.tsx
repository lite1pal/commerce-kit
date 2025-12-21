"use client";

import { useTransition } from "react";
import { clearCart } from "@/app/actions/cart";

export default function ClearCartButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(clearCart)}
      disabled={pending}
      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-60"
    >
      {pending ? "Clearing..." : "Clear cart"}
    </button>
  );
}
