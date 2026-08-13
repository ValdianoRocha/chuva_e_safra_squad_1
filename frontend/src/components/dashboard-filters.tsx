"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DashboardFilters() {
  return (
    <div className="px-4 lg:px-6">
      <div className="grid gap-4 rounded-xl border bg-card p-4 md:grid-cols-3">
        <div className="space-y-2">
          <span className="text-sm font-medium">Cultura</span>

          <Select defaultValue="milho">
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
          <span className="text-sm font-medium">Ano inicial</span>

          <Select defaultValue="2015">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ano inicial" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2015">2015</SelectItem>
              <SelectItem value="2016">2016</SelectItem>
              <SelectItem value="2017">2017</SelectItem>
              <SelectItem value="2018">2018</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Ano final</span>

          <Select defaultValue="2022">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ano final" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="2015">2015</SelectItem>
              <SelectItem value="2016">2016</SelectItem>
              <SelectItem value="2017">2017</SelectItem>
              <SelectItem value="2018">2018</SelectItem>
              <SelectItem value="2019">2019</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}