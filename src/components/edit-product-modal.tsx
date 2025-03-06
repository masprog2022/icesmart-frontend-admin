import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// EditProductModal.tsx
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        {product && (
          <EditProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            categories={categories}
            onSuccess={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
