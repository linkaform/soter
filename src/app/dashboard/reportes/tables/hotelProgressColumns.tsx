"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type HotelProgress = {
    hotel: string;
    porcentaje_inspeccion: number;
};

export const hotelProgressColumns: ColumnDef<HotelProgress>[] = [
    {
        accessorKey: "hotel",
        header: "Hotel",
        size: 300, // ✅ Ancho fijo para hotel (más grande)
        minSize: 200,
        maxSize: 400,
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.hotel.replace(/_/g, ' ').toUpperCase()}
            </div>
        ),
    },
    {
        accessorKey: "porcentaje_inspeccion",
        header: "Porcentaje",
        size: 150, // ✅ Ancho fijo para porcentaje (más pequeño)
        minSize: 120,
        maxSize: 180,
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