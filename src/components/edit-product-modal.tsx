"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { getData, ICategory } from "@/services/categoryService"; // Importar getData
import { updateProduct } from "@/services/productService";
import { useEffect, useState } from "react";
import { EditProductForm } from "./edit-product-form";

interface EditProductModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  product: {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
    categoryId: string;
  } | null;
  categories: { id: number; name: string }[]; // Mantido como fallback
  onProductUpdated?: (product: {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
    categoryId: number;
  }) => void;
}

export function EditProductModal({
  isOpen,
  setIsOpen,
  product,
  categories: propCategories, // Renomeado para evitar conflito
  onProductUpdated,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchedCategories, setFetchedCategories] = useState<ICategory[]>([]);

  // Busca as categorias ao abrir o modal, se necessário
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getData();
        setFetchedCategories(response);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar categorias.",
          variant: "destructive",
        });
      }
    }

    if (isOpen && propCategories.length === 0) {
      fetchCategories(); // Busca apenas se propCategories estiver vazio
    }
  }, [isOpen, propCategories]);

  // Usa propCategories se disponível, senão fetchedCategories
  const effectiveCategories =
    propCategories.length > 0 ? propCategories : fetchedCategories;

  const handleSubmit = async (data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
    categoryId: string;
  }) => {
    if (!product || !product.id) {
      toast({
        title: "Erro",
        description: "Produto inválido. Não é possível editar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const updatedData = {
        ...data,
        categoryId: Number(data.categoryId),
      };
      const updatedProduct = await updateProduct(product.id, updatedData);
      onProductUpdated?.(updatedProduct);
      setIsOpen(false);
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso!",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar o produto",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-6 max-w-xl w-full">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Editar Produto</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-4 mt-1">
          {product && (
            <EditProductForm
              initialValues={product}
              onSubmit={handleSubmit}
              categories={effectiveCategories} // Usa categorias efetivas
              onSuccess={() => setIsOpen(false)}
            />
          )}
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button
            variant="secondary"
            className="h-10 w-32"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="h-10 w-32"
            onClick={() => document.querySelector("form")?.requestSubmit()}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
