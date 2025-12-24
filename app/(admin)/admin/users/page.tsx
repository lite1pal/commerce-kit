import Link from "next/link";
import prisma from "@/lib/prisma";
import { toggleUserRole } from "./actions";
import { getCurrentUser } from "@/app/(storefront)/auth/actions";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, role: true, email: true },
    where: { id: { not: currentUser?.id } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">users</h1>
        <Link
          className="rounded-lg border px-3 py-2 text-sm"
          href="/admin/users/new"
        >
          + New user
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3 w-65">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-gray-600">{u.role}</td>
                <td className="p-3 flex gap-3">
                  <Link
                    className="underline"
                    href={`/admin/users/${u.id}/edit`}
                  >
                    Edit
                  </Link>

                  <form action={toggleUserRole.bind(null, u.id, u.role)}>
                    <button className="underline cursor-pointer" type="submit">
                      Toggle
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {users.length === 0 ? (
              <tr>
                <td className="p-3 text-gray-600" colSpan={4}>
                  No users yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
