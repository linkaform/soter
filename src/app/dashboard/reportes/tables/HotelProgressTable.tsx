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

import { hotelProgressColumns, HotelProgress } from "./hotelProgressColumns";
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
import * as XLSX from 'xlsx';

interface HotelProgressTableProps {
    hoteles: HotelProgress[];
}

const HotelProgressTable: React.FC<HotelProgressTableProps> = ({
    hoteles,
}) => {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "porcentaje_inspeccion", desc: true } // ✅ Ordenar por porcentaje descendente por defecto
    ]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [isExporting, setIsExporting] = React.useState(false);

    const table = useReactTable({
        data: hoteles || [],
        columns: hotelProgressColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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

    // ✅ Función para exportar la tabla de progreso
    const handleExport = async () => {
        setIsExporting(true);

        try {
            const excelData = hoteles.map((hotel, index) => ({
                'No.': index + 1,
                'Hotel': hotel.hotel.replace(/_/g, ' ').toUpperCase(),
                'Total Inspecciones': hotel.total_inspecciones,
                'Porcentaje de Inspección': `${hotel.porcentaje_inspeccion.toFixed(1)}%`,
                'Estado': hotel.porcentaje_inspeccion >= 90 ? 'Excelente' :
                    hotel.porcentaje_inspeccion >= 70 ? 'Bueno' :
                        hotel.porcentaje_inspeccion >= 50 ? 'Regular' : 'Necesita Atención'
            }));

            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(excelData);

            worksheet['!cols'] = [
                { width: 8 },   // No.
                { width: 30 },  // Hotel
                { width: 18 },  // Total Inspecciones ✅ Nueva columna
                { width: 25 },  // Porcentaje
                { width: 20 },  // Estado
            ];

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Progreso por Hotel');

            const now = new Date();
            const timestamp = now.toISOString().split('T')[0];
            XLSX.writeFile(workbook, `progreso_hoteles_${timestamp}.xlsx`);

            console.log('✅ Exportación exitosa');
        } catch (error) {
            console.error('❌ Error al exportar:', error);
            alert('Error al exportar los datos');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Buscar hotel..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 h-10 w-full max-w-xs"
                />

                <div className="flex gap-2 items-center">
                    <div className="text-sm text-gray-500">
                        {hoteles.length} hoteles
                    </div>
                    <Button
                        onClick={handleExport}
                        disabled={isExporting || hoteles.length === 0}
                        className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                        size="sm"
                    >
                        {isExporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Exportando...
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Exportar
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <ScrollArea className="h-96 w-full border rounded-md">
                <Table>
                    <TableHeader className="bg-[#F0F2F5]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="px-4 py-3 cursor-pointer select-none"
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanSort() && (
                                                <>
                                                    {header.column.getIsSorted() === "asc" && <span>▲</span>}
                                                    {header.column.getIsSorted() === "desc" && <span>▼</span>}
                                                </>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-4 py-3">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={hotelProgressColumns.length} className="h-24 text-center">
                                    No hay datos disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>

            {/* ✅ Resumen estadístico actualizado con información de inspecciones */}
            <div className="mt-4 space-y-4">
                {/* ✅ Nuevo resumen de inspecciones totales */}
                <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                        <div className="font-semibold text-gray-800">Total de Inspecciones</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {hoteles.reduce((sum, hotel) => sum + hotel.total_inspecciones, 0).toLocaleString()}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-gray-800">Promedio por Hotel</div>
                        <div className="text-2xl font-bold text-green-600">
                            {hoteles.length > 0
                                ? Math.round(hoteles.reduce((sum, hotel) => sum + hotel.total_inspecciones, 0) / hoteles.length).toLocaleString()
                                : 0
                            }
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="font-semibold text-gray-800">Porcentaje Promedio</div>
                        <div className="text-2xl font-bold text-purple-600">
                            {hoteles.length > 0
                                ? (hoteles.reduce((sum, hotel) => sum + hotel.porcentaje_inspeccion, 0) / hoteles.length).toFixed(1)
                                : 0
                            }%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelProgressTable;