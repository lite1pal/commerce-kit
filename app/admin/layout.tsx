import { redirect } from "next/navigation";
import Link from "next/link";
import { adminLogout } from "./login/actions";
import { getCurrentUser } from "../auth/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  const isAdmin = user && user.role === "ADMIN";

  if (!isAdmin) redirect("/");

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/products" className="font-semibold">
          Admin
        </Link>
        <form action={adminLogout}>
          <button className="text-sm underline">Logout</button>
        </form>
      </div>
      {children}
    </div>
  );
}
