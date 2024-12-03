import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Ban,  Eye, Flag, Pencil } from "lucide-react";


export type Recorrido = {
  folio: number;
  status: boolean;
  ubi: string;
  area: string; 
  nameGuard: string;
  dateHourStart: string;
  dateHourFin: string; 
  nameRoute: string; 
  pointsRoute: string; 
  observations: string; 
  evidence: string;
  durationRoute: string;   
  };


  export const rondinesColumns: ColumnDef<Recorrido>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: () => (
        <div className="flex space-x-2">
          <div className="cursor-pointer">
            <Eye /> {/* Ícono de visualización */}
          </div>
          <div className="cursor-pointer">
            <Flag /> {/* Ícono de finalizar */}
          </div>
          <div className="cursor-pointer">
            <Pencil /> {/* Ícono de edición */}
          </div>
          <div className="cursor-pointer">
            <Ban /> {/* Ícono de cancelación */}
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    }, 
    {
      accessorKey: "status",
      header: "Abierto",
      cell: ({ row }) => (
        <div
          className={
            row.getValue("status") ? "text-green-500" : "text-red-500"
          }
        >
          {row.getValue("status") ? "Activo" : "Inactivo"}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "ubi",
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("ubi")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "area",
      header: "Caseta",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("area")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "nameGuard",
      header: "Guardia Responsable",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nameGuard")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "dateHourStart",
      header: "Fecha de Inicio",
      cell: ({ row }) => <div>{row.getValue("dateHourStart")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "dateHourFin",
      header: "Fecha de Fin",
      cell: ({ row }) => <div>{row.getValue("dateHourFin")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "nameRoute",
      header: "Nombre del recorrido",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nameRoute")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "pointsRoute",
      header: "Puntos del recorrido",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("pointsRoute")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "observations",
      header: "Observaciones",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("observations")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "evidence",
      header: "Evidencias",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("evidence")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "durationRoute",
      header: "Duración del recorrido",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("durationRoute")}</div>
      ),
      enableSorting: true,
    },
  ];