import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Ban,  Eye, Flag, Pencil } from "lucide-react";


export type Recorrido = {
    id: string;
    ubicacion: string;
    recorrido: string;
    guardiaResponsable: string;
    fechaHoraProgramada: string;
  
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
            <Ban /> {/* Ícono de edición */}
          </div>
        
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "ubicacion",
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("ubicacion")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "recorrido",
      header: "Recorrido",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("recorrido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "guardiaResponsable",
      header: "Guardia Responsable",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("guardiaResponsable")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fechaHoraProgramada",
      header: "Fecha y Hora Programada",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fechaHoraProgramada")}</div>
      ),
      enableSorting: true,
    },
  ];