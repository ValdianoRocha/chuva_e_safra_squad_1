import { cookies } from "next/headers";
import type { Usuario } from "@/types";

export const COOKIE_TOKEN = "chuva_safra_token";
export const COOKIE_USER = "chuva_safra_user";

const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 horas

export async function setarCookieAuth(
  token: string,
  usuario: Usuario
) {
  const cookieStore = cookies();

  cookieStore.set(COOKIE_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  cookieStore.set(
    COOKIE_USER,
    encodeURIComponent(JSON.stringify(usuario)),
    {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    }
  );
}

export async function limparCookieAuth() {
  const cookieStore = cookies();

  cookieStore.delete(COOKIE_TOKEN);
  cookieStore.delete(COOKIE_USER);
}

export async function obterToken(): Promise<string | null> {
  const cookieStore = cookies();

  return cookieStore.get(COOKIE_TOKEN)?.value ?? null;
}

export async function obterUsuario(): Promise<Usuario | null> {
  const cookieStore = cookies();

  const cookie = cookieStore.get(COOKIE_USER)?.value;

  if (!cookie) {
    return null;
  }

  try {
    return JSON.parse(
      decodeURIComponent(cookie)
    ) as Usuario;
  } catch {
    return null;
  }
}