"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { getData } from "@/services/categoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { getColumnsWithMeta } from "./layout/colums"; // Ajuste o nome do arquivo se necessário
import { DataTable } from "./layout/data-table";

export default function CategoryPage() {
  const { user, loading: authLoading } = useAuth("ROLE_ADMIN");
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getData,
    enabled: !!user,
  });

  const { mutate: refreshCategories } = useMutation({
    mutationFn: getData,
    onSuccess: (newData) => {
      queryClient.setQueryData(["categories"], newData);
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar categorias",
        description: "Não foi possível atualizar as categorias.",
        variant: "destructive",
      });
    },
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const handleOpenEditModal = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
  };

  const { columns } = getColumnsWithMeta(
    refreshCategories,
    handleOpenEditModal
  );

  if (authLoading || !user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-6">
          <h1 className="text-2xl font-light text-emerald-700 border-b-2 border-emerald-500 pb-2 mb-6 shadow-sm">
            Categoria
          </h1>
          <div className="container mx-auto py-10">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin text-emerald-700" size={32} />
              </div>
            ) : error ? (
              <p className="text-red-500">Erro ao carregar categorias.</p>
            ) : (
              <DataTable
                columns={columns}
                data={categories || []}
                onAddCategory={refreshCategories}
              />
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
