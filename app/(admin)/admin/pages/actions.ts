"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPages() {
  return prisma.page.findMany({
    orderBy: { createdAt: "desc" },
    omit: {
      content: true,
    },
  });
}

export async function getPage(id: string) {
  return prisma.page.findUnique({ where: { id } });
}

export async function createPage(data: {
  slug: string;
  title: string;
  content: any;
}) {
  return prisma.page.create({
    data: { ...data, content: JSON.stringify(data.content) },
  });
}

export async function updatePage(
  id: string,
  data: { title?: string; content?: any; slug?: string }
) {
  return prisma.page.update({
    where: { id },
    data: {
      ...data,
      ...(data.content && { content: JSON.stringify(data.content) }),
    },
  });
}

export async function deletePage(id: string) {
  await prisma.page.delete({ where: { id } });

  revalidatePath("/admin/pages");
}

export async function togglePageVisible(pageId: string) {
  const p = await prisma.page.findUnique({ where: { id: pageId } });
  if (!p) return;

  await prisma.page.update({
    where: { id: pageId },
    data: { visible: !p.visible },
  });

  revalidatePath("/admin/pages");
}
