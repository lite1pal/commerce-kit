import { getPages, deletePage } from "./actions";
import Link from "next/link";

export default async function AdminPagesList() {
  const pages = await getPages();

  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Pages</h1>
      <Link href="/admin/pages/new" className="btn mb-4">
        + New Page
      </Link>
      <ul>
        {pages.map((page) => (
          <li key={page.id} className="mb-2 flex justify-between items-center">
            <span>
              <Link
                href={`/admin/pages/${page.id}/edit`}
                className="font-semibold"
              >
                {page.title}
              </Link>
              <span className="ml-2 text-sm text-gray-500">/{page.slug}</span>
            </span>
            <form
              action={async () => {
                "use server";
                await deletePage(page.id);
              }}
            >
              <button type="submit" className="text-red-600">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
