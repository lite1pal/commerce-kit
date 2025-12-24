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

      {/* <Table className="mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created at</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {collections.map((c) => (
            <TableRow>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.description?.slice(0, 30)}...</TableCell>
              <TableCell>{formatDateForAdminTables(c.createdAt)}</TableCell>
              <TableCell>
                <Link href={`/admin/collections/${c.id}/edit`}>Edit</Link>
              </TableCell>
            </TableRow>
          ))}

          {collections.length === 0 && (
            <TableRow>
              <TableCell colSpan={4}>No collections yet.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table> */}
    </PageContainer>
  );
}
