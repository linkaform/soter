"use client";

import * as React from "react";

import Image from "next/image";

import {
  ColumnDef,
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeftRight,  ChevronDown, Clock, Eye, FileX2,  Pencil, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";



export type Concecionado = {
  id: string;
  articulo: string;
  fecha: string;
  tipo: string;
  noSerie: string
  reporta: string;
  observaciones: string[]
  recibe: string;
  devolucion: string;
  estado: string;
  area: string;
};


const data: Concecionado[] = [
    {
        id: "1",
        articulo: "Chamarra",
        fecha: "2024-09-17 13:54",
        tipo: "ropa",
        noSerie: "",
        reporta: "Carlos",
        observaciones: ["test"],
        estado: "",
        area: "",
        recibe: "",
        devolucion: ""
    },
           
      ];
    
      
      export const columns: ColumnDef<Concecionado>[] = [
        {
          id: "options",
          header: "Opciones",
          cell: ({ row }) => (
            <div className="flex space-x-2">
              {/* Ícono de visualizar */}
              <div className="cursor-pointer">
                <Eye />
              </div>
              {/* Ícono de devolver */}
              <div className="cursor-pointer">
                <ArrowLeftRight />
              </div>
              {/* Ícono de editar */}
              <div className="cursor-pointer">
                <Pencil />
              </div>
            </div>
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "id",
          header: "ID",
          cell: ({ row }) => <div>{row.getValue("id")}</div>,
          enableSorting: true,
        },
        {
          accessorKey: "articulo",
          header: "Artículo",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("articulo")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "fecha",
          header: "Fecha",
          cell: ({ row }) => <div>{row.getValue("fecha")}</div>,
          enableSorting: true,
        },
        {
          accessorKey: "tipo",
          header: "Tipo",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tipo")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "noSerie",
          header: "No. Serie",
          cell: ({ row }) => <div>{row.getValue("noSerie")}</div>,
          enableSorting: true,
        },
        {
          accessorKey: "reporta",
          header: "Reporta",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("reporta")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "observaciones",
          header: "Observaciones",
          cell: ({ row }) => {
            const observaciones = row.getValue("observaciones") as string[];
            return (
              <div className="capitalize">
                {Array.isArray(observaciones) ? (
                  <ul className="list-disc pl-5">
                    {observaciones.map((obs, index) => (
                      <li key={index}>{obs}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{observaciones}</span>
                )}
              </div>
            );
          },
          enableSorting: true,
        },
        {
          accessorKey: "recibe",
          header: "Recibe",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("recibe")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "devolucion",
          header: "Devolución",
          cell: ({ row }) => <div>{row.getValue("devolucion")}</div>,
          enableSorting: true,
        },
        {
          accessorKey: "estado",
          header: "Estado",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("estado")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "area",
          header: "Área",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("area")}</div>
          ),
          enableSorting: true,
        },
      ];   



export function ConcecionadosTable() {
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
    columns,
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
        <div className="flex items-center justify-end space-x-6">



          <div className="flex items-center space-x-5">


          <Label className=""  htmlFor="terms">Estado:</Label>

            


        <Select defaultValue="Pendiente">
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccione un estado" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Estado</SelectLabel>
          <SelectItem value="Pendiente">Pendiente</SelectItem>
          <SelectItem value="Entregado">Entregado</SelectItem>
          <SelectItem value="Donado">Donado</SelectItem>
       
        </SelectGroup>
      </SelectContent>
    </Select>
    </div>  
      

      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
      <Plus />        
        Nuevo Artículo
      </Button>

      <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
      <Clock />   
        Entrega
      </Button>



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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
           No hay registros disponibles                </TableCell>
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
