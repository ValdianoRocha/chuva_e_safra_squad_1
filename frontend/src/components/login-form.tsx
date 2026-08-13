import { CloudRain, Sprout } from "lucide-react";

import { cn } from "@/lib/utils";
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
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-0 p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-10">
            <FieldGroup>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sprout className="size-6" />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">Chuva & Safra</h1>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Acesse sua conta para acompanhar chuva e produtividade
                  </p>
                </div>
              </div>

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  autoComplete="email"
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>

                  <a
                    href="#"
                    className="ml-auto text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>

                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Ainda não possui uma conta?{" "}
                <a
                  href="/cadastro"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Criar conta
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden min-h-150 overflow-hidden bg-primary md:block">
            <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-primary/80" />

            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 -left-20 size-80 rounded-full bg-white/10" />

            <div className="relative flex h-full flex-col justify-between p-10 text-primary-foreground">
              <div className="flex items-center gap-2 font-semibold">
                <CloudRain className="size-5" />
                Chuva & Safra
              </div>

              <div className="space-y-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <CloudRain className="size-7" />
                </div>

                <h2 className="max-w-sm text-3xl font-bold leading-tight">
                  Entenda como a chuva se relaciona com a produtividade
                  agrícola.
                </h2>

                <p className="max-w-sm text-sm leading-relaxed text-primary-foreground/80">
                  Dados agrícolas e climáticos reunidos para apoiar produtores,
                  técnicos e gestores na tomada de decisão.
                </p>
              </div>

              <p className="text-xs text-primary-foreground/60">
                Dados agrícolas e climáticos do Ceará
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
