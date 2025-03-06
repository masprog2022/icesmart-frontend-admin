"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/services/orderService";
import { formatDate } from "@/utils/utils";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";

// Definimos um tipo customizado para o TableMeta
interface CustomTableMeta extends TableMeta<Order> {
  openModal: (orderId: number) => void;
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "orderId",
    header: "Order Id",
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return rowA.original.orderId - rowB.original.orderId;
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Client
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "clientTelephone",
    header: "Telephone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "status",
    header: "Order Status",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-500 text-white",
        SHIPPED: "bg-blue-500 text-white",
        DELIVERED: "bg-green-500 text-white",
        CANCELLED: "bg-red-500 text-white",
      };
      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            statusColors[status] || "bg-gray-500 text-white"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "payStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const payStatus: string = row.getValue("payStatus");
      const statusColors: Record<string, string> = {
        UNPAID: "bg-red-500 text-white",
        PAID: "bg-green-500 text-white",
      };
      return (
        <span
          className={`px-2 py-1 rounded-md text-sm font-medium ${
            statusColors[payStatus] || "bg-gray-500 text-white"
          }`}
        >
          {payStatus}
        </span>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: ({ row }) => {
      const totalPrice = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
      }).format(totalPrice);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return formatDate(createdAt);
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const order = row.original;
      // Tipamos o meta como CustomTableMeta
      const openModal = (table.options.meta as CustomTableMeta)?.openModal;

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => openModal?.(order.orderId)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// Função para adicionar meta com tipagem correta
export const getColumnsWithMeta = (openModal: (orderId: number) => void) => {
  return {
    columns,
    meta: {
      openModal,
    } as CustomTableMeta,
  };
};
