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

import { Download, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ticketsColumns } from "./ticketsColumns";

interface ListProps {
    isLoading: boolean;
    tickets: any[];
}

const TicketsTable: React.FC<ListProps> = ({ isLoading, tickets }) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 20,
    });
    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
        data: tickets || [],
        columns: ticketsColumns,
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
                <input
                    type="text"
                    placeholder="Buscar en todos los campos..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
                />
                <div className="flex items-center justify-end space-x-4">
                    {/* <Button onClick={handleExportCSV}>Exportar CSV</Button> */}
                    <Button className="bg-white text-black border-black border hover:text-white hover:bg-black">
                        <Download /> Exportar
                    </Button>
                    <Link href="/dashboard/reportes">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Accion
                        </Button>
                    </Link>
                </div>
            </div>

            <ScrollArea className="h-100 w-full border rounded-md">
                <Table>
                    <TableHeader className="bg-[#F0F2F5]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="px-1">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-1 pl-1">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={ticketsColumns.length} className="h-24 text-center">
                                    {isLoading ? "Cargando registros..." : "No hay registros disponibles"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="flex items-center justify-end space-x-2 py-4">
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
    );
};

export default TicketsTable;
