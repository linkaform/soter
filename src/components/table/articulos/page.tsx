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
import { ArrowLeftRight,  ChevronDown, Eye, FileX2,  Pencil, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";



export type Articulo = {
  id: string;
  nombre: string;
  articulo: string;
  fotografia: string;
  color: string;
  categoria: string;
  fechaHallazgo: string;
  areaResguardo: string;
  reporta: string;
  fechaDevolucion: string;
  comentarios: string[]
};


const data: Articulo[] = [
    {
          id: "1",
          nombre: "Caseta 6 Poniente",
          articulo: "chamarra",
          fotografia: "/image/articulo1.png",
          color: "Negro",
          categoria: "Categoría 1",
          fechaHallazgo: "2024-11-05 17:55",
          areaResguardo: "L4",
          reporta: "Carlos",
          fechaDevolucion: "2024-11-06 15:00",
          comentarios: ["test"],  
        },
        {
          id: "2",
          nombre: "Caseta Principal",
          articulo: "Peluche",
          fotografia: "/image/articulo2.png",
          color: "Gris",
          categoria: "Categoría 2",
          fechaHallazgo: "2024-09-17 13:54",
          areaResguardo: "L6",
          reporta: "Juan Escutia",
          fechaDevolucion: "2024-09-26 12:42:52",
          comentarios: ["sdfa"],
        },
        {
          id: "3",
          nombre: "Caseta Principal",
          articulo: "bálsamo labial",
          fotografia: "/image/articulo3.png",
          color: "Café",
          categoria: "Categoría 3",
          fechaHallazgo: "2024-09-14 15:51",
          areaResguardo: "L10",
          reporta: "Juan Escutia",
          fechaDevolucion: "2024-09-25 15:12:12",
          comentarios: ["Se entregó al propietario", "Se encontro roto"],
        },        
      ];
      



      export const columns: ColumnDef<Articulo>[] = [
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
          accessorKey: "nombre",
          header: "Nombre",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("nombre")}</div>
          ),
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
            accessorKey: "fotografia",
            header: "Fotografía",
            cell: ({ row }) => (
              <div className="relative h-24 w-28">
              <Image
                src={row.getValue("fotografia")}
                alt="Fotografía"
                fill
                className="object-cover"
              />
            </div>
            ),
            enableSorting: false,
          },
        {
          accessorKey: "color",
          header: "Color",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("color")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "categoria",
          header: "Categoría",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("categoria")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "fechaHallazgo",
          header: "Fecha del hallazgo",
          cell: ({ row }) => (
            <div>{row.getValue("fechaHallazgo")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "areaResguardo",
          header: "Área de Resguardo",
          cell: ({ row }) => (
            <div className="capitalize">{row.getValue("areaResguardo")}</div>
          ),
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
          accessorKey: "fechaDevolucion",
          header: "Fecha de Devolución",
          cell: ({ row }) => (
            <div>{row.getValue("fechaDevolucion")}</div>
          ),
          enableSorting: true,
        },
        {
          accessorKey: "comentarios",
          header: "Comentarios",
          cell: ({ row }) => {
            const comentarios = row.getValue("comentarios") as string[];
            return (
              <div className="capitalize">
                {Array.isArray(comentarios) ? (
                  <ul className="list-disc pl-5">
                    {comentarios.map((comentario, index) => (
                      <li key={index}>{comentario}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{comentarios}</span>
                )}
              </div>
            );
          },
          enableSorting: true,
        },
      ];
      



export function ArticulosTable() {
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
