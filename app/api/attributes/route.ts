import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const attributes = await prisma.attribute.findMany({
    include: { values: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ attributes });
}
