import Link from "next/link";
import { getAttributes, createAttribute } from "./actions";

export default async function AttributesPage() {
  const attributes = await getAttributes();

  return (
    <main className="p-6 max-w-5xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Attributes</h1>
        <p className="text-sm text-gray-500">
          Manage product attributes and their values
        </p>
      </header>

      <section className="mb-8 rounded-xl border p-4 bg-gray-50">
        <h2 className="font-semibold mb-2">Create new attribute</h2>
        <form action={createAttribute} className="flex gap-2">
          <input
            name="name"
            placeholder="e.g. Color, Size"
            className="border px-3 py-2 rounded w-64"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Create
          </button>
        </form>
      </section>

      <section className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute) => (
              <tr key={attribute.id} className="border-t">
                <td className="px-4 py-3 text-gray-500">{attribute.id}</td>
                <td className="px-4 py-3 font-medium">{attribute.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(attribute.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/attributes/${attribute.id}/edit`}
                    className="inline-flex items-center rounded-md border px-3 py-1.5 hover:bg-gray-50"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}

            {attributes.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No attributes yet. Create your first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
