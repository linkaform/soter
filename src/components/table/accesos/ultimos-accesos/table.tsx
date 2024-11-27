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


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  UltimosAccesos,
  UltimosAccesosColumns,
} from "./ultimos-accesos-columns";
import { ScrollArea } from "@/components/ui/scroll-area";

const data: UltimosAccesos[] = [
  {
    visito: "Ramón Pancracio Torres",
    fecha: "12/05/2024 11:19:20 hrs",
    duracion: "1 hora 45 minutos",
  },
  {
    visito: "Juan Felipe Gonzáles",
    fecha: "12/05/2024 11:19:20 hrs",
    duracion: "1 hora 45 minutos",
  },
  {
    visito: "Mireya López Sánchez",
    fecha: "12/05/2024 11:19:20 hrs",
    duracion: "1 hora 45 minutos",
  },
  {
    visito: "Laura Pérez García",
    fecha: "12/05/2024 10:00:15 hrs",
    duracion: "2 horas",
  },
  {
    visito: "Carlos Mendoza Ríos",
    fecha: "11/05/2024 09:15:10 hrs",
    duracion: "1 hora 30 minutos",
  },
  {
    visito: "Lucía Fernández Morales",
    fecha: "10/05/2024 13:45:50 hrs",
    duracion: "3 horas",
  },
  {
    visito: "Pedro Hernández Pérez",
    fecha: "09/05/2024 15:20:30 hrs",
    duracion: "1 hora",
  },
  {
    visito: "Ana Gómez Rojas",
    fecha: "08/05/2024 08:35:40 hrs",
    duracion: "4 horas 15 minutos",
  },
  {
    visito: "Jorge Ramírez Soto",
    fecha: "07/05/2024 17:10:20 hrs",
    duracion: "2 horas 30 minutos",
  },
  {
    visito: "María José Vargas",
    fecha: "06/05/2024 19:45:30 hrs",
    duracion: "1 hora 15 minutos",
  },
];

export function UltimosAccesosTable() {
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
    columns: UltimosAccesosColumns,
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
      <div className="mb-3">
        <h1 className="text-2xl font-bold">Últimos Accesos</h1>
      </div>

    
    
      <div className="w-full">
        <ScrollArea className="h-60 w-full border rounded-md">
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
                    colSpan={UltimosAccesosColumns.length}
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
    </div>
  );
}
