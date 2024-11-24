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

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Recorrido, rondinesColumns } from "./rondines-columns";

export const data: Recorrido[] = [
  {
    id: "1",
    ubicacion: "Planta Monterrey",
    recorrido: "Revisión de oficinas",
    guardiaResponsable: "Carlos Rodríguez Sánchez",
    fechaHoraProgramada: "14/05/2024 09:30 hrs",
  },
  {
    id: "2",
    ubicacion: "Planta Saltillo",
    recorrido: "Inspección de almacenes",
    guardiaResponsable: "María López Hernández",
    fechaHoraProgramada: "14/05/2024 10:00 hrs",
  },
  {
    id: "3",
    ubicacion: "Planta Guadalajara",
    recorrido: "Supervisión de accesos",
    guardiaResponsable: "Juan Pérez Martínez",
    fechaHoraProgramada: "14/05/2024 11:00 hrs",
  },
  {
    id: "4",
    ubicacion: "Planta Monterrey",
    recorrido: "Monitoreo de cámaras",
    guardiaResponsable: "Luisa Fernández Torres",
    fechaHoraProgramada: "14/05/2024 08:30 hrs",
  },
  {
    id: "5",
    ubicacion: "Planta Saltillo",
    recorrido: "Revisión de perímetros",
    guardiaResponsable: "José García Ruiz",
    fechaHoraProgramada: "14/05/2024 09:45 hrs",
  },
  {
    id: "6",
    ubicacion: "Planta Guadalajara",
    recorrido: "Inspección de vehículos",
    guardiaResponsable: "Ana Rodríguez Vega",
    fechaHoraProgramada: "14/05/2024 10:15 hrs",
  },
  {
    id: "7",
    ubicacion: "Planta Monterrey",
    recorrido: "Supervisión de trabajadores",
    guardiaResponsable: "Carlos Rodríguez Sánchez",
    fechaHoraProgramada: "14/05/2024 09:15 hrs",
  },
  {
    id: "8",
    ubicacion: "Planta Saltillo",
    recorrido: "Inspección de maquinaria",
    guardiaResponsable: "Laura Ramírez Gómez",
    fechaHoraProgramada: "14/05/2024 10:30 hrs",
  },
  {
    id: "9",
    ubicacion: "Planta Guadalajara",
    recorrido: "Revisión de inventarios",
    guardiaResponsable: "Miguel Ángel Torres",
    fechaHoraProgramada: "14/05/2024 11:30 hrs",
  },
  {
    id: "10",
    ubicacion: "Planta Monterrey",
    recorrido: "Supervisión de limpieza",
    guardiaResponsable: "Patricia González Núñez",
    fechaHoraProgramada: "14/05/2024 08:00 hrs",
  },
  {
    id: "11",
    ubicacion: "Planta Saltillo",
    recorrido: "Control de entrada de visitantes",
    guardiaResponsable: "Luis Ramírez López",
    fechaHoraProgramada: "14/05/2024 09:50 hrs",
  },
  {
    id: "12",
    ubicacion: "Planta Guadalajara",
    recorrido: "Monitoreo de carga y descarga",
    guardiaResponsable: "Rosa Elena Díaz",
    fechaHoraProgramada: "14/05/2024 10:40 hrs",
  },
  {
    id: "13",
    ubicacion: "Planta Monterrey",
    recorrido: "Inspección de áreas comunes",
    guardiaResponsable: "Carlos Rodríguez Sánchez",
    fechaHoraProgramada: "14/05/2024 09:20 hrs",
  },
  {
    id: "14",
    ubicacion: "Planta Saltillo",
    recorrido: "Revisión de equipos electrónicos",
    guardiaResponsable: "Fernando Ruiz García",
    fechaHoraProgramada: "14/05/2024 10:50 hrs",
  },
  {
    id: "15",
    ubicacion: "Planta Guadalajara",
    recorrido: "Supervisión de protocolos de seguridad",
    guardiaResponsable: "Luisa Pérez Santos",
    fechaHoraProgramada: "14/05/2024 11:45 hrs",
  },
  {
    id: "16",
    ubicacion: "Planta Monterrey",
    recorrido: "Monitoreo de puntos críticos",
    guardiaResponsable: "María López Hernández",
    fechaHoraProgramada: "14/05/2024 09:40 hrs",
  },
  {
    id: "17",
    ubicacion: "Planta Saltillo",
    recorrido: "Revisión de instalaciones eléctricas",
    guardiaResponsable: "Carlos Rodríguez Sánchez",
    fechaHoraProgramada: "14/05/2024 10:10 hrs",
  },
  {
    id: "18",
    ubicacion: "Planta Guadalajara",
    recorrido: "Supervisión de protocolos contra incendios",
    guardiaResponsable: "Ana Rodríguez Vega",
    fechaHoraProgramada: "14/05/2024 11:10 hrs",
  },
  {
    id: "19",
    ubicacion: "Planta Monterrey",
    recorrido: "Inspección de accesos principales",
    guardiaResponsable: "Luis Ramírez López",
    fechaHoraProgramada: "14/05/2024 09:10 hrs",
  },
  {
    id: "20",
    ubicacion: "Planta Saltillo",
    recorrido: "Control de áreas restringidas",
    guardiaResponsable: "José García Ruiz",
    fechaHoraProgramada: "14/05/2024 10:20 hrs",
  },
];

export function RondinesTable() {
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
    columns: rondinesColumns,
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


     <div className="">
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
        <div className="flex items-center justify-end space-x-4">
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
                  colSpan={rondinesColumns.length}
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
