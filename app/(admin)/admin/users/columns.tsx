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
import { toggleUserRole } from "./actions";
import { UserRole } from "@/generated/prisma/enums";

export const columns: ColumnDef<{
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },

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
      const u = row.original;

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
              <form action={toggleUserRole.bind(null, u.id, u.role)}>
                <button type="submit">Toggle role</button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(u.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/admin/users/${u.id}/edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
