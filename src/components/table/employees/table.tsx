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
import {   ChevronDown,  List, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Eye from "@/components/icon/eye";
import Check from "@/components/icon/check";

const data: Guardia[] = [
  {
    id: "a1b2c3d4",
    empleado: "Juan Pérez",
    cierre: "2024-02-09 09:54:06",
    nota: "Inventario pendiente",
    comentarios: "Cumplimiento de tareas",
  },
  {
    id: "e5f6g7h8",
    empleado: "María López",
    cierre: "2024-03-10 10:30:00",
    nota: "Revisión de seguridad",
    comentarios: "Todo en orden",
  },
  {
    id: "i9j0k1l2",
    empleado: "Carlos Díaz",
    cierre: "2024-04-11 11:15:30",
    nota: "Actualización de registros",
    comentarios: "Registros actualizados",
  },
  {
    id: "m3n4o5p6",
    empleado: "Ana García",
    cierre: "2024-05-12 12:45:15",
    nota: "Mantenimiento de equipos",
    comentarios: "Equipos en buen estado",
  },
  {
    id: "q7r8s9t0",
    empleado: "Luis Hernández",
    cierre: "2024-06-13 14:20:45",
    nota: "Capacitación del personal",
    comentarios: "Capacitación completada",
  },
  {
    id: "u1v2w3x4",
    empleado: "Laura Martínez",
    cierre: "2024-07-14 15:55:25",
    nota: "Supervisión de proyectos",
    comentarios: "Proyectos en progreso",
  },
  {
    id: "y5z6a7b8",
    empleado: "Pedro Jiménez",
    cierre: "2024-08-15 16:40:10",
    nota: "Inspección de instalaciones",
    comentarios: "Todo en buen estado",
  },
  {
    id: "c9d0e1f2",
    empleado: "Sofía Castro",
    cierre: "2024-09-16 17:25:50",
    nota: "Control de calidad",
    comentarios: "Revisión completada",
  },
  {
    id: "g3h4i5j6",
    empleado: "Roberto Morales",
    cierre: "2024-10-17 18:10:30",
    nota: "Verificación de inventario",
    comentarios: "Inventario actualizado",
  },
];

export type Guardia = {
  id: string;
  empleado: string;
  cierre: string;
  nota: string;
  comentarios: string;
};

export const columns: ColumnDef<Guardia>[] = [
  {
    id: "select",
    header: "",
    cell: () => (
      <div className="flex space-x-4">
          <div className="cursor-pointer">
          <Check />
        </div>


          <div className="cursor-pointer">
          <Eye />
          </div>
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
    accessorKey: "cierre",
    header: "Cierre",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("cierre")}</div>
    ),
  },
  {
    accessorKey: "nota",
    header: "Nota",
    cell: ({ row }) => <div className="capitalize">{row.getValue("nota")}</div>,
  },
  {
    accessorKey: "comentarios",
    header: "Comentarios",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("comentarios")}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTableDemo() {
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



    <div className="flex items-center justify-end space-x-6">


    <div className="flex space-x-2">
      {/* Botón "+ Nota" */}
      <Button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md flex items-center">
        + Nota
      </Button>

      {/* Botón con ícono de lista */}
      <Button size="icon"  className=" bg-blue-500 text-white hover:bg-blue-600 p-0 flex items-center justify-center rounded-md">
        <List className="" />
      </Button>
    </div>

      <div className="flex items-center py-4">
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
      <div className="rounded-md border">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
