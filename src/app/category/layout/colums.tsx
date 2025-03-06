"use client";

import { DeleteCategoryModal } from "@/components/delete-category-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/services/categoryService";
import { formatDate } from "@/utils/utils";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";

// Definimos um tipo customizado para TableMeta
interface CustomTableMeta extends TableMeta<Category> {
  openEditModal: (categoryId: number) => void;
}

interface ColumnsProps {
  refreshData: () => void;
}

export const columns = ({
  refreshData,
}: ColumnsProps): ColumnDef<Category>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
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
      const category = row.original;
      const openEditModal = (table.options.meta as CustomTableMeta)
        ?.openEditModal;

      return (
        <div className="flex items-center space-x-2">
          {category.active && category.hasOrders ? (
            <Button
              variant="destructive"
              className="h-8 w-8 p-0 cursor-not-allowed opacity-50"
              disabled
              title="Esta categoria contém produtos em pedidos e não pode ser excluída"
            >
              <Trash />
            </Button>
          ) : (
            <DeleteCategoryModal
              categoryId={category.id}
              categoryName={category.name}
              onDelete={refreshData}
            />
          )}

          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => openEditModal?.(category.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// Função para adicionar meta com tipagem correta
export const getColumnsWithMeta = (
  refreshData: () => void,
  openEditModal: (categoryId: number) => void
) => {
  return {
    columns: columns({ refreshData }),
    meta: {
      openEditModal,
    } as CustomTableMeta,
  };
};
