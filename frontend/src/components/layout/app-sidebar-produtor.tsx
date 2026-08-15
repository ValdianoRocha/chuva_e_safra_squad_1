"use client";

import * as React from "react";

import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LayoutDashboardIcon,
  ChartBarIcon,
  WheatIcon,
  CloudRainIcon,
} from "lucide-react";

type AppSidebarProdutorProps = React.ComponentProps<typeof Sidebar> & {
  cultura: string;
  anoInicial: string;
  anoFinal: string;

  onCulturaChange: (value: string) => void;
  onAnoInicialChange: (value: string) => void;
  onAnoFinalChange: (value: string) => void;
};

const anos = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

const data = {
  user: {
    name: "Produtor",
    email: "produtor@email.com",
    avatar: "",
  },

  navMain: [
    {
      title: "Visão geral",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Minha safra",
      url: "/dashboard/minha-safra",
      icon: <WheatIcon />,
    },
    {
      title: "Análises",
      url: "/dashboard/analises",
      icon: <ChartBarIcon />,
    },
  ],
};

export function AppSidebarProdutor({
  cultura,
  anoInicial,
  anoFinal,
  onCulturaChange,
  onAnoInicialChange,
  onAnoFinalChange,
  ...props
}: AppSidebarProdutorProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <CloudRainIcon className="size-5!" />

              <span className="text-base font-semibold">Chuva & Safra</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Navegação */}
        <NavMain items={data.navMain} />

        {/* Filtros */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Filtros</SidebarGroupLabel>

          <div className="space-y-4 px-2">
            {/* Cultura */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Cultura
              </span>

              <Select
                value={cultura}
                onValueChange={(value) => {
                  if (value) {
                    onCulturaChange(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="milho">Milho</SelectItem>

                  <SelectItem value="feijao">Feijão</SelectItem>

                  <SelectItem value="mandioca">Mandioca</SelectItem>

                  <SelectItem value="caju">Caju</SelectItem>

                  <SelectItem value="banana">Banana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Período
              </span>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={anoInicial}
                  onValueChange={(value) => {
                    if (value) {
                      onAnoInicialChange(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={anoFinal}
                  onValueChange={(value) => {
                    if (value) {
                      onAnoFinalChange(value);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano} value={ano}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Município fixo do produtor */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground">
                Município
              </span>

              <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
                Amontada
              </div>
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
