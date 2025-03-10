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
import { Plus } from "lucide-react";

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
  AccesosComentario,
  AccesosComentarioColumns,
} from "./accesos-comentarios-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentPassModal } from "@/components/modals/comment-pass-modal";

export const data: AccesosComentario[] = [
  {
    comentario: "Entrega de documentos",
    tipoComentario: "Pase",
  },
  {
    comentario: "Mantenimiento programado",
    tipoComentario: "Reunión",
  },
  {
    comentario: "Inspección de seguridad",
    tipoComentario: "Acceso",
  },
  {
    comentario: "Carga de material",
    tipoComentario: "Pase",
  },
  {
    comentario: "Reunión con el supervisor",
    tipoComentario: "Reunión",
  },  
 
];

export function ComentariosAccesosTable() {
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
    columns: AccesosComentarioColumns,
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
        <h1 className="text-2xl font-bold">Comentarios/Instrucciones de visita AA</h1>
      </div>

    
        {/* Botones a la derecha */}
        <div className="flex justify-end mb-3">
        <CommentPassModal title="Comentario al Pase">


            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus />
              Agregar Comentario
            </Button>
        </CommentPassModal>
    
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
                    colSpan={AccesosComentarioColumns.length}
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
