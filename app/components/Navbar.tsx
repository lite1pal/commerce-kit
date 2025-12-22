import { getCartItemCount } from "@/lib/cart";
import Link from "next/link";
import { getCurrentUser, logout } from "../auth/actions";

export default async function Navbar() {
  const count = await getCartItemCount();
  const user = await getCurrentUser();

  return (
    <header className="mb-8 bg-white dark:bg-neutral-900 transition-colors">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Link
          href="/"
          className="text-lg text-black dark:text-white transition-colors"
        >
          CommerceKit
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/collections"
            className="hover:opacity-60 transition-opacity text-black dark:text-white"
          >
            Collections
          </Link>
          <Link
            href="/products"
            className="hover:opacity-60 transition-opacity text-black dark:text-white"
          >
            Products
          </Link>

          <Link
            href="/cart"
            className="hover:opacity-60 transition-opacity text-black dark:text-white"
          >
            Cart {count > 0 && `(${count})`}
          </Link>

          <Link
            href="/orders"
            className="hover:opacity-60 transition-opacity text-black dark:text-white"
          >
            Orders
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin/login"
                  className="hover:underline text-sm text-neutral-700 dark:text-neutral-200"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-neutral-700 dark:text-neutral-200">
                {user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="hover:underline sm:cursor-pointer text-sm text-neutral-700 dark:text-neutral-200"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hover:underline text-sm text-neutral-700 dark:text-neutral-200"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="hover:underline text-sm text-neutral-700 dark:text-neutral-200"
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
