import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { createCategory } from "@/services/categoryService";
import { CategoryForm } from "./category-form";

interface AddCategoryModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCategoryAdded?: (category: { name: string; description: string }) => void;
}

export function AddCategoryModal({
  isOpen,
  setIsOpen,
  onCategoryAdded,
}: AddCategoryModalProps) {
  const handleSubmit = async (data: { name: string; description: string }) => {
    try {
      const newCategory = await createCategory(data);

      onCategoryAdded?.(newCategory);
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Categoria</DialogTitle>
        </DialogHeader>
        <CategoryForm
          onSubmit={handleSubmit}
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
