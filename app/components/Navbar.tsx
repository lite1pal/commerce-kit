import { getCartItemCount } from "@/lib/cart";
import Link from "next/link";
import { getCurrentUser, logout } from "../auth/actions";

export default async function Navbar() {
  const count = await getCartItemCount();
  const user = await getCurrentUser();

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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-neutral-700">{user.email}</span>
              <form action={logout} method="POST">
                <button
                  type="submit"
                  className="hover:underline text-sm text-neutral-700"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hover:underline text-sm text-neutral-700"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="hover:underline text-sm text-neutral-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
