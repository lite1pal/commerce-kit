"use client";

import { useTransition } from "react";

import Button from "@/app/components/Button";
import { removeFromCart, setCartItemQuantity } from "@/app/actions/cart";

export default function CartItemRow({
  variantId,
  title,
  priceCents,
  quantity,
  stock,
}: {
  variantId: string;
  title: string;
  priceCents: number;
  quantity: number;
  stock: number;
}) {
  const [pending, startTransition] = useTransition();
  const atMaxStock = quantity >= stock;

  const dec = () =>
    startTransition(async () => {
      await setCartItemQuantity(variantId, quantity - 1);
    });

  const inc = () =>
    startTransition(async () => {
      await setCartItemQuantity(variantId, quantity + 1);
    });

  const remove = () =>
    startTransition(async () => {
      await removeFromCart(variantId);
    });

  return (
    <div className="py-4 border-t flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="truncate">{title}</div>
        <div className="text-sm text-neutral-500 dark:text-neutral-200">
          €{(priceCents / 100).toFixed(2)}
        </div>
        {atMaxStock && (
          <div className="text-xs text-neutral-400 mt-1">Max stock</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={dec}
          disabled={pending}
          aria-label="Decrease quantity"
          className="w-8 h-8 flex items-center justify-center p-0"
          variant="secondary"
        >
          −
        </Button>
        <div className="w-8 text-center">{quantity}</div>
        <Button
          onClick={inc}
          disabled={pending || atMaxStock}
          aria-label="Increase quantity"
          className="w-8 h-8 flex items-center justify-center p-0"
          variant="secondary"
        >
          +
        </Button>

        <Button
          onClick={remove}
          disabled={pending}
          className="ml-2 text-sm"
          variant="secondary"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
