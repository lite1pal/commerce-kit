import Button from "@/app/components/Button";
import { createOrder } from "@/app/actions/checkout";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getCurrentUser } from "../auth/actions";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage() {
  const jar = await cookies();
  const cartId = jar.get("cartId")?.value;

  const user = await getCurrentUser();

  const userEmail = user?.email;

  const cart = cartId
    ? await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: { include: { variant: { include: { product: true } } } },
        },
      })
    : null;

  const items = cart?.items ?? [];
  const totalCents = items.reduce(
    (sum, item) => sum + item.quantity * item.variant.priceCents,
    0
  );

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      {user && (
        <div className="mb-2 text-sm text-neutral-700">
          Logged in as <span className="font-medium">{user.email}</span>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-slate-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="border-t pt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm">
                <div className="min-w-0 truncate">
                  {item.variant.product.name} — {item.variant.name} ×{" "}
                  {item.quantity}
                </div>
                <div className="shrink-0 text-neutral-500  dark:text-neutral-200">
                  €
                  {((item.variant.priceCents * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-between border-t pt-3">
              <div>Total</div>
              <div>€{(totalCents / 100).toFixed(2)}</div>
            </div>
          </div>

          <CheckoutForm userEmail={userEmail} />
        </>
      )}
    </main>
  );
}
