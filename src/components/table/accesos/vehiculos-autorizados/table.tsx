/* eslint-disable react-hooks/exhaustive-deps */
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

import { VehiculoAutorizadoColumns } from "./vehiculos-autorizados-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Vehiculo } from "@/lib/update-pass-full";
import { VehicleLocalPassModal } from "@/components/modals/add-local-vehicule";
import { SelectedVehiculosModal } from "@/components/modals/modal-selected-vehiculos";

interface TableProps {
  setSelectedVehiculos: (equipos: Vehiculo[])=> void
  selectedVehiculos: Vehiculo[]
  vehiculos:Vehiculo[]
  setVehiculos: React.Dispatch<React.SetStateAction<Vehiculo[]>>
  tipoMovimiento:string;
}
  export const VehiculosAutorizadosTable: React.FC<TableProps> = ({ vehiculos, setSelectedVehiculos, selectedVehiculos,setVehiculos, tipoMovimiento}) => {
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
    data: vehiculos || [],
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
    <div className="w-full mt-3">
        {/* Botones a la derecha */}
        <div className="flex justify-between mb-3 space-x-1">
        <div className="mb-3">
          <h1 className="text-2xl font-bold">Vehículos Autorizados</h1>
        </div>
       <div className="flex justify-end gap-2">
        <VehicleLocalPassModal title="Nuevo Vehiculo" vehicles={vehiculos}  setVehiculos={setVehiculos} isAccesos={true} fetch={false}>
            <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={tipoMovimiento=="Salida"}>
              <Plus />
              Vehiculo
            </Button>
          </VehicleLocalPassModal>

          <SelectedVehiculosModal title={"Vehiculos seleccionados"} description={""} selectedVehiculos={selectedVehiculos} >
            <Button
              disabled={tipoMovimiento=="Salida"}
              className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
              variant="outline"
              size="icon"
            >
              <List size={36} />
            </Button>
          </SelectedVehiculosModal>

          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
            variant="outline"
            size="icon"
            disabled={tipoMovimiento=="Salida"}
            onClick={() => {
              setSelectedVehiculos([]);
              table.resetRowSelection();
            }}
          >
            <Eraser/>
          </Button>
       </div>
        </div>
      <div className="w-full">
        <ScrollArea className="h-44 w-full border rounded-md">
          <Table>
            <TableHeader className="bg-[#F0F2F5]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="h-7">
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
                      <TableCell key={cell.id} >
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