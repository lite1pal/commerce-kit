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
    <div className="rounded-2xl border p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="font-medium truncate">{title}</div>
        <div className="text-slate-600 text-sm">
          {(priceCents / 100).toFixed(2)} €
        </div>
        {atMaxStock && (
          <div className="text-xs text-amber-600 mt-1">Max stock reached</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={dec}
          disabled={pending}
          className="h-9 w-9 rounded-lg border disabled:opacity-60"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <div className="w-10 text-center">{quantity}</div>
        <button
          onClick={inc}
          disabled={pending || atMaxStock}
          className="h-9 w-9 rounded-lg border disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          +
        </button>

        <button
          onClick={remove}
          disabled={pending}
          className="ml-2 rounded-lg border px-3 py-2 text-sm disabled:opacity-60"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
