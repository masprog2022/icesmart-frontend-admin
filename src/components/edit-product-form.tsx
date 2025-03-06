"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  quantity: z.coerce.number().min(0, "A quantidade não pode ser negativa"),
  price: z.coerce.number().min(0.01, "O preço deve ser maior que 0"),
  discount: z.coerce.number().min(0, "O desconto não pode ser negativo"),
  imageUrl: z.string().url("A URL da imagem deve ser válida"),
  categoryId: z.string().min(1, "A categoria é obrigatória"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface EditProductFormProps {
  initialValues: ProductFormValues;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  categories: { id: number; name: string }[];
  onSuccess?: () => void;
}

// EditProductForm.tsx
export function EditProductForm({
  initialValues,
  onSubmit,
  categories,
  onSuccess,
}: EditProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    console.log("Initial Values:", initialValues);
    form.reset(initialValues);
  }, [initialValues, form]);

  const handleSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: "Atualizado!",
        description: "Produto atualizado com sucesso.",
        variant: "default",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Erro desconhecido.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {[
          "name",
          "description",
          "quantity",
          "price",
          "discount",
          "imageUrl",
        ].map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName as keyof ProductFormValues}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={
                      fieldName === "quantity" ||
                      fieldName === "price" ||
                      fieldName === "discount"
                        ? "number"
                        : "text"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
