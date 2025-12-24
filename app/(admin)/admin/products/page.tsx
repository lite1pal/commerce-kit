import Link from "next/link";
import { deleteProduct, toggleProductActive } from "./actions";
import prisma from "@/lib/prisma";
import PageHeader from "../components/page-header";
import PageContainer from "../components/page-container";
import { DataTable } from "../components/ui/data-table";
import { columns } from "./columns";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <PageContainer>
      <PageHeader buttonHref="/admin/products/new" buttonTitle="New product">
        Products
      </PageHeader>

      <DataTable columns={columns} data={products} />
    </PageContainer>
  );
}
