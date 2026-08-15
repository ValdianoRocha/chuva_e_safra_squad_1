"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { SiteHeader } from "@/components/layout/site-header";
import { MunicipioMultiSelect } from "@/components/dashboard/shared/municipio-multi-select";
import { DashboardError } from "@/components/dashboard/shared/dashboard-error";
import { DashboardLoading } from "@/components/dashboard/shared/dashboard-loading";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ArrowLeftIcon, SaveIcon } from "lucide-react";

import {
  atualizarTecnico,
  buscarTecnicoPorId,
} from "@/services/tecnico.service";

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

export function EditarTecnicoContent() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  // ==============================
  // FILTROS DA SIDEBAR
  // ==============================

  const [anoInicial, setAnoInicial] = useState("2015");

  const [anoFinal, setAnoFinal] = useState("2022");

  const [municipiosFiltro, setMunicipiosFiltro] = useState<string[]>([]);

  // ==============================
  // DADOS DO TÉCNICO
  // ==============================

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [municipiosTecnico, setMunicipiosTecnico] = useState<string[]>([]);

  // ==============================
  // ESTADO DA REQUISIÇÃO
  // ==============================

  const [carregando, setCarregando] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  // ==============================
  // CARREGAR TÉCNICO
  // ==============================

  const carregarTecnico = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const tecnico = await buscarTecnicoPorId(id);

      setNome(tecnico.nome);
      setEmail(tecnico.email);

      setMunicipiosTecnico(tecnico.municipios);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível carregar o técnico.");
      }
    } finally {
      setCarregando(false);
    }
  }, [id]);

  // ==============================
  // BUSCAR AO ABRIR
  // ==============================

  useEffect(() => {
    carregarTecnico();
  }, [carregarTecnico]);

  // ==============================
  // SALVAR ALTERAÇÕES
  // ==============================

  async function salvarAlteracoes(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    if (!nome.trim() || !email.trim()) {
      setErro("Preencha todos os campos.");

      return;
    }

    if (municipiosTecnico.length === 0) {
      setErro("Selecione pelo menos um município.");

      return;
    }

    try {
      setSalvando(true);

      await atualizarTecnico(id, {
        nome: nome.trim(),
        email: email.trim(),
        municipios: municipiosTecnico,
      });

      router.push("/dashboard/gestor/tecnicos");

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível atualizar o técnico.");
      }
    } finally {
      setSalvando(false);
    }
  }

  // ==============================
  // LOADING
  // ==============================

  if (carregando) {
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
          municipiosSelecionados={municipiosFiltro}
          onAnoInicialChange={setAnoInicial}
          onAnoFinalChange={setAnoFinal}
          onMunicipiosChange={setMunicipiosFiltro}
        />

        <SidebarInset>
          <SiteHeader />

          <div className="p-4 md:p-6">
            <DashboardLoading />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // ==============================
  // ERRO AO CARREGAR
  // ==============================

  if (erro && !nome) {
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
          municipiosSelecionados={municipiosFiltro}
          onAnoInicialChange={setAnoInicial}
          onAnoFinalChange={setAnoFinal}
          onMunicipiosChange={setMunicipiosFiltro}
        />

        <SidebarInset>
          <SiteHeader />

          <div className="p-4 md:p-6">
            <DashboardError message={erro} onRetry={carregarTecnico} />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
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
        municipiosSelecionados={municipiosFiltro}
        onAnoInicialChange={setAnoInicial}
        onAnoFinalChange={setAnoFinal}
        onMunicipiosChange={setMunicipiosFiltro}
      />

      <SidebarInset>
        <SiteHeader />

        <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
          {/* ==============================
              VOLTAR
          ============================== */}

          <Button
            nativeButton={false}
            variant="ghost"
            className="-ml-3 mb-2"
            render={<Link href="/dashboard/gestor/tecnicos" />}
          >
            <ArrowLeftIcon />
            Voltar
          </Button>

          {/* ==============================
              CABEÇALHO
          ============================== */}

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Editar técnico</h1>

            <p className="text-sm text-muted-foreground">
              Atualize os dados e os municípios vinculados ao técnico.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dados do técnico</CardTitle>

              <CardDescription>
                Altere apenas as informações necessárias.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={salvarAlteracoes} className="space-y-6">
                {/* ==============================
                    NOME
                ============================== */}

                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>

                  <Input
                    id="nome"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                    disabled={salvando}
                  />
                </div>

                {/* ==============================
                    EMAIL
                ============================== */}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={salvando}
                  />
                </div>

                {/* ==============================
                    MUNICÍPIOS
                ============================== */}

                <div className="space-y-2">
                  <Label>Municípios permitidos</Label>

                  <MunicipioMultiSelect
                    municipios={municipios}
                    selecionados={municipiosTecnico}
                    onChange={setMunicipiosTecnico}
                  />
                </div>

                {/* ==============================
                    ERRO
                ============================== */}

                {erro && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {erro}
                  </div>
                )}

                {/* ==============================
                    AÇÕES
                ============================== */}

                <div className="flex justify-end gap-2 border-t pt-6">
                  <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link href="/dashboard/gestor/tecnicos" />}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      salvando ||
                      !nome ||
                      !email ||
                      municipiosTecnico.length === 0
                    }
                  >
                    <SaveIcon />

                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
