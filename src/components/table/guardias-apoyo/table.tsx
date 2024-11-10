"use client";

import * as React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

const data: GuardiaApoyo[] = [
  {
    id: "a1b2c3d4",
    empleado: "Juan Pérez",
    avatar: "/image/empleado1.png",
  },
  {
    id: "e5f6g7h8",
    empleado: "María López",
    avatar: "/image/empleado2.png",
  },
  {
    id: "i9j0k1l2",
    empleado: "Carlos Díaz",
    avatar: "/image/empleado3.png",
  },
  {
    id: "m3n4o5p6",
    empleado: "Ana García",
    avatar: "/image/empleado1.png",
  },
  {
    id: "q7r8s9t0",
    empleado: "Luis Hernández",
    avatar: "/image/empleado2.png",
  },
  {
    id: "u1v2w3x4",
    empleado: "Laura Martínez",
    avatar: "/image/empleado3.png",
  },
  {
    id: "y5z6a7b8",
    empleado: "Pedro Jiménez",
    avatar: "/image/empleado1.png",
  },
  {
    id: "c9d0e1f2",
    empleado: "Sofía Castro",
    avatar: "/image/empleado2.png",
  },
  {
    id: "g3h4i5j6",
    empleado: "Roberto Morales",
    avatar: "/image/empleado3.png",
  },
];

export type GuardiaApoyo = {
  id: string;
  empleado: string;
  avatar: string;
};

export const columns: ColumnDef<GuardiaApoyo>[] = [
  {
    id: "avatar",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center space-x-4">
        <Avatar className="w-14 h-14">
          <AvatarImage
            src={row.original.avatar}
            alt={`${row.original.empleado} avatar`}
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "empleado",
    header: "Empleado",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("empleado")}</div>
    ),
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },


];

export function GuardiasApoyoTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 3,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-end space-x-6"></div>
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
                  No resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} guardias seleccionados.
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
