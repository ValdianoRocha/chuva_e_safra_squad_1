"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  LayoutDashboardIcon,
  ChartBarIcon,
  WheatIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  Settings2Icon,
  CircleHelpIcon,
  CloudRainIcon,
} from "lucide-react"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  cultura: string
  anoInicial: string
  anoFinal: string
  onCulturaChange: (value: string) => void
  onAnoInicialChange: (value: string) => void
  onAnoFinalChange: (value: string) => void
}

const data = {
  user: {
    name: "Usuário",
    email: "usuario@email.com",
    avatar: "",
  },

  navMain: [
    {
      title: "Visão geral",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Minha safra",
      url: "#",
      icon: <WheatIcon />,
    },
    {
      title: "Análises",
      url: "#",
      icon: <ChartBarIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: <CircleHelpIcon />,
    },
  ],

  documents: [
    {
      name: "Dados",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Relatórios",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
  ],
}

export function AppSidebar({
  cultura,
  anoInicial,
  anoFinal,
  onCulturaChange,
  onAnoInicialChange,
  onAnoFinalChange,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/dashboard" />}
            >
              <CloudRainIcon className="size-5!" />

              <span className="text-base font-semibold">
                Chuva & Safra
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />

        <NavDocuments
          items={data.documents}
          cultura={cultura}
          anoInicial={anoInicial}
          anoFinal={anoFinal}
          onCulturaChange={onCulturaChange}
          onAnoInicialChange={onAnoInicialChange}
          onAnoFinalChange={onAnoFinalChange}
        />

        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}