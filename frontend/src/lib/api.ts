import type {
  Cultura,
  RespostaGrafico,
  RespostaLogin,
} from "@/types";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("API_URL não está configurada");
}

export async function loginNoExpress(
  email: string,
  senha: string
): Promise<RespostaLogin> {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let mensagem = "Email ou senha incorretos";

    try {
      const data = await response.json();

      if (data?.erro) {
        mensagem = data.erro;
      }
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(mensagem);
  }

  return response.json();
}

export interface ParamsGrafico {
  cultura: Cultura;
  de: string;
  ate: string;
}

export async function buscarGraficoNoExpress(
  params: ParamsGrafico,
  token: string
): Promise<RespostaGrafico> {
  const searchParams = new URLSearchParams({
    cultura: params.cultura,
    de: params.de,
    ate: params.ate,
  });

  const response = await fetch(
    `${API_URL}/api/grafico?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    let mensagem = "Erro ao buscar gráfico";

    try {
      const data = await response.json();

      if (data?.erro) {
        mensagem = data.erro;
      }
    } catch {
      // Mantém a mensagem padrão.
    }

    throw new Error(mensagem);
  }

  return response.json();
}