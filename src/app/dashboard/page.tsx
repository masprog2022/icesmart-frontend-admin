"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { DashboardStats, fetchStats } from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingBag, SquareChartGantt, Users } from "lucide-react";
import { MyBarChart } from "./layout/@bar_chart/page";
import { PieGraph } from "./layout/@pie_chart/page";

export default function Page() {
  const { user, loading: authLoading } = useAuth("ROLE_ADMIN");

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: fetchStats,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    enabled: !!user, // Só busca se o usuário estiver autenticado
  });

  // Adiciona log para depuração
  console.log(
    "Dashboard - authLoading:",
    authLoading,
    "user:",
    user,
    "isLoading:",
    isLoading,
    "error:",
    error
  );

  if (authLoading) return <div>Carregando autenticação...</div>;
  if (!user) return null; // Usuário não autenticado ou sem permissão
  if (isLoading) return <div>Carregando estatísticas...</div>;
  if (error) {
    toast({
      title: "Erro ao carregar estatísticas",
      description:
        error instanceof Error
          ? error.message
          : "Não foi possível buscar os dados do dashboard.",
      variant: "destructive",
    });
    return <div className="text-red-500">Erro ao carregar estatísticas.</div>;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col space-y-2 p-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-2xl font-light tracking-tight p-4">
              Oi, Bem-vindo de Volta 👋
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalSales.toFixed(2)} AOA
                </div>
                <p className="text-xs text-muted-foreground">
                  Valor Total das Vendas 💰
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <SquareChartGantt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.productCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total de produtos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.orderCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total de pedidos solicitados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.customerCount}</div>
                <p className="text-xs text-muted-foreground">
                  Total de clientes registrados
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 min-h-[100vh] flex-1 md:min-h-min">
            <div className="flex-1 rounded-xl">
              <MyBarChart />
            </div>
            <div className="flex-1 rounded-xl">
              <PieGraph />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
