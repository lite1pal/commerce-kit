import { getCollections } from "./actions";
import PageHeader from "../components/page-header";
import PageContainer from "../components/page-container";
import { DataTable } from "../components/ui/data-table";
import { columns } from "./columns";

export const metadata = { title: "Collections" };

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <PageContainer>
      <PageHeader>Collections</PageHeader>

      <DataTable columns={columns} data={collections} />
    </PageContainer>
  );
}
