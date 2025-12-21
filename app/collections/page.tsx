import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">Collections</h1>

      {collections.length === 0 ? (
        <p className="mt-6 text-slate-600">No collections available.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="block hover:opacity-80 transition-opacity"
            >
              <div className="text-lg mb-1">{c.name}</div>
              {c.description ? (
                <div className="text-sm text-neutral-500">{c.description}</div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
