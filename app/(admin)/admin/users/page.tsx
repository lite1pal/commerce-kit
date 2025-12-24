import Link from "next/link";
import prisma from "@/lib/prisma";
import { toggleUserRole } from "./actions";
import { getCurrentUser } from "@/app/(storefront)/auth/actions";
import PageContainer from "../components/page-container";
import PageHeader from "../components/page-header";
import { DataTable } from "../components/ui/data-table";
import { columns } from "./columns";

export const metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      role: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    where: { id: { not: currentUser?.id } },
  });

  return (
    <PageContainer>
      <PageHeader buttonHref="/admin/users/new" buttonTitle="+ New user">
        Users
      </PageHeader>

      <DataTable columns={columns} data={users} />

      {/* <div className="mt-6 overflow-hidden rounded-xl border">
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
      </div> */}
    </PageContainer>
  );
}
