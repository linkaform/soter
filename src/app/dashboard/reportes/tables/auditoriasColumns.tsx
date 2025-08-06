"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AuditDetailModal from "../modals/AuditDetailModal";

export type Auditoria = {
    created_at: string;
    state: string;
    label: string;
    aciertos: number;
    fallas: number;
    obtained_points: number;
    folio?: string;
    grade?: number;
    max_points?: number;
    _id?: string;
};

export const auditoriasColumns: ColumnDef<Auditoria>[] = [
    {
        id: "acciones",
        header: "Acciones",
        cell: ({ row }) => {
            const auditId = row.original._id;

            // Si no hay ID, mostrar botón deshabilitado
            if (!auditId) {
                return (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        title="ID de auditoría no disponible"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                );
            }

            return (
                <AuditDetailModal auditId={auditId}>
                    <Button
                        variant="outline"
                        size="sm"
                        title={`Ver detalle de auditoría: ${row.original.folio || auditId}`}
                        className="hover:bg-blue-50 hover:border-blue-300"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                </AuditDetailModal>
            );
        },
    },
    {
        accessorKey: "state",
        header: "Estado",
    },
    {
        accessorKey: "label",
        header: "NES",
    },
    {
        accessorKey: "aciertos",
        header: "Total de aciertos",
        cell: ({ row }) => (
            <div className="text-green-700 font-medium">
                {row.original.aciertos}
            </div>
        ),
    },
    {
        accessorKey: "fallas",
        header: "Total de fallas",
        cell: ({ row }) => (
            <div className="text-red-700 font-medium">
                {row.original.fallas}
            </div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Fecha de auditoría",
    },
    {
        accessorKey: "obtained_points",
        header: "Puntuación",
        cell: ({ row }) => {
            const points = row.original.obtained_points;
            const maxPoints = row.original.max_points || 100;
            const percentage = Math.round((points / maxPoints) * 100);

            // Determinar color del badge según el porcentaje
            let badgeClass = "text-red-800 bg-red-100 border-red-300";
            if (percentage >= 80) {
                badgeClass = "text-green-800 bg-green-100 border-green-300";
            } else if (percentage >= 60) {
                badgeClass = "text-yellow-800 bg-yellow-100 border-yellow-300";
            }

            return (
                <div className="flex flex-col items-center">
                    <Badge variant="outline" className={`${badgeClass} font-semibold rounded-md p-2`}>
                        {percentage}%
                    </Badge>
                </div>
            );
        },
    },
];