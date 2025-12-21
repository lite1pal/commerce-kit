import { getCartItemCount } from "@/lib/cart";
import Link from "next/link";

export default async function Navbar() {
  const count = await getCartItemCount();

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold">
          CommerceKit
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="hover:underline">
            Products
          </Link>

          <Link href="/cart" className="hover:underline">
            Cart {count > 0 && `(${count})`}
          </Link>

          <Link href="/orders" className="hover:underline">
            Orders
          </Link>
        </nav>
      </div>
    </header>
  );
}
