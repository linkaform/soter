"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type HotelProgress = {
    hotel: string;
    porcentaje_inspeccion: number;
    total_inspecciones: number; // ✅ Nueva propiedad
};

export const hotelProgressColumns: ColumnDef<HotelProgress>[] = [
    {
        accessorKey: "hotel",
        header: "Hotel",
        size: 250, // ✅ Reducir un poco para hacer espacio
        minSize: 180,
        maxSize: 350,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.hotel.replace(/_/g, ' ').toUpperCase()}
            </div>
        ),
    },
    {
        accessorKey: "total_inspecciones",
        header: "Total Inspecciones", // ✅ Nueva columna
        size: 140,
        minSize: 120,
        maxSize: 160,
        cell: ({ row }) => {
            const total = row.original.total_inspecciones;

            return (
                <div className="text-center font-semibold">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {total.toLocaleString()} {/* ✅ Formato con comas para números grandes */}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "porcentaje_inspeccion",
        header: "Porcentaje",
        size: 130, // ✅ Reducir un poco
        minSize: 110,
        maxSize: 150,
        cell: ({ row }) => {
            const porcentaje = row.original.porcentaje_inspeccion;

            // ✅ Determinar color del badge según el porcentaje
            const getVariant = (value: number) => {
                if (value >= 90) return "bg-green-100 text-green-800 border-green-300";
                if (value >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-300";
                if (value >= 50) return "bg-orange-100 text-orange-800 border-orange-300";
                return "bg-red-100 text-red-800 border-red-300";
            };

            return (
                <Badge
                    variant="outline"
                    className={`font-semibold rounded-md p-2 ${getVariant(porcentaje)}`}
                >
                    {porcentaje.toFixed(1)}%
                </Badge>
            );
        },
    },
];