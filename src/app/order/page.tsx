"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getOrders } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { columns } from "./layout/columns";
import { DataTable } from "./layout/data-table";

export default function OrderPage() {
  const {
    data: orders,
    isLoading,
    isFetching, // Adicionado para rastrear o estado de refetch
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-light text-emerald-700 border-b-2 border-emerald-500 pb-2 mb-6 shadow-sm">
            Pedidos
          </h1>
          <div className="container mx-auto py-10">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin text-emerald-700" size={32} />
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={orders ?? []}
                refetch={refetch}
                isFetching={isFetching} // Passa isFetching para o DataTable
              />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
