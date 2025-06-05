"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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
import {pasesEntradaColumns } from "./pases-entrada-columns";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchPases from "@/components/pages/pases/SearchPases";

  interface ListProps {
    isLoading:boolean;
    pases: any[];
    onSearch: (value: string) => void;
  }

const PasesEntradaTable:React.FC<ListProps> = ({ isLoading, pases, onSearch})=>{
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    );
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
      data: pases || [],
      columns: pasesEntradaColumns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,

      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        globalFilter,
      },
    });

    return (
      <div className="w-full">
        <div className="flex justify-between items-center my-5">
          <div id="searchpases">
            <SearchPases onSearch={onSearch} />
          </div>

          {/* Botones a la derecha */}
          <div className="flex items-center justify-end space-x-4">

          <Link href="/dashboard/pase-entrada">

            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
              <Plus />
              Nuevo Pase
            </Button>

            </Link>
          </div>
        </div>

        <div className="">

        <ScrollArea className="h-100 w-full border rounded-md">
          <Table>
          <TableHeader className="bg-[#F0F2F5]">
          {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="px-1">
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
                      <TableCell key={cell.id} className="p-1 pl-1">
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
                    colSpan={pasesEntradaColumns.length}
                    className="h-24 text-center"
                  >
                    {isLoading ? "Cargando registros..." : "No hay registros disponibles"}
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
export default PasesEntradaTable;