import { getCartItemCount } from "@/lib/cart";
import Link from "next/link";

export default async function Navbar() {
  const count = await getCartItemCount();

  return (
    <header className="mb-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg">
          CommerceKit
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/collections"
            className="hover:opacity-60 transition-opacity"
          >
            Collections
          </Link>
          <Link
            href="/products"
            className="hover:opacity-60 transition-opacity"
          >
            Products
          </Link>

          <Link href="/cart" className="hover:opacity-60 transition-opacity">
            Cart {count > 0 && `(${count})`}
          </Link>

          <Link href="/orders" className="hover:opacity-60 transition-opacity">
            Orders
          </Link>
        </nav>
      </div>
    </header>
  );
}
