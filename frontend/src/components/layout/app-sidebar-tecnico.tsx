"use client";

import * as React from "react";

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

import { Checkbox } from "@/components/ui/checkbox";

import { ChartBarIcon, CloudRainIcon, LayoutDashboardIcon } from "lucide-react";

type Municipio = {
  nome: string;
  codigo: string;
};

type AppSidebarTecnicoProps = React.ComponentProps<typeof Sidebar> & {
  cultura: string;
  anoInicial: string;
  anoFinal: string;
  municipiosSelecionados: string[];

  onCulturaChange: (value: string) => void;
  onAnoInicialChange: (value: string) => void;
  onAnoFinalChange: (value: string) => void;
  onMunicipiosChange: (municipios: string[]) => void;
};

const anos = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

const municipios: Municipio[] = [
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
];

export function AppSidebarTecnico({
  cultura,
  anoInicial,
  anoFinal,
  municipiosSelecionados,
  onCulturaChange,
  onAnoInicialChange,
  onAnoFinalChange,
  onMunicipiosChange,
  ...props
}: AppSidebarTecnicoProps) {
  function alterarMunicipio(codigo: string, selecionado: boolean) {
    if (selecionado) {
      if (!municipiosSelecionados.includes(codigo)) {
        onMunicipiosChange([...municipiosSelecionados, codigo]);
      }

      return;
    }

    onMunicipiosChange(
      municipiosSelecionados.filter((municipio) => municipio !== codigo),
    );
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* =========================
          CABEÇALHO
      ========================== */}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<a href="/dashboard/tecnico" />}>
              <CloudRainIcon className="size-5" />

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
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/dashboard/tecnico" />}>
                <LayoutDashboardIcon />

                <span>Visão geral</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href="/dashboard/tecnico/analises" />}
              >
                <ChartBarIcon />

                <span>Análises</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* =========================
            FILTROS
        ========================== */}

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
          </div>
        </SidebarGroup>

        {/* =========================
            MUNICÍPIOS DO TÉCNICO
        ========================== */}

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Municípios</SidebarGroupLabel>

          <div className="space-y-3 px-2">
            {municipios.map((municipio) => {
              const selecionado = municipiosSelecionados.includes(
                municipio.codigo,
              );

              return (
                <label
                  key={municipio.codigo}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={selecionado}
                    onCheckedChange={(checked) =>
                      alterarMunicipio(municipio.codigo, checked === true)
                    }
                  />

                  <span>{municipio.nome}</span>
                </label>
              );
            })}
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* =========================
          USUÁRIO
      ========================== */}

      <SidebarFooter>
        <div className="px-2 py-2 text-sm">
          <p className="font-medium">Técnico</p>

          <p className="text-xs text-muted-foreground">tecnico@email.com</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
