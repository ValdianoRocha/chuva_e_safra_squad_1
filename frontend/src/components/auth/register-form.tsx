"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Check, ChevronsUpDown, CloudRain, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";

import { cadastrar } from "@/services/auth.service";
import { APP_ROUTES } from "@/config/routes";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

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

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  // ==============================
  // DADOS DO FORMULÁRIO
  // ==============================

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // ==============================
  // MUNICÍPIO
  // ==============================

  const [municipio, setMunicipio] = useState("");
  const [municipioAberto, setMunicipioAberto] = useState(false);

  // ==============================
  // ESTADO DA REQUISIÇÃO
  // ==============================

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const municipioSelecionado = municipios.find(
    (item) => item.codigo === municipio,
  );

  // ==============================
  // CADASTRO
  // ==============================

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    // ==============================
    // CONFIRMAÇÃO DE SENHA
    // ==============================

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    // ==============================
    // MUNICÍPIO OBRIGATÓRIO
    // ==============================

    if (!municipio) {
      setErro("Selecione seu município.");
      return;
    }

    try {
      setCarregando(true);

      // ==============================
      // CADASTRO VIA SERVICE
      // ==============================

      await cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,

        // Cadastro público sempre cria PRODUTOR
        perfil: "PRODUTOR",

        // Backend trabalha com array
        municipios: [municipio],
      });

      // ==============================
      // REDIRECIONAMENTO
      // ==============================

      router.push(APP_ROUTES.login);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível criar a conta.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border border-[#d6e2dc] p-0 shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* ==============================
              FORMULÁRIO
          ============================== */}

          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10">
            <FieldGroup>
              {/* CABEÇALHO */}

              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-[#123f59] text-white shadow-sm">
                  <Sprout className="size-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-[#102b38]">
                    Criar conta
                  </h1>

                  <p className="mt-1 text-sm text-[#687c73]">
                    Cadastre-se para acessar o Chuva & Safra
                  </p>
                </div>
              </div>

              {/* ==============================
                  NOME
              ============================== */}

              <Field>
                <FieldLabel htmlFor="nome">Nome</FieldLabel>

                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="Seu nome"
                  autoComplete="name"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  required
                  disabled={carregando}
                  className="focus-visible:border-[#397447] focus-visible:ring-[#397447]/20"
                />
              </Field>

              {/* ==============================
                  EMAIL
              ============================== */}

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={carregando}
                  className="focus-visible:border-[#397447] focus-visible:ring-[#397447]/20"
                />
              </Field>

              {/* ==============================
                  ESTADO
              ============================== */}

              <Field>
                <FieldLabel>Estado</FieldLabel>

                <div className="flex h-9 items-center rounded-md border border-[#d6e2dc] bg-[#f1f6f3] px-3 text-sm text-[#536c60]">
                  Ceará
                </div>
              </Field>

              {/* ==============================
                  MUNICÍPIO
              ============================== */}

              <Field>
                <FieldLabel>Município</FieldLabel>

                <Popover
                  open={municipioAberto}
                  onOpenChange={setMunicipioAberto}
                >
                  <PopoverTrigger
                    render={
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={municipioAberto}
                        disabled={carregando}
                        className="w-full justify-between border-[#d6e2dc] font-normal hover:bg-[#eef5f0]"
                      />
                    }
                  >
                    <span
                      className={cn(
                        "truncate",
                        !municipioSelecionado && "text-muted-foreground",
                      )}
                    >
                      {municipioSelecionado
                        ? municipioSelecionado.nome
                        : "Selecione seu município"}
                    </span>

                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    align="start"
                  >
                    <Command>
                      <CommandInput placeholder="Pesquisar município..." />

                      <CommandList>
                        <CommandEmpty>Município não encontrado.</CommandEmpty>

                        <CommandGroup>
                          {municipios.map((item) => (
                            <CommandItem
                              key={item.codigo}
                              value={item.nome}
                              onSelect={() => {
                                setMunicipio(item.codigo);

                                setMunicipioAberto(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 size-4 text-[#397447]",
                                  municipio === item.codigo
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />

                              {item.nome}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </Field>

              {/* ==============================
                  SENHA
              ============================== */}

              <Field>
                <FieldLabel htmlFor="senha">Senha</FieldLabel>

                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                  disabled={carregando}
                  className="focus-visible:border-[#397447] focus-visible:ring-[#397447]/20"
                />
              </Field>

              {/* ==============================
                  CONFIRMAR SENHA
              ============================== */}

              <Field>
                <FieldLabel htmlFor="confirmarSenha">
                  Confirmar senha
                </FieldLabel>

                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  value={confirmarSenha}
                  onChange={(event) => setConfirmarSenha(event.target.value)}
                  required
                  disabled={carregando}
                  className="focus-visible:border-[#397447] focus-visible:ring-[#397447]/20"
                />
              </Field>

              {/* ==============================
                  ERRO
              ============================== */}

              {erro && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {erro}
                </div>
              )}

              {/* ==============================
                  BOTÃO
              ============================== */}

              <Field>
                <Button
                  type="submit"
                  className="w-full bg-[#123f59] text-white hover:bg-[#0d3349]"
                  disabled={
                    carregando ||
                    !nome ||
                    !email ||
                    !senha ||
                    !confirmarSenha ||
                    !municipio
                  }
                >
                  {carregando ? "Criando conta..." : "Criar conta"}
                </Button>
              </Field>

              {/* ==============================
                  LOGIN
              ============================== */}

              <FieldDescription className="text-center">
                Já possui uma conta?{" "}
                <Link
                  href={APP_ROUTES.login}
                  className="font-semibold text-[#123f59] underline-offset-4 hover:text-[#397447] hover:underline"
                >
                  Entrar
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* ==============================
              PAINEL COM IMAGEM
          ============================== */}

          <div
            className="relative hidden min-h-180 overflow-hidden bg-cover bg-center md:block"
            style={{
              backgroundImage: "url('/safra-deitado.png')",
            }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-[#06243a]/70 via-[#0b3553]/35 to-[#1f512f]/20" />

            <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-10 text-white">
              {/* LOGO */}

              <div className="flex items-center gap-2 font-semibold">
                <CloudRain className="size-5" />
                Chuva & Safra
              </div>

              {/* CONTEÚDO */}

              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md">
                  <Sprout className="size-7" />
                </div>

                <h2 className="max-w-sm text-3xl font-bold leading-tight">
                  Informação agrícola para decisões melhores.
                </h2>

                <p className="max-w-sm text-sm leading-relaxed text-white/80">
                  Acompanhe chuva, produtividade e indicadores agrícolas em uma
                  única plataforma.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                    Chuva
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                    Safra
                  </span>

                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs backdrop-blur">
                    Produtividade
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
