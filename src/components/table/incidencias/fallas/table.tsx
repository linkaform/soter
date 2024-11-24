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
import { ChevronDown,  FileX2,  Plus,  Trash2 } from "lucide-react";



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
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Falla, fallasColumns } from "./fallas-columns";





  const data: Falla[] = [
    {
      id: "1",
      fechaHora: "2024-10-23 11:49",
      estado: "abierto",
      ubicacion: "Planta Monterrey",
      lugarFallo: "Caseta Principal",
      falla: "Problemas con el software",
      evidencia: "/image/incidencia1.png",
      comentarios: "El sistema para control de presión de máquinas no responde correctamente.",
      reporta: "Pedro Páramo",
      responsable: "Venustiano Carranza",
    },
    {
      id: "2",
      fechaHora: "2024-11-01 08:15",
      estado: "cerrado",
      ubicacion: "Planta Guadalajara",
      lugarFallo: "Torre de Control",
      falla: "Error en sensores",
      evidencia: "/image/falla1.png",
      comentarios: "Los sensores de temperatura están enviando valores incorrectos.",
      reporta: "Juan Escutia",
      responsable: "Guadalupe Victoria",
    },
    {
      id: "3",
      fechaHora: "2024-10-30 14:30",
      estado: "en proceso",
      ubicacion: "Planta Querétaro",
      lugarFallo: "Área de Ensamblaje",
      falla: "Interrupción eléctrica",
      evidencia: "/image/incidencia1.png",
      comentarios: "Hubo una interrupción en el suministro eléctrico que afectó las líneas de producción.",
      reporta: "Sor Juana Inés",
      responsable: "Miguel Hidalgo",
    },
  ];
  






  
export function FallasTable() {
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
    columns: fallasColumns,
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
        <div className="flex items-center justify-start space-x-3">
  <div className="flex items-center space-x-4">
    <Label htmlFor="prioridad">
      <span className="text-lg font-semibold">Prioridad:</span>
    </Label>

    <div className="flex items-center space-x-2">
      <Checkbox id="alta" />
      <Label htmlFor="alta">Abierto</Label>
    </div>
    <div className="flex items-center space-x-2">
      <Checkbox id="media" />
      <Label htmlFor="media">Cerrado</Label>
    </div>
   
  </div>



  <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
    <Plus />        
        Nueva Falla
      </Button>

      
     

      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
      <FileX2 />
        
        Descargar
      </Button>

      <Button className="w-full bg-red-500 text-white hover:bg-red-600">
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
                )
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
                  colSpan={fallasColumns.length}
                  className="h-24 text-center"
                >
        No hay registros disponibles                </TableCell>
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


