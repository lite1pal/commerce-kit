import { getPages, deletePage } from "./actions";
import Link from "next/link";

export default async function AdminPagesList() {
  const pages = await getPages();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="btn px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition"
        >
          + New Page
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow border divide-y">
        {pages.length === 0 ? (
          <div className="p-6 text-center text-neutral-500">
            No pages found.
          </div>
        ) : (
          pages.map((page) => (
            <div
              key={page.id}
              className="flex justify-between items-center px-6 py-4"
            >
              <div>
                <Link
                  href={`/admin/pages/${page.id}/edit`}
                  className="font-semibold text-lg text-blue-700 hover:underline"
                >
                  {page.title}
                </Link>
                <span className="ml-2 text-sm text-gray-500">/{page.slug}</span>
              </div>
              <form
                action={async () => {
                  "use server";
                  await deletePage(page.id);
                }}
              >
                <button
                  type="submit"
                  className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition"
                >
                  Delete
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
