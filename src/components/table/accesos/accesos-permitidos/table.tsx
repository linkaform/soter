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
  AccesosPermitidos,
  accesosPermitidosColumns,
} from "./accesos-permitidos-columns";

import { ScrollArea } from "@/components/ui/scroll-area";

const data: AccesosPermitidos[] = [
  {
    acceso: "Almacén",
    estatus: "Autorizado",
    comentario: "S/N",
  },
  {
    acceso: "Azotea",
    estatus: "Autorizado",
    comentario: "S/N",
  },
  {
    acceso: "Recursos eléctricos",
    estatus: "Autorizado",
    comentario: "S/N",
  },
  {
    acceso: "Oficina principal",
    estatus: "No Autorizado",
    comentario: "Sin permiso vigente",
  },
  {
    acceso: "Estacionamiento",
    estatus: "Autorizado",
    comentario: "S/N",
  },
  {
    acceso: "Cuarto de máquinas",
    estatus: "No Autorizado",
    comentario: "Falta capacitación",
  },
  {
    acceso: "Planta baja",
    estatus: "Autorizado",
    comentario: "S/N",
  },
  {
    acceso: "Terraza",
    estatus: "Autorizado",
    comentario: "S/N",
  },
  {
    acceso: "Laboratorio",
    estatus: "No Autorizado",
    comentario: "Acceso restringido",
  },
  {
    acceso: "Área de carga",
    estatus: "Autorizado",
    comentario: "S/N",
  },
];


export function AccesosPermitidosTable() {
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
    columns: accesosPermitidosColumns,
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
        <h1 className="text-2xl font-bold">Accesos Permitidos</h1>
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
                    colSpan={accesosPermitidosColumns.length}
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
