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
import { ChevronDown, FileX2, Plus, Trash2 } from "lucide-react";

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
import { Incidencia_record, incidenciasColumns } from "./incidencias-columns";
import { useEffect } from "react";

interface ListProps {
  refetch:() => void;
  data: Incidencia_record[];
  setPrioridades: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading:boolean;
  openModal: () => void;
}

const IncidenciasTable:React.FC<ListProps> = ({ refetch, data, setPrioridades, isLoading, openModal})=> {
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

  const handleCheckboxChange = (event:any) => {
    const { id, checked } = event.target;

    setPrioridades((prevPrioridades) => {
      if (checked) {
        return [...prevPrioridades, id]; // Agregar la opción seleccionada
      } else {
        return prevPrioridades.filter((item) => item !== id); // Eliminar la opción deseleccionada
      }
    });
  };

  const table = useReactTable({
    data:data || [],
    columns:  isLoading ? [] : incidenciasColumns,
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

  useEffect(()=>{
    refetch
  },[])

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center my-5">
        {/* Campo de búsqueda a la izquierda */}
        <input
          type="text"
          placeholder="Buscar en todos los campos..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full border border-gray-300 mb-5 rounded-md p-2 h-12  max-w-xs"
        />

        {/* Botones a la derecha */}
        <div className="flex flex-col-reverse items-center justify-start space-x-3">
          <div className="flex items-center space-x-4">
            <Label htmlFor="prioridad">
              <span className="text-lg font-semibold">Prioridad:</span>
            </Label>

            <div className="flex items-center space-x-2">
              <Checkbox id="alta" onChange={handleCheckboxChange}/>
              <Label htmlFor="alta">Alta</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="media" onChange={handleCheckboxChange}/>
              <Label htmlFor="media">Media</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="baja" onChange={handleCheckboxChange}/>
              <Label htmlFor="baja">Baja</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="critica" onChange={handleCheckboxChange}/>
              <Label htmlFor="critica">Crítica</Label>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col md:flex-row  gap-3 mb-5">

          <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600" onClick={openModal}>
            <Plus />
            Nuevo Incidente
          </Button>

          <Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
            <FileX2 />
            Descargar
          </Button>

          <Button className="w-full md:w-auto bg-red-500 hover:bg-red-600">
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
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
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
                  colSpan={incidenciasColumns.length}
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
export default IncidenciasTable;