"use client";

import { ProductForm } from "@/components/product-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getData();
        //const data = await response.json();
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
      const newProduct = await createProduct(selectedCategory, data);
      onProductAdded?.(newProduct);
      setIsOpen(false);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>
        <ProductForm
          onSubmit={handleSubmit}
          categories={categories}
          onCategoryChange={setSelectedCategory}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
