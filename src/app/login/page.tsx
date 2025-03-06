// app/login/page.tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ROLE_ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (user) return null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white">
            <ShoppingCart className="size-4" />
          </div>
          Icesmart Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
