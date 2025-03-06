"use client";

import { DeleteProductModal } from "@/components/delete-product-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ICategory } from "@/services/categoryService";
import { Product } from "@/services/productService";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { ArrowUpDown, Pencil } from "lucide-react";

// tipo customizado para TableMeta
interface CustomTableMeta extends TableMeta<Product> {
  openEditModal: (productId: number) => void;
  categories: ICategory[];
}

interface ColumnsProps {
  refreshData: () => void;
}

export const columns = ({
  refreshData,
}: ColumnsProps): ColumnDef<Product>[] => [
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
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const imageUrl = row.getValue("imageUrl") as string;
      return (
        <div className="flex items-center">
          <img
            src={imageUrl}
            alt="Product"
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>
      );
    },
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
        Name Product
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Name Category",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => {
      const discount = parseFloat(row.getValue("discount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 0,
      }).format(discount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
      }).format(price);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "specialPrice",
    header: () => <div className="text-right">Special Price</div>,
    cell: ({ row }) => {
      const specialPrice = parseFloat(row.getValue("specialPrice"));
      const formatted = new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
      }).format(specialPrice);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const product = row.original;
      const openEditModal = (table.options.meta as CustomTableMeta)
        ?.openEditModal;

      return (
        <div className="flex items-center space-x-1">
          <DeleteProductModal
            productId={product.id}
            productName={product.name}
            onDelete={() => refreshData()}
          />
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => openEditModal?.(product.id)}
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
  openEditModal: (productId: number) => void,
  categories: ICategory[]
) => {
  return {
    columns: columns({ refreshData }),
    meta: {
      openEditModal,
      categories,
    } as CustomTableMeta,
  };
};
