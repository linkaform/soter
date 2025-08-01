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

import { auditoriasColumns, Auditoria } from "./auditoriasColumns";
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
import { Search } from "lucide-react";

interface AuditoriasTableProps {
    isLoading: boolean;
    auditorias: Auditoria[];
}

const AuditoriasTable: React.FC<AuditoriasTableProps> = ({
    isLoading,
    auditorias,
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [globalFilter, setGlobalFilter] = React.useState("");

    const table = useReactTable({
        data: auditorias || [],
        columns: auditoriasColumns,
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
            {/* Barra de búsqueda */}
            <div className="flex justify-between items-center my-5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar por estado, NES, fecha..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 pl-10 h-12 w-full max-w-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Información de registros */}
                <div className="text-sm text-gray-600">
                    Total: {auditorias?.length || 0} auditorías
                </div>
            </div>

            {/* Tabla con scroll */}
            <ScrollArea className="h-100 w-full border rounded-md">
                <Table>
                    <TableHeader className="bg-[#F0F2F5]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-3 py-4 cursor-pointer select-none font-semibold"
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : (
                                                <div className="flex items-center gap-2">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <div className="flex flex-col">
                                                            {header.column.getIsSorted() === "asc" && <span className="text-blue-600">▲</span>}
                                                            {header.column.getIsSorted() === "desc" && <span className="text-blue-600">▼</span>}
                                                            {!header.column.getIsSorted() && <span className="text-gray-300">⬍</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="p-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={auditoriasColumns.length} className="h-24 text-center">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2">Cargando auditorías...</span>
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <div className="text-lg mb-2">📋</div>
                                            <div>No hay auditorías disponibles</div>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            {/* Paginación mejorada */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-gray-600">
                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
                    {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} de{" "}
                    {table.getFilteredRowModel().rows.length} auditorías
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>

                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-600">Página</span>
                        <span className="font-medium">
                            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                        </span>
                    </div>

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
};

export default AuditoriasTable;