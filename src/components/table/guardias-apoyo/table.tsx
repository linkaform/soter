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
import { AddGuardModal } from "@/components/modals/add-guard-modal";
import Exit from "@/components/icon/exit";
import { ExitGuardModal } from "@/components/modals/exit-guard-modal";

const initialData: GuardiaApoyo[] = [
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





export function GuardiasApoyoTable() {



  const columns: ColumnDef<GuardiaApoyo>[] = [
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
  /*   {
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
    }, */
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ExitGuardModal
          title="Confirmación"
          empleado={row.original.empleado} // Pasamos el nombre del guardia al modal
          onConfirm={() => handleDeleteGuard(row.original.id)}
          >
          <div className="cursor-pointer">
            <Exit /> {/* El ícono que abre el modal */}
          </div>
        </ExitGuardModal>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  
  
  ];





  const [guardias, setGuardias] = React.useState<GuardiaApoyo[]>(initialData);

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


  const [empleadoFilter, setEmpleadoFilter] = React.useState("");

  const table = useReactTable({
    data: guardias,
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



  React.useEffect(() => {
    setColumnFilters([{ id: "empleado", value: empleadoFilter }]);
  }, [empleadoFilter]);

  
  



  const handleAddGuardias = (selectedGuardias: GuardiaApoyo[]) => {
    setGuardias((prevGuardias) => [...selectedGuardias, ...prevGuardias]);
  };


   const handleDeleteGuard = (id: string) => {
    setGuardias((prevGuardias) => prevGuardias.filter((guardia) => guardia.id !== id));
  };

  return (
    <div className="w-full">

      
   
<div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Buscar por empleado..."
          value={empleadoFilter}
          onChange={(e) => setEmpleadoFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
        />

        <AddGuardModal title="Guardias" onAddGuardias={handleAddGuardias}>
          <Button className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md flex items-center">
            + Guardia apoyo
          </Button>
        </AddGuardModal>
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
