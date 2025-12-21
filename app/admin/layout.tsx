import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { adminLogout } from "./login/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const isAdmin = jar.get("admin")?.value === "1";

  if (!isAdmin) redirect("/admin/login");

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
