
import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { ArrowLeftRight, Eye, Pencil } from "lucide-react";


export type Concecionado = {
    id: string;
    articulo: string;
    fecha: string;
    tipo: string;
    noSerie: string
    reporta: string;
    observaciones: string[]
    recibe: string;
    devolucion: string;
    estado: string;
    area: string;
  };


export const concecionadosColumns: ColumnDef<Concecionado>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: () => (
        <div className="flex space-x-2">
          <div className="cursor-pointer">
            <Eye />
          </div>
          <div className="cursor-pointer">
            <ArrowLeftRight />
          </div>
          <div className="cursor-pointer">
            <Pencil />
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "articulo",
      header: "Artículo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("articulo")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => <div>{row.getValue("fecha")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tipo")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "noSerie",
      header: "No. Serie",
      cell: ({ row }) => <div>{row.getValue("noSerie")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "reporta",
      header: "Reporta",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("reporta")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "observaciones",
      header: "Observaciones",
      cell: ({ row }) => {
        const observaciones = row.getValue("observaciones") as string[];
        return (
          <div className="capitalize">
            {Array.isArray(observaciones) ? (
              <ul className="list-disc pl-5">
                {observaciones.map((obs, index) => (
                  <li key={index}>{obs}</li>
                ))}
              </ul>
            ) : (
              <span>{observaciones}</span>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "recibe",
      header: "Recibe",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("recibe")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "devolucion",
      header: "Devolución",
      cell: ({ row }) => <div>{row.getValue("devolucion")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("estado")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "area",
      header: "Área",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("area")}</div>
      ),
      enableSorting: true,
    },
  ];   
