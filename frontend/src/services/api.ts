// src/services/api.ts

import { API_URL } from "@/config/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL não está configurada.");
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),

      ...options.headers,
    },
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const mensagem =
      data &&
      typeof data === "object" &&
      "erro" in data &&
      typeof data.erro === "string"
        ? data.erro
        : "Erro ao comunicar com o servidor.";

    throw new Error(mensagem);
  }

  return data as T;
}
