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
import { OrderStatus } from "@/generated/prisma/enums";

export const columns: ColumnDef<{
  id: string;
  email: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "status", header: "Status" },

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
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/admin/orders/${order.id}/edit`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
