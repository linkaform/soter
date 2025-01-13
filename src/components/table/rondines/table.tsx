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
    folio: 1,
    status: true,
    ubi: 'Planta Monterrey',
    area: 'Caseta Vigilancia Norte 3',
    nameGuard: 'Juan Pérez',
    dateHourStart: '14-05-2024 09:30',
    dateHourFin: '14-05-2024 09:30',
    nameRoute: 'Soy una ruta',
    pointsRoute: 'puntos d ela una ruta',
    observations: 'observaciones de la ruta',
    evidence: 'evidencias',
    durationRoute: 'durationRoute'
}, {
    folio: 2,
    status: false,
    ubi: 'Planta Monterrey',
    area: 'Caseta Vigilancia Norte 3',
    nameGuard: 'María Rodríguez',
    dateHourStart: '10-05-2024 14:45',
    dateHourFin: '10-05-2024 14:45',
    nameRoute: 'Soy una ruta',
    pointsRoute: 'puntos d ela una ruta',
    observations: 'Soy una ruta',
    evidence: 'evidencias',
    durationRoute: 'durationRoute'
}, {
    folio: 3,
    status: true,
    ubi: 'Planta Monterrey',
    area: 'Caseta Vigilancia Norte 3',
    nameGuard: 'Pedro Gómez',
    dateHourStart: '12-05-2024 11:20',
    dateHourFin: '12-05-2024 11:20',
    nameRoute: 'Soy una ruta',
    pointsRoute: 'puntos d ela una ruta',
    observations: 'observaciones de la ruta',
    evidence: 'evidencias',
    durationRoute: 'durationRoute'
}, {
    folio: 4,
    status: false,
    ubi: 'Planta Monterrey',
    area: 'Caseta Vigilancia Norte 3',
    nameGuard: 'Ana López',
    dateHourStart: '08-06-2024 08:00',
    dateHourFin: '08-06-2024 08:00',
    nameRoute: 'Soy una ruta',
    pointsRoute: 'puntos d ela una ruta',
    observations: 'observaciones de la ruta',
    evidence: 'evidencias',
    durationRoute: 'durationRoute'
}, {
    folio: 5,
    status: true,
    ubi: 'Planta Monterrey',
    area: 'Caseta Vigilancia Norte 3',
    nameGuard: 'David Martínez',
    dateHourStart: '13-06-2024 15:10',
    dateHourFin: '13-06-2024 15:10',
    nameRoute: 'Soy una ruta',
    pointsRoute: 'puntos d ela una ruta',
    observations: 'observaciones de la ruta',
    evidence: 'evidencias',
    durationRoute: 'durationRoute'
}
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


/*   const totalPages = table.getPageCount(); 
  const currentPage = pagination.pageIndex + 1; 
 */



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
