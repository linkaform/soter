"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ellipsis, Eye } from "lucide-react";

export const ticketsColumns: ColumnDef<any>[] = [
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => console.log("Abrir modal", row.original)}>
          <Eye />
        </Button>
        <Button variant="outline" size="sm" onClick={() => console.log("Abrir modal", row.original)}>
          <Ellipsis />
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "ticketId",
    header: "Ticket ID",
  },
  {
    accessorKey: "fallas",
    header: "Fallas",
  },
  {
    accessorKey: "habitaciones",
    header: "Habitaciones Afectadas",
  },
  {
    accessorKey: "responsable",
    header: "Responsable",
  },
  {
    accessorKey: "fechaLimite",
    header: "Fecha Límite",
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => {
      const value = row.getValue("estatus") as string;

      const statusClass = {
        "Vencido": "bg-red-300 text-red-600 border border-red-600",
        "Activo": "bg-yellow-400 text-yellow-600 border border-yellow-600",
        "Completado": "bg-blue-400 text-blue-600 border border-blue-600",
      }[value] || "";

      return <Badge className={statusClass}>{value}</Badge>;
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
];
