"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();

  function obterTitulo() {
    // ==============================
    // GESTOR
    // ==============================

    if (pathname === "/dashboard/gestor") {
      return "Visão geral";
    }

    if (pathname === "/dashboard/gestor/ranking") {
      return "Ranking";
    }

    if (pathname === "/dashboard/gestor/risco") {
      return "Municípios em risco";
    }

    if (pathname === "/dashboard/gestor/analises") {
      return "Análises";
    }

    if (pathname === "/dashboard/gestor/tecnicos") {
      return "Técnicos";
    }

    if (pathname === "/dashboard/gestor/tecnicos/novo") {
      return "Cadastrar técnico";
    }

    if (
      pathname.startsWith("/dashboard/gestor/tecnicos/") &&
      pathname.endsWith("/editar")
    ) {
      return "Editar técnico";
    }

    // ==============================
    // TÉCNICO
    // ==============================

    if (pathname === "/dashboard/tecnico") {
      return "Visão geral";
    }

    if (pathname === "/dashboard/tecnico/analises") {
      return "Análises";
    }

    // ==============================
    // PRODUTOR
    // ==============================

    if (pathname === "/dashboard") {
      return "Visão geral";
    }

    return "Chuva & Safra";
  }

  const titulo = obterTitulo();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">
          {titulo}
        </h1>
      </div>
    </header>
  );
}