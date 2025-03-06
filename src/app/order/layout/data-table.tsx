"use client";

import { OrderDetailsModal } from "@/components/OrderDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/services/orderService";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  TableMeta,
  useReactTable,
} from "@tanstack/react-table";
import { Download, RotateCw } from "lucide-react";
import { useState } from "react";

// Definimos o tipo customizado para TableMeta
interface CustomTableMeta extends TableMeta<Order> {
  openModal: (orderId: number) => void;
}

interface DataTableProps {
  columns: ColumnDef<Order>[];
  data: Order[];
  refetch: () => void;
  isFetching?: boolean; // Estado de carregamento do refetch
}

export function DataTable({
  columns,
  data,
  refetch,
  isFetching = false,
}: DataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const table = useReactTable<Order>({
    data,
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
    meta: {
      openModal: (orderId: number) => setSelectedOrderId(orderId),
    } as CustomTableMeta,
  });

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Cliente,Total,Status"]
        .concat(
          data.map(
            (order) =>
              `${order.orderId},${order.clientName},${order.totalPrice},${order.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pedidos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar pelo cliente..."
          value={
            (table.getColumn("clientName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("clientName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="default"
            onClick={refetch}
            disabled={isFetching} // Desabilita enquanto está carregando
          >
            <RotateCw
              className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} // Animação durante o carregamento
            />
            {isFetching ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="default" onClick={handleExport}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum pedido encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Exibindo {pagination.pageIndex * pagination.pageSize + 1} -{" "}
          {Math.min(
            (pagination.pageIndex + 1) * pagination.pageSize,
            data.length
          )}{" "}
          de {data.length} registros
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm">Linhas por página:</label>
          <select
            value={pagination.pageSize}
            onChange={(e) =>
              setPagination({ ...pagination, pageSize: Number(e.target.value) })
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>

      {selectedOrderId !== null && (
        <OrderDetailsModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          isOpen={true}
        />
      )}
    </div>
  );
}
