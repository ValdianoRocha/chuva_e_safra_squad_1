import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Chuva & Safra",
  description: "Sistema de monitoramento agrícola",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}