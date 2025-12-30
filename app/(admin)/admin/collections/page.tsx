import { getCollections } from "./actions";
import PageHeader from "../components/page-header";
import PageContainer from "../components/page-container";
import { DataTable } from "../components/ui/data-table";
import { columns } from "./columns";

export const metadata = { title: "Collections" };

const limit = 10;

type CollectionsPageProps = {
  searchParams: {
    page?: string;
  };
};

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const page = parseInt(searchParams?.page ?? "1");
  const collections = await getCollections(page, limit);

  return (
    <PageContainer>
      <PageHeader>Collections</PageHeader>

      <DataTable columns={columns} data={collections} />
    </PageContainer>
  );
}
