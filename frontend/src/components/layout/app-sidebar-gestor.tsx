"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

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

import { NavUser } from "@/components/layout/nav-user";

import { MunicipioMultiSelect } from "@/components/dashboard/shared/municipio-multi-select";

import {
  LayoutDashboardIcon,
  ChartBarIcon,
  TrophyIcon,
  TriangleAlertIcon,
  CloudRainIcon,
  UsersIcon,
} from "lucide-react";

type AppSidebarGestorProps = React.ComponentProps<typeof Sidebar> & {
  anoInicial: string;
  anoFinal: string;
  municipiosSelecionados: string[];

  onAnoInicialChange: (value: string) => void;
  onAnoFinalChange: (value: string) => void;
  onMunicipiosChange: (value: string[]) => void;
};

const anos = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

const municipios = [
  {
    nome: "Amontada",
    codigo: "2300101",
  },
  {
    nome: "Itapipoca",
    codigo: "2306256",
  },
  {
    nome: "Trairi",
    codigo: "2313500",
  },
  {
    nome: "Parambu",
    codigo: "2310308",
  },
  {
    nome: "Aiuaba",
    codigo: "2300408",
  },
];

const data = {
  user: {
    name: "Gestor",
    email: "gestor@email.com",
    avatar: "",
  },
};

export function AppSidebarGestor({
  anoInicial,
  anoFinal,
  municipiosSelecionados,
  onAnoInicialChange,
  onAnoFinalChange,
  onMunicipiosChange,
  ...props
}: AppSidebarGestorProps) {
  const pathname = usePathname();

  const estaEmTecnicos = pathname.startsWith("/dashboard/gestor/tecnicos");

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard/gestor" />}
            >
              <CloudRainIcon className="size-5!" />

              <span className="text-base font-semibold">Chuva & Safra</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* =========================
            NAVEGAÇÃO
        ========================== */}

        <SidebarGroup>
          <SidebarMenu>
            {/* Visão geral */}
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/dashboard/gestor" />}>
                <LayoutDashboardIcon />

                <span>Visão geral</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Ranking */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/dashboard/gestor/ranking" />}
              >
                <TrophyIcon />

                <span>Ranking</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Municípios em risco */}
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/dashboard/gestor/risco" />}>
                <TriangleAlertIcon />

                <span>Municípios em risco</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Análises */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/dashboard/gestor/analises" />}
              >
                <ChartBarIcon />

                <span>Análises</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Técnicos */}
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/dashboard/gestor/tecnicos" />}
              >
                <UsersIcon />

                <span>Técnicos</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* =========================
            FILTROS
            Não aparecem em Técnicos
        ========================== */}

        {!estaEmTecnicos && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Filtros</SidebarGroupLabel>

            <div className="space-y-4 px-2">
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

              {/* Municípios */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Municípios
                </span>

                <MunicipioMultiSelect
                  municipios={municipios}
                  selecionados={municipiosSelecionados}
                  onChange={onMunicipiosChange}
                />
              </div>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* =========================
          USUÁRIO
      ========================== */}

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
