"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NavDocumentsProps = {
  items: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
  cultura: string;
  anoInicial: string;
  anoFinal: string;
  onCulturaChange: (value: string) => void;
  onAnoInicialChange: (value: string) => void;
  onAnoFinalChange: (value: string) => void;
};

const anos = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"];

export function NavDocuments({
  items,
  cultura,
  anoInicial,
  anoFinal,
  onCulturaChange,
  onAnoInicialChange,
  onAnoFinalChange,
}: NavDocumentsProps) {
  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Filtros</SidebarGroupLabel>

        <div className="space-y-4 px-2">
          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Cultura
            </span>

            <Select
              value={cultura}
              onValueChange={(value) => {
                if (value) {
                  onCulturaChange(value);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a cultura" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="milho">Milho</SelectItem>
                <SelectItem value="feijao">Feijão</SelectItem>
                <SelectItem value="mandioca">Mandioca</SelectItem>
                <SelectItem value="caju">Caju</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-muted-foreground">
              Período
            </span>

            <div className="grid grid-cols-2 gap-2">
              <Select
                value={anoInicial}
                onValueChange={(value) => {
                  if (value) {
                    onAnoInicialChange(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="De" />
                </SelectTrigger>

                <SelectContent>
                  {anos.map((ano) => (
                    <SelectItem key={ano} value={ano}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={anoFinal}
                onValueChange={(value) => {
                  if (value) {
                    onAnoFinalChange(value);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Até" />
                </SelectTrigger>

                <SelectContent>
                  {anos.map((ano) => (
                    <SelectItem key={ano} value={ano}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SidebarGroup>

      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Dados</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton render={<a href={item.url} />}>
                {item.icon}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}
