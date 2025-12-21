"use client";

import { useTransition } from "react";
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
        <div className="text-sm text-neutral-500">
          €{(priceCents / 100).toFixed(2)}
        </div>
        {atMaxStock && (
          <div className="text-xs text-neutral-400 mt-1">Max stock</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={dec}
          disabled={pending}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-40 hover:opacity-60 transition-opacity"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <div className="w-8 text-center">{quantity}</div>
        <button
          onClick={inc}
          disabled={pending || atMaxStock}
          className="w-8 h-8 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-60 transition-opacity"
          aria-label="Increase quantity"
        >
          +
        </button>

        <button
          onClick={remove}
          disabled={pending}
          className="ml-2 text-sm text-neutral-500 hover:text-black transition-colors disabled:opacity-40"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
