import Link from "next/link";
import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New product</h1>
        <Link className="underline" href="/admin/products">
          Back
        </Link>
      </div>

      <form action={createProduct} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Name</label>
          <input
            name="name"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm">Slug (optional)</label>
          <input
            name="slug"
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
          <p className="mt-1 text-xs text-gray-600">
            Leave empty to auto-generate from name.
          </p>
        </div>

        <div>
          <label className="text-sm">Description</label>
          <textarea
            name="description"
            rows={5}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked />
          Active
        </label>

        <button className="rounded-lg border px-4 py-2 text-sm">Create</button>
      </form>
    </div>
  );
}
