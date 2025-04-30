/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddGuardModal } from "@/components/modals/add-guard-modal";
import Exit from "@/components/icon/exit";
import { ExitGuardModal } from "@/components/modals/exit-guard-modal";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetShift } from "@/hooks/useGetShift";
import { useGetSupportGuards } from "@/hooks/useGetSupportGuards";
import { useShiftStore } from "@/store/useShiftStore";
import { useGuardSelectionStore } from "@/store/useGuardStore";

export function GuardiasApoyoTable() {
  const { checkoutSupportGuardsMutation } = useGetSupportGuards(false);

    const { shift } = useGetShift(false, false);
    const { location, area } = useShiftStore();
    const {toggleGuardSelection, clearSelectedGuards} =   useGuardSelectionStore()
  
    React.useEffect(() => {
      clearSelectedGuards(); // 🔥 Reinicia la selección de guardias
    }, [clearSelectedGuards]);

  const handleConfirmCheckout = (guardia: any) => {
    checkoutSupportGuardsMutation.mutate({
      area,
      location,
      guards: [guardia.user_id],
    });
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => {
        if (shift?.guard?.status_turn !== "Turno Cerrado") return null; // 🔥 Oculta el header del checkbox si el turno NO está cerrado
    
        return (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        );
      },
      cell: ({ row }) => {
        if (shift?.guard?.status_turn !== "Turno Cerrado") return null; // 🔥 Oculta los checkboxes si el turno NO está cerrado
    
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(!!value);
              toggleGuardSelection(row.original);
            }}
            aria-label="Select row"
          />
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "avatar",
      header: "Foto",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="relative w-14 h-14 rounded-full overflow-hidden">
            <Image
              src={row.original.picture || "/nouser.svg"}
              alt={`${row.original.name || "Sin nombre"} avatar`}
              fill
              sizes="56px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Empleado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        // Mostrar ExitGuardModal solo si el turno no está cerrado
        if (shift?.guard?.status_turn === "Turno Cerrado") {
          return null; // No mostrar nada
        }

        return (
          <ExitGuardModal
            title="Confirmación"
            empleado={row.original.name}
            onConfirm={() => handleConfirmCheckout(row.original)} // Llamada al confirmar
          >
            <div className="cursor-pointer">
              <Exit />
            </div>
          </ExitGuardModal>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

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

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: shift?.support_guards || [],
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
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Guardias de Apoyo</h1>
      </div>

      <div className="flex flex-row justify-between items-center mb-5 gap-2">
        <input
          type="text"
          placeholder="Buscar"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
        />

          <AddGuardModal title="Guardias">
          <Button
            type="submit"
            className={"w-full text-white bg-green-600 hover:bg-green-700"}
      
            disabled={shift?.guard?.status_turn === "Turno Cerrado"}
          >
            <Plus />
            Guardia apoyo
          </Button>
        </AddGuardModal>
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
                  colSpan={columns.length}
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
