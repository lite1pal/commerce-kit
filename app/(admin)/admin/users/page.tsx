import prisma from "@/lib/prisma";
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
    </PageContainer>
  );
}
