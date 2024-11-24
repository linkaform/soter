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
  {
    id: "8",
    folio: "1635-10",
    entrada: "2024-11-04 10:14:40",
    salida: "2024-11-04 10:50:00",
    visitante: "Hugo Perez",
    tipo: "Técnico de Telecomunicaciones",
    contratista: "Contratista de Pruebas",
    visitaA: "Emiliano Zapata",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-007",
    comentarios: ["Instalación completada", "Sin problemas detectados"],
  },
  {
    id: "9",
    folio: "1587-10",
    entrada: "2024-10-23 10:56:43",
    salida: "2024-10-23 11:30:00",
    visitante: "Laura Hernández Peña",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",

    gafete: "GAF-008",
    comentarios: ["Trabajo realizado con éxito"],
  },
  {
    id: "10",
    folio: "1586-10",
    entrada: "2024-10-22 08:39:29",
    salida: "2024-10-22 09:15:00",
    visitante: "Laura Hernández Peña",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-009",
    comentarios: ["Sin incidencias"],
  },
  {
    id: "11",
    folio: "1585-10",
    entrada: "2024-10-22 07:59:22",
    salida: "2024-10-22 08:45:00",
    visitante: "Laura Hernández Peña",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-010",
    comentarios: ["Carga pesada", "Revisar capacidad para futuras operaciones"],
  },
  {
    id: "12",
    folio: "1565-10",
    entrada: "2024-10-18 03:18:53",
    salida: "2024-10-18 04:00:00",
    visitante: "Laura Hernández Peña",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "MYT-12",
    comentarios: ["Se encontraron áreas a mejorar"],
  },
  {
    id: "13",
    folio: "1545-10",
    entrada: "2024-10-17 04:10:14",
    salida: "2024-10-17 05:00:00",
    visitante: "Jonathan Arturo",
    tipo: "Manejador de Grúa",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "MTY-10",
    comentarios: ["Material entregado", "Documentación firmada"],
  },
  {
    id: "14",
    folio: "1544-10",
    entrada: "2024-10-17 00:00:26",
    salida: "2024-10-17 01:00:00",
    visitante: "Maicruz Prueba",
    tipo: "Visita General",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "MTY-10",
    comentarios: ["Sin complicaciones"],
  },
  {
    id: "15",
    folio: "1543-10",
    entrada: "2024-10-16 07:34:58",
    salida: "2024-10-16 08:15:00",
    visitante: "Jonathan Arturo",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-011",
    comentarios: ["Inspección completada", "Sin observaciones"],
  },
  {
    id: "16",
    folio: "1542-10",
    entrada: "2024-10-16 07:09:54",
    salida: "2024-10-16 08:00:00",
    visitante: "Jonathan Arturo",
    tipo: "Manejador de Grúa",
    contratista: "Pelotas Dragón",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "MTY-10",
    comentarios: ["Visita sin problemas"],
  },
  {
    id: "17",
    folio: "1538-10",
    entrada: "2024-10-16 06:33:30",
    salida: "2024-10-16 07:15:00",
    visitante: "Maicruz Prueba",
    tipo: "Visita General",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-012",
    comentarios: ["Entrega finalizada", "Verificar inventario entregado"],
  },
  {
    id: "18",
    folio: "1537-10",
    entrada: "2024-10-16 06:32:50",
    salida: "2024-10-16 07:00:00",
    visitante: "Maicruz Prueba",
    tipo: "Visita General",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-013",
    comentarios: ["Acceso autorizado", "Sin retrasos"],
  },
  {
    id: "19",
    folio: "1533-10",
    entrada: "2024-10-16 05:22:38",
    salida: "2024-10-16 06:10:00",
    visitante: "Joe Duck",
    tipo: "Visita General",
    contratista: "Empresa de Limpieza SA de CV",
    visitaA: "Venustiano Carranza",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "MTY-11",
    comentarios: ["Equipo en condiciones óptimas"],
  },
  {
    id: "20",
    folio: "1531-10",
    entrada: "2024-10-15 08:03:50",
    salida: "2024-10-15 08:45:00",
    visitante: "Pancho Pantera",
    tipo: "Walkin",
    contratista: "LKF",
    visitaA: "Juan Escutia",
    casetaEntrada: "Caseta Principal",
    casetaSalida: "---",
    gafete: "GAF-014",
    comentarios: ["Operación completada sin contratiempos"],
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
        
      <div className="my-5">
      <h1 className="text-2xl font-bold">Registro y Seguimiento de Recorridos</h1>
      </div>  

      <div className="flex justify-between items-center my-5">
        {/* Campo de búsqueda a la izquierda */}
        <input
          type="text"
          placeholder="Buscar en todos los campos..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
        />

        {/* Botones a la derecha */}
        <div className="flex items-center justify-end space-x-6">
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

          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
            <FileX2 />
            Descargar
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

      <div className="">
        <Table>
          <TableHeader>
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
