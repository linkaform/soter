import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";


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
            <Eye /> 
          </div>
          <div className="cursor-pointer">
            <Pencil /> 
          </div>
          <div className="cursor-pointer">
            <Trash /> 
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
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
      accessorKey: "nameRoute",
      header: "Nombre del rondin",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nameRoute")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "pointsRoute",
      header: "Checkpoints",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("pointsRoute")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "recurrence",
      header: "Recurrencia",
      cell: ({ row }) => <div>{row.getValue("recurrence")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "durationRoute",
      header: "Duración estimada",
      cell: ({ row }) => <div>{row.getValue("durationRoute")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "nameGuard",
      header: "Asingado a",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nameGuard")}</div>
      ),
      enableSorting: true,
    },
  ];