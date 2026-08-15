"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Municipio = {
  nome: string;
  codigo: string;
};

type MunicipioMultiSelectProps = {
  municipios: Municipio[];
  selecionados: string[];
  onChange: (codigos: string[]) => void;
};

export function MunicipioMultiSelect({
  municipios,
  selecionados,
  onChange,
}: MunicipioMultiSelectProps) {
  const [open, setOpen] = useState(false);

  function alternarMunicipio(codigo: string) {
    if (selecionados.includes(codigo)) {
      onChange(selecionados.filter((item) => item !== codigo));

      return;
    }

    onChange([...selecionados, codigo]);
  }

  function removerMunicipio(codigo: string) {
    onChange(selecionados.filter((item) => item !== codigo));
  }

  const municipiosSelecionados = municipios.filter((municipio) =>
    selecionados.includes(municipio.codigo),
  );

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          <span className="truncate">
            {selecionados.length === 0
              ? "Pesquisar município..."
              : `${selecionados.length} selecionado(s)`}
          </span>

          <ChevronsUpDownIcon className="size-4 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-65 p-0" align="start">
          <Command>
            <CommandInput placeholder="Pesquisar município..." />

            <CommandList>
              <CommandEmpty>Município não encontrado.</CommandEmpty>

              <CommandGroup>
                {municipios.map((municipio) => {
                  const selecionado = selecionados.includes(municipio.codigo);

                  return (
                    <CommandItem
                      key={municipio.codigo}
                      value={municipio.nome}
                      onSelect={() => alternarMunicipio(municipio.codigo)}
                    >
                      <CheckIcon
                        className={
                          selecionado
                            ? "mr-2 size-4 opacity-100"
                            : "mr-2 size-4 opacity-0"
                        }
                      />

                      <span>{municipio.nome}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {municipiosSelecionados.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {municipiosSelecionados.map((municipio) => (
            <Badge key={municipio.codigo} variant="secondary" className="gap-1">
              {municipio.nome}

              <button
                type="button"
                onClick={() => removerMunicipio(municipio.codigo)}
              >
                <XIcon className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
