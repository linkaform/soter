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
import { Eraser, List, Plus, Trash2 } from "lucide-react";

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
  VehiculoAutorizado,
  VehiculoAutorizadoColumns,
} from "./vehiculos-autorizados-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddVehicleModal } from "@/components/modals/add-vehicle-modal";

const data: VehiculoAutorizado[] = [
  {
    tipo: "Automóvil",
    marca: "Toyota",
    modelo: "Corolla",
    matricula: "ABC123",
    color: "Blanco",
  },
  {
    tipo: "Camioneta",
    marca: "Ford",
    modelo: "Ranger",
    matricula: "XYZ789",
    color: "Negro",
  },
  {
    tipo: "Motocicleta",
    marca: "Honda",
    modelo: "CBR500",
    matricula: "MOT456",
    color: "Rojo",
  },
  {
    tipo: "Camión",
    marca: "Mercedes-Benz",
    modelo: "Actros",
    matricula: "CAMION321",
    color: "Azul",
  },
  {
    tipo: "SUV",
    marca: "Chevrolet",
    modelo: "Equinox",
    matricula: "SUV654",
    color: "Gris",
  },
];

export function VehiculosAutorizadosTable() {
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
    columns: VehiculoAutorizadoColumns,
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
        <h1 className="text-2xl font-bold">Vehículos Autorizados</h1>
      </div>

    
        {/* Botones a la derecha */}
        <div className="flex justify-end mb-3 space-x-2">

          <AddVehicleModal title={"Nuevo Vehículo"}>

            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus />
              Agregar Vehículo
            </Button>

          </AddVehicleModal>
  

          <Button
            className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
            variant="outline"
            size="icon"
          >
            <List size={36} />
          </Button>


          <Button
            className="bg-red-500 hover:bg-red-600 text-black"
            variant="outline"
            size="icon"
          >
            <Trash2 className="text-white" size={36} />
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
                    colSpan={VehiculoAutorizadoColumns.length}
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
