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

import { habitacionesInspeccionadasColumns, HabitacionInspeccionada } from "./habitacionesInspeccionadasColumns";
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
import { FileSpreadsheet } from "lucide-react";
import { exportToExcel, exportFilteredData } from "../utils/exportUtils";

interface ListProps {
    isLoading: boolean;
    habitaciones: HabitacionInspeccionada[];
}

const HabitacionesInspeccionadasTable: React.FC<ListProps> = ({
    isLoading,
    habitaciones,
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
    const [isExporting, setIsExporting] = React.useState(false);

    const table = useReactTable({
        data: habitaciones || [],
        columns: habitacionesInspeccionadasColumns,
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

    // ✅ Función para manejar la descarga
    const handleDownload = async () => {
        setIsExporting(true);

        try {
            let success = false;

            if (globalFilter || columnFilters.length > 0) {
                // ✅ Exportar solo datos filtrados si hay filtros activos
                success = exportFilteredData(table, 'habitaciones_filtradas');
            } else {
                // ✅ Exportar todos los datos si no hay filtros
                success = exportToExcel(habitaciones, 'habitaciones_inspeccionadas');
            }

            if (success) {
                // ✅ Opcional: mostrar mensaje de éxito
                console.log('✅ Descarga completada exitosamente');
            } else {
                console.error('❌ Error al generar el archivo');
                alert('Error al generar el archivo de descarga');
            }
        } catch (error) {
            console.error('❌ Error durante la descarga:', error);
            alert('Error al descargar el archivo');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center my-5">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
                />

                {/* ✅ Botón de descarga mejorado */}
                <div className="flex gap-2">
                    <div className="text-sm text-gray-500 flex items-center">
                        {globalFilter || columnFilters.length > 0
                            ? `${table.getFilteredRowModel().rows.length} registros filtrados`
                            : `${habitaciones.length} registros totales`
                        }
                    </div>
                    <Button
                        onClick={handleDownload}
                        disabled={isExporting || isLoading || habitaciones.length === 0}
                        className="bg-white text-black border-black border hover:text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                                Exportando...
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Exportar Excel
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <ScrollArea className="h-100 w-full border rounded-md">
                <Table>
                    <TableHeader className="bg-[#F0F2F5]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-1 cursor-pointer select-none"
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : (
                                                <div className="flex items-center gap-1">
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {header.column.getCanSort() && (
                                                        <>
                                                            {header.column.getIsSorted() === "asc" && <span>▲</span>}
                                                            {header.column.getIsSorted() === "desc" && <span>▼</span>}
                                                        </>
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
                                <TableCell colSpan={habitacionesInspeccionadasColumns.length} className="h-24 text-center">
                                    {isLoading ? "Cargando registros..." : "No hay registros disponibles"}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
};

export default HabitacionesInspeccionadasTable;
