"use client";

import { useTransition } from "react";

import Button from "@/app/(storefront)/components/button";
import { clearCart } from "@/app/(storefront)/actions/cart";

export default function ClearCartButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      onClick={() => startTransition(clearCart)}
      disabled={pending}
      className="text-sm"
      variant="secondary"
    >
      {pending ? "Clearing..." : "Clear cart"}
    </Button>
  );
}
