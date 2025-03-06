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
import { updateProduct } from "@/services/productService";
import { useState } from "react";
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
  categories: { id: number; name: string }[];
  onProductUpdated?: (product: {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
    categoryId: string;
  }) => void;
}

export function EditProductModal({
  isOpen,
  setIsOpen,
  product,
  categories,
  onProductUpdated,
}: EditProductModalProps) {
  const [loading, setLoading] = useState(false);

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
      const updatedProduct = await updateProduct(product.id, data);
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
              categories={categories}
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
