"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AppSidebarGestor } from "@/components/layout/app-sidebar-gestor";
import { SiteHeader } from "@/components/layout/site-header";
import { MunicipioMultiSelect } from "@/components/dashboard/shared/municipio-multi-select";

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

import { criarTecnico } from "@/services/tecnico.service";
import { APP_ROUTES } from "@/config/routes";

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

export function NovoTecnicoContent() {
  const router = useRouter();

  const [anoInicial, setAnoInicial] = useState("2015");

  const [anoFinal, setAnoFinal] = useState("2022");

  const [municipiosFiltro, setMunicipiosFiltro] = useState<string[]>([]);

  const [nome, setNome] = useState("");

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const [municipiosTecnico, setMunicipiosTecnico] = useState<string[]>([]);

  const [erro, setErro] = useState("");

  const [carregando, setCarregando] = useState(false);

  async function cadastrarTecnico(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    if (!nome.trim() || !email.trim() || !senha) {
      setErro("Preencha todos os campos.");

      return;
    }

    if (municipiosTecnico.length === 0) {
      setErro("Selecione pelo menos um município.");

      return;
    }

    try {
      setCarregando(true);

      await criarTecnico({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        municipios: municipiosTecnico,
      });

      router.push("/dashboard/gestor/tecnicos");

      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível cadastrar o técnico.");
      }
    } finally {
      setCarregando(false);
    }
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

        <div className="flex flex-1 flex-col">
          <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
            {/* VOLTAR */}

            <div className="mb-6">
              <Button
                nativeButton={false}
                variant="ghost"
                className="-ml-3 mb-2"
                render={<Link href="/dashboard/gestor/tecnicos" />}
              >
                <ArrowLeftIcon />
                Voltar
              </Button>

              <h1 className="text-2xl font-bold">Cadastrar técnico</h1>

              <p className="text-sm text-muted-foreground">
                Cadastre um novo técnico e defina os municípios que ele poderá
                acompanhar.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dados do técnico</CardTitle>

                <CardDescription>
                  Informe os dados de acesso e os municípios vinculados ao
                  técnico.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={cadastrarTecnico} className="space-y-6">
                  {/* NOME */}

                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>

                    <Input
                      id="nome"
                      value={nome}
                      onChange={(event) => setNome(event.target.value)}
                      placeholder="Nome completo"
                      required
                      disabled={carregando}
                    />
                  </div>

                  {/* EMAIL */}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>

                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="tecnico@email.com"
                      required
                      disabled={carregando}
                    />
                  </div>

                  {/* SENHA */}

                  <div className="space-y-2">
                    <Label htmlFor="senha">Senha provisória</Label>

                    <Input
                      id="senha"
                      type="password"
                      value={senha}
                      onChange={(event) => setSenha(event.target.value)}
                      placeholder="Digite uma senha provisória"
                      required
                      disabled={carregando}
                    />

                    <p className="text-xs text-muted-foreground">
                      O técnico poderá alterar a senha posteriormente.
                    </p>
                  </div>

                  {/* MUNICÍPIOS */}

                  <div className="space-y-2">
                    <Label>Municípios permitidos</Label>

                    <MunicipioMultiSelect
                      municipios={municipios}
                      selecionados={municipiosTecnico}
                      onChange={setMunicipiosTecnico}
                    />

                    <p className="text-xs text-muted-foreground">
                      O técnico poderá visualizar somente os municípios
                      vinculados ao cadastro.
                    </p>
                  </div>

                  {/* ERRO */}

                  {erro && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                      {erro}
                    </div>
                  )}

                  {/* AÇÕES */}

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
                        carregando ||
                        !nome ||
                        !email ||
                        !senha ||
                        municipiosTecnico.length === 0
                      }
                    >
                      <SaveIcon />

                      {carregando ? "Cadastrando..." : "Cadastrar técnico"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
