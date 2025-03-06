// hooks/useAuth.ts
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  name: string;
  username: string;
  role: string;
}

export function useAuth(allowedRole?: string) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      if (window.location.pathname !== "/login") {
        router.push("/login");
      }
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      if (allowedRole && parsedUser.role !== allowedRole) {
        if (
          parsedUser.role === "ROLE_ADMIN" &&
          window.location.pathname !== "/dashboard"
        ) {
          router.push("/dashboard");
        }
      }
    }
    setLoading(false);
  }, [router, allowedRole]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return { user, loading, logout };
}
