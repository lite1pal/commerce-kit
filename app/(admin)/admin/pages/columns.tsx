"use client";

import { formatDateForAdminTables } from "@/lib/utils/time";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Button } from "../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@/generated/prisma/enums";
import { togglePageVisible } from "./actions";

export const columns: ColumnDef<{
  id: string;
  title: string;
  slug: string;
  visible: boolean;
  createdAt: Date;
  updatedAt: Date;
}>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "slug", header: "Slug" },

  {
    accessorKey: "visible",
    header: "Visible",
    cell: ({ row }) => {
      const isVisible = row.original.visible;

      return (
        <div className={isVisible ? "text-green-500" : "text-gray-500"}>
          {isVisible ? "Yes" : "No"}
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;

      const formattedCreatedAt = formatDateForAdminTables(createdAt);
      return <div>{formattedCreatedAt}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row }) => {
      const updatedAt = row.original.updatedAt;

      const formattedUpdatedAt = formatDateForAdminTables(updatedAt);
      return <div>{formattedUpdatedAt}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const page = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <form action={togglePageVisible.bind(null, page.id)}>
                <button type="submit">Toggle visibility</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(page.id)}
            >
              Copy page ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/admin/pages/${page.id}/edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
