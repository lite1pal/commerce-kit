import { getOrders } from "./actions";
import PageContainer from "../components/page-container";
import PageHeader from "../components/page-header";
import { DataTable } from "../components/ui/data-table";
import { columns } from "./columns";

export const metadata = { title: "Orders" };

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <PageContainer>
      <PageHeader>Orders</PageHeader>

      <DataTable columns={columns} data={orders} />
    </PageContainer>
  );
}
