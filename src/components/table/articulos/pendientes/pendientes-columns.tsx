import Image from "next/image";

import {
  ColumnDef, 
} from "@tanstack/react-table";
import { ArrowLeftRight, Eye, Pencil } from "lucide-react";

export type ArticuloPendiente = {
    id: string;
    nombre: string;
    articulo: string;
    fotografia: string;
    color: string;
    categoria: string;
    fechaHallazgo: string;
    areaResguardo: string;
    reporta: string;
    fechaDevolucion: string;
    comentarios: string[]
  };
  

export const pendientesColumns: ColumnDef<ArticuloPendiente>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: () => (
        <div className="flex space-x-2">
          {/* Ícono de visualizar */}
          <div className="cursor-pointer">
            <Eye />
          </div>
          {/* Ícono de devolver */}
          <div className="cursor-pointer">
            <ArrowLeftRight />
          </div>
          {/* Ícono de editar */}
          <div className="cursor-pointer">
            <Pencil />
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },     
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombre")}</div>
      ),
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
        accessorKey: "fotografia",
        header: "Fotografía",
        cell: ({ row }) => (
          <div className="relative h-24 w-28">
          <Image
            src={row.getValue("fotografia")}
            alt="Fotografía"
            fill
            className="object-cover"
          />
        </div>
        ),
        enableSorting: false,
      },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("color")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("categoria")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fechaHallazgo",
      header: "Fecha del hallazgo",
      cell: ({ row }) => (
        <div>{row.getValue("fechaHallazgo")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "areaResguardo",
      header: "Área de Resguardo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("areaResguardo")}</div>
      ),
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
      accessorKey: "fechaDevolucion",
      header: "Fecha de Devolución",
      cell: ({ row }) => (
        <div>{row.getValue("fechaDevolucion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "comentarios",
      header: "Comentarios",
      cell: ({ row }) => {
        const comentarios = row.getValue("comentarios") as string[];
        return (
          <div className="capitalize">
            {Array.isArray(comentarios) ? (
              <ul className="list-disc pl-5">
                {comentarios.map((comentario, index) => (
                  <li key={index}>{comentario}</li>
                ))}
              </ul>
            ) : (
              <span>{comentarios}</span>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
  ];
  