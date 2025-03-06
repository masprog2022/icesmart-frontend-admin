"use client";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (user && user.role === "ROLE_ADMIN") {
    return redirect("/dashboard");
  }

  return redirect("/login");
}
