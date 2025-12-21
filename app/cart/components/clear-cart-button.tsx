"use client";

import { useTransition } from "react";

import Button from "@/app/components/Button";
import { clearCart } from "@/app/actions/cart";

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
