import { redirect } from "next/navigation";
import Link from "next/link";
import { adminLogout } from "./login/actions";
import { getCurrentUser } from "../../(storefront)/auth/actions";

import "../../globals.css";

export const metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const isAdmin = user && user.role === "ADMIN";

  if (!isAdmin) redirect("/");

  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <html lang="en" className={isDark ? "dark" : ""}>
      <body>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/admin/products" className="font-semibold">
              Admin
            </Link>
            <form action={adminLogout}>
              <button className="text-sm underline cursor-pointer">
                Logout
              </button>
            </form>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
