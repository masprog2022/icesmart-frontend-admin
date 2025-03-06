"use client";

import {
  ChartColumnStacked,
  CreditCard,
  GlobeLock,
  Home,
  Logs,
  Settings,
  ShoppingBag,
  ShoppingCart,
  SquareChartGantt,
  User,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Icesmart Inc.",
      logo: ShoppingCart,
      plan: "Icesmart@gmail.com",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Categoria",
      url: "/category",
      icon: ChartColumnStacked,
    },
    {
      title: "Produto",
      url: "/product",
      icon: SquareChartGantt,
    },
    {
      title: "Pedido",
      url: "/order",
      icon: ShoppingBag,
    },
    {
      title: "Cliente",
      url: "/customer",
      icon: User,
    },
    {
      title: "Pagamento",
      url: "/payment",
      icon: CreditCard,
    },
  ],
  projects: [
    {
      name: "Definição Geral",
      url: "/settings",
      icon: Settings,
    },
    {
      name: "Perfil",
      url: "/profile",
      icon: GlobeLock,
    },
    {
      name: "Logs",
      url: "/logs",
      icon: Logs,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{/*<NavUser user={data.user} />*/}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
