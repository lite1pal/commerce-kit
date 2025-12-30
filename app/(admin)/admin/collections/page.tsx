import { getCollections } from "./actions";
import PageHeader from "../components/page-header";
import PageContainer from "../components/page-container";
import { DataTable } from "../components/ui/data-table";
import { columns } from "./columns";

export const metadata = { title: "Collections" };

const limit = 10;

type CollectionsPageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function CollectionsPage({
  searchParams,
}: CollectionsPageProps) {
  const pageParam = (await searchParams).page;
  const page = parseInt(pageParam ?? "1");
  const { data, totalCount } = await getCollections(page, limit);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <PageContainer>
      <PageHeader>Collections</PageHeader>

      <DataTable
        key={page}
        columns={columns}
        data={data}
        totalPages={totalPages}
        currentPage={page}
      />
    </PageContainer>
  );
}
