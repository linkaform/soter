import Image from "next/image";


import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Check, Eye, Pencil } from "lucide-react";


import { NoteDetailsModal } from "@/components/modals/note-details-modal";
import { CloseNoteModal } from "@/components/modals/close-note-modal";


export type ListaNota = {
    id: string;
    folio: string
    empleado: string;
    apertura: string;
    cierre: string;
    nota: string;
    archivo: string;
    fotografia: string
    comentarios: string;


  };
  
  export const listaNotasColumns: ColumnDef<ListaNota>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <div className="flex space-x-4">
          <CloseNoteModal title="Cerrar nota">
            <div className="cursor-pointer">
              <Check />
            </div>
          </CloseNoteModal>
  
          <NoteDetailsModal title={row.original.nota}>
            <div className="cursor-pointer">
              <Eye />
            </div>
          </NoteDetailsModal>


            <div className="cursor-pointer">
              <Pencil />
            </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "folio",
      header: "Folio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("folio")}</div>
      ),
    },
    {
      accessorKey: "empleado",
      header: "Empleado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("empleado")}</div>
      ),
    },
    {
      accessorKey: "apertura",
      header: "Apertura",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("apertura")}</div>
      ),
    },
    {
      accessorKey: "cierre",
      header: "Cierre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("cierre")}</div>
      ),
    },
    {
      accessorKey: "nota",
      header: "Nota",
      cell: ({ row }) => <div className="capitalize">{row.getValue("nota")}</div>,
    },
    {
      accessorKey: "archivo",
      header: "Archivo",
      cell: ({ row }) => (
        <a
          href={`path/to/files/${row.getValue("archivo")}`} // Cambia esta ruta al lugar donde estén almacenados tus archivos
          className="text-blue-500 underline hover:text-blue-700"
          download
        >
          {row.getValue("archivo")}
        </a>
      ),
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
      accessorKey: "comentarios",
      header: "Comentarios",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("comentarios")}</div>
      ),
    },
  ];