import PageContainer from "../components/page-container";
import PageHeader from "../components/page-header";
import { DataTable } from "../components/ui/data-table";
import { getPages } from "./actions";
import { columns } from "./columns";

export const metadata = { title: "Pages" };

export default async function AdminPagesList() {
  const pages = await getPages();

  return (
    <PageContainer>
      <PageHeader buttonHref="/admin/pages/new" buttonTitle="+ New page">
        Pages
      </PageHeader>

      <DataTable columns={columns} data={pages} />
    </PageContainer>
  );
}
