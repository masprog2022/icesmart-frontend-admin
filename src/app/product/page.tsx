"use client";

import { AddProductModal } from "@/components/add-product-modal";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  getData as getCategories,
  ICategory,
} from "@/services/categoryService";
import { getDataId, Product } from "@/services/productService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { getColumnsWithMeta } from "./layout/columns";
import { DataTable } from "./layout/data-table";

export default function ProductPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: () => getDataId(selectedCategoryId ?? undefined),
  });

  const { mutate: refreshProducts } = useMutation({
    mutationFn: () => getDataId(selectedCategoryId ?? undefined),
    onSuccess: (newData) => {
      queryClient.setQueryData(["products", selectedCategoryId], newData);
    },
  });

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const data = await getCategories();
      setCategories(data);
      return data;
    },
  });

  const handleOpenEditModal = (productId: number) => {
    setSelectedProductId(productId);
  };

  const handleAddProduct = (product: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
  }) => {
    console.log("Produto adicionado:", product);
    refreshProducts();
    setIsAddModalOpen(false);
  };

  const { columns } = getColumnsWithMeta(
    refreshProducts,
    handleOpenEditModal,
    categories
  );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="p-6">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4">
              <h1 className="text-2xl font-light text-emerald-700">Produto</h1>
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="mr-1 h-4 w-4" /> Adicionar Produto
              </Button>
            </div>
            <p className="text-sm text-slate-600 px-4 mt-1">
              {isLoading
                ? "Carregando..."
                : `${products?.length || 0} produtos`}
            </p>
            <div className="border-b-2 border-emerald-500 mt-2 mb-6 mx-4" />
          </div>
          <div className="container mx-auto py-10">
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="animate-spin text-emerald-700" size={32} />
              </div>
            ) : error ? (
              <p className="text-red-500">Erro ao carregar produtos.</p>
            ) : (
              <DataTable<Product, unknown>
                columns={columns}
                data={products || []}
                categoryId={selectedCategoryId ?? 0}
                onAddProduct={refreshProducts}
                onCategoryChange={setSelectedCategoryId}
                isFetching={isFetching}
              />
            )}
          </div>
          {isAddModalOpen && (
            <AddProductModal
              categoryId={selectedCategoryId ?? 0}
              isOpen={isAddModalOpen}
              setIsOpen={setIsAddModalOpen}
              onProductAdded={handleAddProduct}
            />
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
