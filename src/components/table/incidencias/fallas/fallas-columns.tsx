
import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Edit, Eye, Trash2 } from "lucide-react";
import Image from "next/image";




export type Falla = {
    id: string;
    fechaHora: string;
    estado: "abierto" | "cerrado" | "en proceso"; 
    ubicacion: string; 
    lugarFallo: string;
    falla: string; 
    evidencia: string;
    comentarios: string; 
    reporta: string; 
    responsable: string; 
  };

 





  export const fallasColumns: ColumnDef<Falla>[] = [

    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div className="flex space-x-3 items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />

       <div className="cursor-pointer">
            <Eye />
          </div>
          <div className="cursor-pointer">
          <Check />                    </div>
          <div className="cursor-pointer">
            <Edit />
          </div>
          <div className="cursor-pointer">
            <Trash2 />
          </div>

        </div>

      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "fechaHora",
      header: "Fecha y hora",
      cell: ({ row }) => (
        <div>{row.getValue("fechaHora")}</div>
      ),
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
      accessorKey: "ubicacion",
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("ubicacion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "lugarFallo",
      header: "Lugar del fallo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("lugarFallo")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla",
      header: "Falla",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "evidencia",
      header: "Evidencia",
      cell: ({ row }) => (
        <div className="relative h-24 w-28">
        <Image
          src={row.getValue("evidencia")}
          alt="evidencia"
          fill
          className="object-cover"
        />
      </div>
      ),
      enableSorting: false,
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
    {
      accessorKey: "reporta",
      header: "Reporta",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("reporta")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "responsable",
      header: "Responsable",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("responsable")}</div>
      ),
      enableSorting: true,
    },
  ];
  