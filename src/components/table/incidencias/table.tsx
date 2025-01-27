"use client";

import * as React from "react";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, FileX2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Incidencia, incidenciasColumns } from "./incidencias-columns";

const data: Incidencia[] = [
  {
    id: "1",
    nombre: "Leonciitoo",
    articulo: "Peluche de león",
    fotografia: "/image/incidencia1.png",
    color: "Café",
    categoria: "Juguetes y Peluches",
    fechaHallazgo: "2024-09-13 21:29",
    areaResguardo: "L9",
    reporta: "Emiliano Zapata",
    fechaDevolucion: "2024-09-25 15:05",
    comentarios: ["Encontrado en zona infantil", "Entregado sin daños"],
  },
  {
    id: "2",
    nombre: "NUEVO NOMBRE",
    articulo: "Auriculares inalámbricos",
    fotografia: "/image/incidencia2.png",
    color: "Rojo",
    categoria: "Electrónicos",
    fechaHallazgo: "2024-09-18 09:28",
    areaResguardo: "L6",
    reporta: "Juan Escutia",
    fechaDevolucion: "2024-09-17 20:02",
    comentarios: ["Audífonos encontrados", "Sin reporte adicional"],
  },
  {
    id: "3",
    nombre: "Termo",
    articulo: "Barra de granola",
    fotografia: "/image/incidencia3.png",
    color: "Azul",
    categoria: "Alimentos y Bebidas",
    fechaHallazgo: "2024-09-10 18:01",
    areaResguardo: "L6",
    reporta: "Juan Escutia",
    fechaDevolucion: "2024-09-18 13:48",
    comentarios: ["Estaba en la cafetería", "Devuelto limpio"],
  },
  {
    id: "4",
    nombre: "Lápiz de lobo",
    articulo: "Lapicera gris",
    fotografia: "/image/incidencia1.png",
    color: "Gris",
    categoria: "Útiles Escolares",
    fechaHallazgo: "2024-10-10 04:05",
    areaResguardo: "L4",
    reporta: "Emiliano Zapata",
    fechaDevolucion: "2024-10-10 16:23",
    comentarios: ["Entregado sin problemas", "Objeto en buen estado"],
  },
  {
    id: "5",
    nombre: "Color",
    articulo: "Bolígrafo rojo",
    fotografia: "/image/incidencia2.png",
    color: "Rojo",
    categoria: "Útiles Escolares",
    fechaHallazgo: "2024-10-10 16:23",
    areaResguardo: "L5",
    reporta: "Juan Escutia",
    fechaDevolucion: "2024-10-10 14:37",
    comentarios: ["Prueba de entrega", "No se reportaron daños"],
  },
  
];

export function IncidenciasTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns: incidenciasColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  });

  return (
    <div className="w-full">

    
      <div className="flex flex-col md:flex-row justify-between items-center my-5">
        {/* Campo de búsqueda a la izquierda */}
        <input
          type="text"
          placeholder="Buscar en todos los campos..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full border border-gray-300 mb-5 rounded-md p-2 h-12  max-w-xs"
        />

        {/* Botones a la derecha */}
        <div className="flex flex-col-reverse items-center justify-start space-x-3">
          <div className="flex items-center space-x-4">
            <Label htmlFor="prioridad">
              <span className="text-lg font-semibold">Prioridad:</span>
            </Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="alta" />
              <Label htmlFor="alta">Alta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="media" />
              <Label htmlFor="media">Media</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="baja" />
              <Label htmlFor="baja">Baja</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="critica" />
              <Label htmlFor="critica">Crítica</Label>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row  gap-3 mb-5">

          <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
            <Plus />
            Nuevo Incidente
          </Button>

          <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
            <FileX2 />
            Descargar
          </Button>

          <Button className="w-full md:w-auto bg-red-500 hover:bg-red-600">
            <Trash2 />
            Eliminar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="">
        <Table>
        <TableHeader className="bg-[#F0F2F5]">
        {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={incidenciasColumns.length}
                  className="h-24 text-center"
                >
                  No hay registros disponibles{" "}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} items seleccionados.
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
