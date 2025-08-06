"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { HabitacionInspeccionadaModal } from "../modals/hab-inspeccionada-modal";

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
            <HabitacionInspeccionadaModal
                title="Detalle de habitación inspeccionada"
                hotel={row.original.hotel}
                habitacion={row.original.habitacion}
            >
                <Button variant="outline" size="sm">
                    <Eye />
                </Button>
            </HabitacionInspeccionadaModal>
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
                {(row.original.grade * 100).toFixed(2)}%
            </Badge>
        ),
    },
];
