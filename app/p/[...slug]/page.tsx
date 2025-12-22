import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PageRenderer from "./page-renderer";

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const slugParam = (await params).slug;
  const slug = slugParam?.join("/") || "home";
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page || !page.visible) return notFound();

  let blocks = [];
  try {
    blocks =
      typeof page.content === "string"
        ? JSON.parse(page.content)
        : page.content;
  } catch {
    blocks = [];
  }
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <PageRenderer content={blocks} />
    </main>
  );
}
