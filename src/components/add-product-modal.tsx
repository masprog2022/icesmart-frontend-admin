"use client";

import { ProductForm } from "@/components/product-form";
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
import { getData, ICategory } from "@/services/categoryService";
import { createProduct } from "@/services/productService";
import { useEffect, useState } from "react";

interface AddProductModalProps {
  categoryId: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onProductAdded?: (product: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
    categoryId: number;
  }) => void;
}

export function AddProductModal({
  categoryId,
  isOpen,
  setIsOpen,
  onProductAdded,
}: AddProductModalProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getData();
        setCategories(response);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao carregar categorias.",
          variant: "destructive",
        });
      }
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (data: {
    name: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    imageUrl: string;
  }) => {
    if (!selectedCategory) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria!",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const newProduct = await createProduct(selectedCategory, data);
      onProductAdded?.(newProduct);
      setIsOpen(false);
    } catch (error: any) {
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-6 max-w-xl w-full">
        <DialogHeader>
          <DialogTitle className="text-[22px]">Novo Produto</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-4 mt-1">
          <ProductForm
            onSubmit={handleSubmit}
            categories={categories}
            onCategoryChange={setSelectedCategory}
            onSuccess={() => setIsOpen(false)}
          />
        </div>
        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button
            className="h-10 w-32"
            onClick={() => document.querySelector("form")?.requestSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar"}
          </Button>
          <Button
            variant="secondary"
            className="h-10 w-32"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
