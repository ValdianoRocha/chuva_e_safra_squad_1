"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CloudRain, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";

import { login } from "@/services/auth.service";
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  // ==============================
  // DADOS DO FORMULÁRIO
  // ==============================

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // ==============================
  // ESTADO DA REQUISIÇÃO
  // ==============================

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  // ==============================
  // LOGIN
  // ==============================

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    try {
      setCarregando(true);

      // ==============================
      // LOGIN VIA SERVICE
      // ==============================

      const resultado = await login({
        email: email.trim(),
        senha,
      });

      // ==============================
      // SALVAR AUTENTICAÇÃO
      // ==============================

      localStorage.setItem("token", resultado.token);

      localStorage.setItem("usuario", JSON.stringify(resultado.usuario));

      // ==============================
      // ROTA DO DASHBOARD POR PERFIL
      // ==============================

      const rotaDashboard = APP_ROUTES.dashboard[resultado.usuario.perfil];

      if (!rotaDashboard) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        throw new Error("Perfil de usuário inválido.");
      }

      // ==============================
      // REDIRECIONAMENTO
      // ==============================

      router.replace(rotaDashboard);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível realizar o login.");
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
                    Chuva & Safra
                  </h1>

                  <p className="mt-1 text-sm text-[#687c73]">
                    Acesse sua conta para acompanhar chuva e produtividade
                  </p>
                </div>
              </div>

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
                  SENHA
              ============================== */}

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>

                  <Link
                    href="#"
                    className="ml-auto text-sm text-[#60756b] underline-offset-4 transition-colors hover:text-[#123f59] hover:underline"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  required
                  disabled={carregando}
                  className="focus-visible:border-[#397447] focus-visible:ring-[#397447]/20"
                />
              </Field>

              {/* ==============================
                  MENSAGEM DE ERRO
              ============================== */}

              {erro && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {erro}
                </div>
              )}

              {/* ==============================
                  ENTRAR
              ============================== */}

              <Field>
                <Button
                  type="submit"
                  disabled={carregando || !email || !senha}
                  className="w-full bg-[#123f59] text-white hover:bg-[#0d3349]"
                >
                  {carregando ? "Entrando..." : "Entrar"}
                </Button>
              </Field>

              {/* ==============================
                  CADASTRO
              ============================== */}

              <FieldDescription className="text-center">
                Ainda não possui uma conta?{" "}
                <Link
                  href={APP_ROUTES.cadastro}
                  className="font-semibold text-[#123f59] underline-offset-4 hover:text-[#397447] hover:underline"
                >
                  Criar conta
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* ==============================
              PAINEL COM IMAGEM
          ============================== */}

          <div
            className="relative hidden min-h-150 overflow-hidden bg-cover bg-center md:block"
            style={{
              backgroundImage: "url('/safra-deitado.png')",
            }}
          >
            {/* OVERLAY */}

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
                  <CloudRain className="size-7" />
                </div>

                <h2 className="max-w-sm text-3xl font-bold leading-tight">
                  Entenda como a chuva se relaciona com a produtividade
                  agrícola.
                </h2>

                <p className="max-w-sm text-sm leading-relaxed text-white/80">
                  Dados agrícolas e climáticos reunidos para apoiar produtores,
                  técnicos e gestores na tomada de decisão.
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

              {/* RODAPÉ */}

              <p className="text-xs text-white/60">
                Dados agrícolas e climáticos do Ceará
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
