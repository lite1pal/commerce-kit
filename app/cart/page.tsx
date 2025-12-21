import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import CartItemRow from "./components/cart-item-row";
import ClearCartButton from "./components/clear-cart-button";

export default async function CartPage() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;

  if (!cartId) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-slate-600 mt-2">Your cart is empty.</p>
      </main>
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
        include: {
          variant: { include: { product: true } },
        },
      },
    },
  });

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <p className="text-slate-600 mt-2">Your cart is empty.</p>
      </main>
    );
  }

  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.variant.priceCents,
    0
  );

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cart</h1>
        <ClearCartButton />
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <CartItemRow
            key={item.id}
            variantId={item.variantId}
            title={`${item.variant.product.name} — ${item.variant.name}`}
            priceCents={item.variant.priceCents}
            quantity={item.quantity}
          />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl border p-4">
        <div className="font-medium">Total</div>
        <div className="font-semibold">{(totalCents / 100).toFixed(2)} €</div>
      </div>

      <a
        href="/checkout"
        className="block w-full rounded-xl bg-black px-4 py-2 text-center text-white"
      >
        Continue to checkout
      </a>
    </main>
  );
}
