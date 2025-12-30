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
  const { data: collections, totalCount } = await getCollections(page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <PageContainer>
      <PageHeader>Collections</PageHeader>

      <DataTable
        columns={columns}
        data={collections}
        currentPage={page}
        totalPages={totalPages}
      />
    </PageContainer>
  );
}
