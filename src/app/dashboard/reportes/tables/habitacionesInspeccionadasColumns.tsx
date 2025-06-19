"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type HabitacionInspeccionada = {
    id?: string; // Puede que no venga, así que opcional
    hotel: string;
    habitacion: string;
    total_fallas: number;
    nombre_camarista: string;
    created_at: string;
    grade: number;
};

export const habitacionesInspeccionadasColumns: ColumnDef<HabitacionInspeccionada>[] = [
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => (
            <Button
                variant="outline"
                size="sm"
                onClick={() => {
                    // Aquí abrirías tu modal
                    console.log("Abrir modal para:", row.original);
                }}
            >
                <Eye />
            </Button>
        ),
    },
    {
        accessorKey: "hotel",
        header: "Hotel",
    },
    {
        accessorKey: "habitacion",
        header: "Habitación",
    },
    {
        accessorKey: "total_aciertos",
        header: "Total de aciertos",
    },
    {
        accessorKey: "total_fallas",
        header: "Total de fallas",
    },
    {
        accessorKey: "nombre_camarista",
        header: "Camarista",
    },
    {
        accessorKey: "created_at",
        header: "Fecha de inspección",
    },
    {
        accessorKey: "grade",
        header: "Ponderación (%)",
        cell: ({ row }) => (
            <Badge variant="outline" className="text-red-800 bg-red-300 font-semibold rounded-md p-2">
                {row.original.grade * 100}%
            </Badge>
        ),
    },
];
