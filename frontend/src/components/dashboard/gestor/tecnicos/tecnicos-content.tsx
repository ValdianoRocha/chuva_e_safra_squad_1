"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { SiteHeader } from "@/components/layout/site-header";

import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  excluirTecnico as excluirTecnicoService,
  listarTecnicos,
  type Tecnico,
} from "@/services/tecnico.service";

import { PlusIcon, UsersIcon, PencilIcon, Trash2Icon } from "lucide-react";

// ==============================
// NOMES DOS MUNICÍPIOS
// ==============================

const MUNICIPIOS: Record<string, string> = {
  "2300101": "Amontada",
  "2306256": "Itapipoca",
  "2313500": "Trairi",
  "2310308": "Parambu",
  "2300408": "Aiuaba",
};

export function TecnicosContent() {
  const [anoInicial, setAnoInicial] = useState("2015");
  const [anoFinal, setAnoFinal] = useState("2022");

  const [municipiosSelecionados, setMunicipiosSelecionados] = useState<
    string[]
  >([]);

  // ==============================
  // TÉCNICOS
  // ==============================

  const [tecnicos, setTecnicos] = useState<Tecnico[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  // ==============================
  // CARREGAR TÉCNICOS
  // ==============================

  const carregarTecnicos = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const resultado = await listarTecnicos();

      setTecnicos(resultado);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível carregar os técnicos.");
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  // ==============================
  // CARREGAR AO ABRIR A PÁGINA
  // ==============================

  useEffect(() => {
    carregarTecnicos();
  }, [carregarTecnicos]);

  // ==============================
  // EXCLUIR TÉCNICO
  // ==============================

  async function excluirTecnico(id: string, nome: string) {
    const confirmou = window.confirm(
      `Deseja realmente excluir o técnico ${nome}?`,
    );

    if (!confirmou) {
      return;
    }

    try {
      setExcluindoId(id);

      await excluirTecnicoService(id);

      setTecnicos((tecnicosAtuais) =>
        tecnicosAtuais.filter((tecnico) => tecnico.id !== id),
      );
    } catch (error) {
      if (error instanceof Error) {
        window.alert(error.message);
      } else {
        window.alert("Não foi possível excluir o técnico.");
      }
    } finally {
      setExcluindoId(null);
    }
  }

  // ==============================
  // CONVERTER CÓDIGO → NOME
  // ==============================

  function obterNomeMunicipio(codigo: string) {
    return MUNICIPIOS[codigo] ?? codigo;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarGestor
        anoInicial={anoInicial}
        anoFinal={anoFinal}
        municipiosSelecionados={municipiosSelecionados}
        onAnoInicialChange={setAnoInicial}
        onAnoFinalChange={setAnoFinal}
        onMunicipiosChange={setMunicipiosSelecionados}
      />

      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">
            <div className="flex flex-col gap-6 p-4 md:p-6">
              {/* ==============================
                  CABEÇALHO
              ============================== */}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Técnicos</h1>

                  <p className="text-sm text-muted-foreground">
                    Gerencie os técnicos e os municípios vinculados a cada um.
                  </p>
                </div>

                <Button
                  nativeButton={false}
                  render={<Link href="/dashboard/gestor/tecnicos/novo" />}
                >
                  <PlusIcon className="size-4" />
                  Cadastrar técnico
                </Button>
              </div>

              {/* ==============================
                  LOADING
              ============================== */}

              {carregando && <DashboardLoading />}

              {/* ==============================
                  ERRO
              ============================== */}

              {!carregando && erro && (
                <DashboardError message={erro} onRetry={carregarTecnicos} />
              )}

              {/* ==============================
                  CONTEÚDO
              ============================== */}

              {!carregando && !erro && (
                <>
                  {/* ==============================
                      RESUMO
                  ============================== */}

                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="rounded-xl border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Técnicos cadastrados
                        </p>

                        <UsersIcon className="size-5 text-muted-foreground" />
                      </div>

                      <p className="mt-2 text-2xl font-bold">
                        {tecnicos.length}
                      </p>
                    </div>
                  </div>

                  {/* ==============================
                      TABELA
                  ============================== */}

                  <div className="overflow-hidden rounded-xl border bg-card">
                    <div className="border-b px-6 py-4">
                      <h2 className="font-semibold">Técnicos cadastrados</h2>

                      <p className="text-sm text-muted-foreground">
                        Lista de técnicos cadastrados no sistema.
                      </p>
                    </div>

                    {tecnicos.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr className="border-b">
                              <th className="px-6 py-3 text-left font-medium">
                                Nome
                              </th>

                              <th className="px-6 py-3 text-left font-medium">
                                Email
                              </th>

                              <th className="px-6 py-3 text-left font-medium">
                                Municípios
                              </th>

                              <th className="px-6 py-3 text-right font-medium">
                                Ações
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {tecnicos.map((tecnico) => (
                              <tr
                                key={tecnico.id}
                                className="border-b last:border-0"
                              >
                                {/* NOME */}

                                <td className="px-6 py-4 font-medium">
                                  {tecnico.nome}
                                </td>

                                {/* EMAIL */}

                                <td className="px-6 py-4 text-muted-foreground">
                                  {tecnico.email}
                                </td>

                                {/* MUNICÍPIOS */}

                                <td className="px-6 py-4">
                                  <div className="flex flex-wrap gap-1">
                                    {tecnico.municipios.length > 0 ? (
                                      tecnico.municipios.map((municipio) => (
                                        <Badge
                                          key={municipio}
                                          variant="secondary"
                                        >
                                          {obterNomeMunicipio(municipio)}
                                        </Badge>
                                      ))
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Nenhum município
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* AÇÕES */}

                                <td className="px-6 py-4">
                                  <div className="flex justify-end gap-2">
                                    {/* EDITAR */}

                                    <Button
                                      nativeButton={false}
                                      variant="outline"
                                      size="sm"
                                      render={
                                        <Link
                                          href={`/dashboard/gestor/tecnicos/${tecnico.id}/editar`}
                                        />
                                      }
                                    >
                                      <PencilIcon className="size-4" />
                                      Editar
                                    </Button>

                                    {/* EXCLUIR */}

                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      type="button"
                                      disabled={excluindoId === tecnico.id}
                                      onClick={() =>
                                        excluirTecnico(tecnico.id, tecnico.nome)
                                      }
                                    >
                                      <Trash2Icon className="size-4" />

                                      {excluindoId === tecnico.id
                                        ? "Excluindo..."
                                        : "Excluir"}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* ==============================
                          ESTADO VAZIO
                      ============================== */

                      <div className="p-10 text-center">
                        <h2 className="font-semibold">
                          Nenhum técnico cadastrado
                        </h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Cadastre um técnico para começar.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
