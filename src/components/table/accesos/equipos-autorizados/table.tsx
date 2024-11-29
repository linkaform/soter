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
import { Eraser, List, Plus } from "lucide-react";

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
  EquipoAutorizado,
  EquipoAutorizadoColumns,
} from "./equipos-autorizados-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddEquipmentModal } from "@/components/modals/add-equipment-modal";

const data: EquipoAutorizado[] = [
  {
    tipo: "Herramienta",
    equipo: "Taladro",
    marca: "Bosch",
    modelo: "GSR120",
    numeroSerie: "123456789",
    color: "Azul",
  },
  {
    tipo: "Computo",
    equipo: "Laptop",
    marca: "Dell",
    modelo: "Inspiron 15",
    numeroSerie: "987654321",
    color: "Negro",
  },
  {
    tipo: "Tablet",
    equipo: "iPad",
    marca: "Apple",
    modelo: "Air 2023",
    numeroSerie: "456789123",
    color: "Plateado",
  },
  {
    tipo: "Herramienta",
    equipo: "Sierra",
    marca: "Makita",
    modelo: "XSR01",
    numeroSerie: "741852963",
    color: "Verde",
  },
  {
    tipo: "Otra",
    equipo: "Cámara",
    marca: "Sony",
    modelo: "Alpha 7",
    numeroSerie: "852963741",
    color: "Negro",
  },
];

export function EquiposAutorizadosTable() {
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
    columns: EquipoAutorizadoColumns,
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
        <h1 className="text-2xl font-bold">Equipos Autorizados</h1>
      </div>

    
        {/* Botones a la derecha */}
        <div className="flex justify-end mb-3 space-x-3">

        <AddEquipmentModal title="Nuevo Equipo">

            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus />
              Agregar Equipo
            </Button>

      </AddEquipmentModal>
   

          <Button
            className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
            variant="outline"
            size="icon"
          >
            <List size={36} />
          </Button>

          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
            variant="outline"
            size="icon"
          >
            <Eraser size={36} />
          </Button>
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
                    colSpan={EquipoAutorizadoColumns.length}
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
