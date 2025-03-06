"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { login } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Schema de validação
const loginFormSchema = z.object({
  username: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

// Tipo esperado do retorno da função login
interface LoginResponse {
  token: string;
  name: string;
  username: string;
  role: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data.username, data.password);

      // Validação do resultado
      if (!result || typeof result !== "object" || !("token" in result)) {
        throw new Error("Por favor verifique suas credenciais.");
      }

      const { token, name, username, role } = result as LoginResponse;

      // Armazenamento no localStorage
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          username,
          role,
        })
      );

      toast({
        title: "Login bem-sucedido!",
        description: "Você foi autenticado com sucesso.",
        variant: "default",
      });

      // Redirecionamento baseado no role
      if (role === "ROLE_ADMIN") {
        router.push("/dashboard");
      } else if (role === "ROLE_CLIENT") {
        throw new Error("Não tem permissão para acessar o dashboard.");
      } else {
        throw new Error("Papel de usuário não reconhecido.");
      }
    } catch (error) {
      // Tipagem mais segura do erro
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao fazer login.";
      //  console.error("Erro no login:", error); // Log para depuração

      toast({
        title: "Erro ao fazer login",
        description: errorMessage,
        variant: "default", // Alterado para "destructive" para erros
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input id="username" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
