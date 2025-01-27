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
import { ChevronDown, FileX2 } from "lucide-react";

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
import { Bitacora, bitacorasColumns } from "./bitacoras-columns";

const data: Bitacora[] = [
  {
    id: "1",
    folio: "1676-10",
    entrada: "2024-11-11 01:15:06",
    salida: "2024-11-11 02:00:00",
    visitante: "Nueva Visita",
    tipo: "Walkin",
    contratista: "Linkaform",
    visitaA: "Pedro Paramo",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-001",
    comentarios: ["Sin incidencias reportadas"],
  },
  {
    id: "2",
    folio: "1674-10",
    entrada: "2024-11-11 01:07:59",
    salida: "2024-11-11 01:45:00",
    visitante: "Joe Duck",
    tipo: "Manejador de Grúa",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Venustiano Carranza",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-002",
    comentarios: ["Entrega de materiales", "Revisar nuevamente en dos días"],
  },
  {
    id: "3",
    folio: "1658-10",
    entrada: "2024-11-05 11:51:50",
    salida: "2024-11-05 12:30:00",
    visitante: "Joe Duck",
    tipo: "Técnico de Telecomunicaciones",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Venustiano Carranza",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-003",
    comentarios: ["Reparación de equipo", "Material instalado correctamente"],
  },
  {
    id: "4",
    folio: "1648-10",
    entrada: "2024-11-05 04:59:59",
    salida: "2024-11-05 05:45:00",
    visitante: "Joe Duck",
    tipo: "Técnico de Telecomunicaciones",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Venustiano Carranza",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",

    gafete: "GAF-004",
    comentarios: ["Trabajo nocturno", "Sin interrupciones"],
  },
  {
    id: "5",
    folio: "1642-10",
    entrada: "2024-11-04 12:02:24",
    salida: "2024-11-04 12:50:00",
    visitante: "Joe Duck",
    tipo: "Manejador de Grúa",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Venustiano Carranza",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",

    gafete: "GAF-005",
    comentarios: ["Descarga completada", "Operación normal"],
  },
  {
    id: "6",
    folio: "1640-10",
    entrada: "2024-11-04 11:45:52",
    salida: "2024-11-04 12:30:00",
    visitante: "Jonathan Arturo",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-006",
    comentarios: ["Revisión rápida", "Todo en orden"],
  },
  {
    id: "7",
    folio: "1636-10",
    entrada: "2024-11-04 10:17:04",
    salida: "2024-11-04 11:00:00",
    visitante: "Laura Hernández Peña",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "MYT-12",
    comentarios: ["Entrega a tiempo", "Buen desempeño del equipo"],
  },
 
];

export function BitacorasTable() {
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
    columns: bitacorasColumns,
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
        
    
      <div className="flex flex-col md:flex-row gap-3 justify-between items-center my-5">
        {/* Campo de búsqueda a la izquierda */}
        <input
          type="text"
          placeholder="Buscar en todos los campos..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
        />

        {/* Botones a la derecha */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-end space-x-6">
          <div className="flex items-center space-x-4">
            <Label htmlFor="entrada">
              <span className="text-lg font-semibold">Tipo de Movimiento:</span>
            </Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="entrada" defaultChecked />
              <Label htmlFor="entrada">Entrada</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="salida" />
              <Label htmlFor="salida">Salida</Label>
            </div>
          </div>

          <Button className="bg-blue-500 w-full md:w-auto hover:bg-blue-600 text-white px-4 py-2">
            <FileX2 />
            Descargar
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full md:w-auto ">
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
                  colSpan={bitacorasColumns.length}
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
