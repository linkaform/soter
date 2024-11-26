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
import { ChevronDown, Plus } from "lucide-react";

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
import { PaseEntrada, pasesEntradaColumns } from "./pases-entrada-columns";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";



export const data: PaseEntrada[] = [
    {
      folio: "1254-54",
      fechaHora: "14/11/2024 12:54:45 hrs",
      vigenciaPase: "14/11/2024 12:54:45 hrs",
      visitante: "Julian Alonso Pérez Torres",
      tipoDePase: "Visita General",
      motivo: "Reunión",
      estatus: "Activo",
    },
    {
      folio: "3262-45",
      fechaHora: "14/11/2024 12:54:45 hrs",
      vigenciaPase: "14/11/2024 14:54:45 hrs",
      visitante: "Julian Alonso Pérez Torres",
      tipoDePase: "Visita General",
      motivo: "Reunión",
      estatus: "Activo",
    },
    {
      folio: "2013-45",
      fechaHora: "14/11/2024 12:54:45 hrs",
      vigenciaPase: "14/11/2024 11:54:45 hrs",
      visitante: "Julian Alonso Pérez Torres",
      tipoDePase: "Invitado",
      motivo: "Reunión",
      estatus: "Activo",
    },
    {
      folio: "8524-65",
      fechaHora: "14/11/2024 12:54:45 hrs",
      vigenciaPase: "14/11/2024 9:50:45 hrs",
      visitante: "Julian Alonso Pérez Torres",
      tipoDePase: "Invitado",
      motivo: "Reunión",
      estatus: "Activo",
    },
    {
      folio: "6154-91",
      fechaHora: "14/11/2024 12:54:45 hrs",
      vigenciaPase: "14/11/2024 4:54:45 hrs",

      visitante: "Julian Alonso Pérez Torres",
      tipoDePase: "Familia de Empleado",
      motivo: "Personal",
      estatus: "Vencido",
    },
    {
      folio: "1632-45",
      fechaHora: "14/11/2024 12:54:45 hrs",
      vigenciaPase: "14/11/2024 2:54:45 hrs",
      visitante: "Julian Alonso Pérez Torres",
      tipoDePase: "Familia de Empleado",
      motivo: "Personal",
      estatus: "Vencido",
    },
    {
      folio: "7845-12",
      fechaHora: "14/11/2024 13:00:00 hrs",
      vigenciaPase: "14/11/2024 15:00:00 hrs",
      visitante: "Marina Hernández López",
      tipoDePase: "Invitado",
      motivo: "Evento",
      estatus: "Activo",
    },
    {
      folio: "4521-34",
      fechaHora: "14/11/2024 10:30:00 hrs",
      vigenciaPase: "14/11/2024 12:30:00 hrs",
      visitante: "Carlos Gómez Sánchez",
      tipoDePase: "Visita General",
      motivo: "Reunión",
      estatus: "Vencido",
    },
    {
      folio: "9654-88",
      fechaHora: "14/11/2024 09:45:00 hrs",
      vigenciaPase: "14/11/2024 10:45:00 hrs",
      visitante: "Sofía Martínez López",
      tipoDePase: "Familia de Empleado",
      motivo: "Personal",
      estatus: "Vencido",
    },
    {
      folio: "3265-44",
      fechaHora: "14/11/2024 14:00:00 hrs",
      vigenciaPase: "14/11/2024 16:00:00 hrs",
      visitante: "Roberto Álvarez Pérez",
      tipoDePase: "Invitado",
      motivo: "Reunión",
      estatus: "Activo",
    },
    {
      folio: "5587-77",
      fechaHora: "14/11/2024 08:15:00 hrs",
      vigenciaPase: "14/11/2024 10:15:00 hrs",
      visitante: "Luis Eduardo Torres",
      tipoDePase: "Visita General",
      motivo: "Capacitación",
      estatus: "Vencido",
    },
  ];
  

export function PasesEntradaTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns: pasesEntradaColumns,
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
        <h1 className="text-2xl font-bold">Historial de Pases</h1>
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

        <Link href="/dashboard/pase-entrada">

          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
            <Plus />
            Nuevo Pase
          </Button>

          </Link>
  

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

      <ScrollArea className="h-96 w-full border rounded-md">


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
                  colSpan={pasesEntradaColumns.length}
                  className="h-24 text-center"
                >
                  No hay registros disponibles{" "}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        </ScrollArea>

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
