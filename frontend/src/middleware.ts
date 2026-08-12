import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Usuario, Perfil } from "@/types";
import { COOKIE_USER } from "@/lib/auth";


const ROTAS_POR_PERFIL: Record<string, Perfil> = {
  "/dashboard/produtor": "PRODUTOR",
  "/dashboard/tecnico": "TECNICO",
  "/dashboard/gestor": "GESTOR",
};


const DASHBOARD_POR_PERFIL: Record<Perfil, string> = {
  PRODUTOR: "/dashboard/produtor",
  TECNICO: "/dashboard/tecnico",
  GESTOR: "/dashboard/gestor",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  
  const cookieUser = request.cookies.get(COOKIE_USER)?.value;

  let usuario: Usuario | null = null;

  if (cookieUser) {
    try {
      usuario = JSON.parse(cookieUser) as Usuario;
    } catch {
      
      usuario = null;
    }
  }

 
  if (pathname === "/login" && usuario) {
    const destino = DASHBOARD_POR_PERFIL[usuario.perfil];

    if (destino) {
      return NextResponse.redirect(new URL(destino, request.url));
    }
  }

  
  const perfilExigido = ROTAS_POR_PERFIL[pathname];

  
  if (perfilExigido && !usuario) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

 
  if (perfilExigido && usuario && usuario.perfil !== perfilExigido) {
    const destino = DASHBOARD_POR_PERFIL[usuario.perfil];

    if (destino) {
      return NextResponse.redirect(new URL(destino, request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
  ],
};