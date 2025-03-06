import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { updateCategory } from "@/services/categoryService";
import { useState } from "react";
import { CategoryForm } from "./edit-category-form";

interface EditCategoryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  category: { id: number; name: string; description: string } | null;
  onCategoryUpdated?: (category: {
    id: number;
    name: string;
    description: string;
  }) => void;
}

export function EditCategoryModal({
  isOpen,
  setIsOpen,
  category,
  onCategoryUpdated,
}: EditCategoryModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { name: string; description: string }) => {
    if (!category || !category.id) {
      toast({
        title: "Erro",
        description: "Categoria inválida. Não é possível editar.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const updatedCategory = await updateCategory(category.id, data);
      onCategoryUpdated?.(updatedCategory);
      setIsOpen(false);
      toast({
        title: "Sucesso",
        description: "Categoria atualizada com sucesso!",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar a categoria",
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
          <DialogTitle>Editar Categoria</DialogTitle>
        </DialogHeader>
        {category && (
          <CategoryForm
            initialValues={category}
            onSubmit={handleSubmit}
            onSuccess={() => setIsOpen(false)}
            isSubmitting={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
