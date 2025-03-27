import Image from "next/image";


import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Check, Eye, Pencil } from "lucide-react";


import { NoteDetailsModal } from "@/components/modals/note-details-modal";
import { CloseNoteModal } from "@/components/modals/close-note-modal";
import { Note } from "@/hooks/useGetNotes";


  export const listaNotasColumns: ColumnDef<Note>[] = [
    {
      id: "select",
      header: "",
      cell: ({ row }) => (
        <div className="flex space-x-4">
          <CloseNoteModal note={row.original} folio={row.original.folio} title="Confirmación" >
          <div className="cursor-pointer">
              <Check />
            </div>
          </CloseNoteModal>
  
          <NoteDetailsModal note={row.original} title={row.original.note}>
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
      accessorKey: "created_by_name",
      header: "Empleado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("created_by_name")}</div>
      ),
    },
    {
      accessorKey: "note_open_date",
      header: "Apertura",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("note_open_date")}</div>
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
      accessorKey: "note",
      header: "Nota",
      cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
    },
    {
      accessorKey: "archivo",
      header: "Archivo",
      cell: ({ row }) => {
        const archivos = row.original?.note_file; // 🔥 Obtener los archivos de la nota
    
        if (!archivos || archivos.length === 0) return null; // ❌ No mostrar nada si no hay archivos
    
        return (
          <div className="flex flex-col">
            {archivos.map((file, index) => (
              <a
                key={index}
                href={file.file_url}
                className="text-blue-500 underline hover:text-blue-700"
                download
                target="_blank"
                rel="noopener noreferrer"
              >
                {file.file_name}
              </a>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "fotografia",
      header: "Fotografía",
      cell: ({ row }) => {
        const fotos = row.original?.note_pic; // 🔥 Obtener las fotos de la nota
        const primeraFoto = fotos?.length > 0 ? fotos[0].file_url : null; // 🔥 Obtener la primera imagen
    
        if (!primeraFoto) return null; // ❌ No mostrar nada si no hay fotos
    
        return (
          <div className="relative h-24 w-28">
            <Image
              src={primeraFoto}
              alt="Fotografía de la nota"
              fill
              className="object-cover rounded-md"
            />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "comentarios",
      header: "Comentarios",
      cell: ({ row }) => {
        const comentarios = row.original.note_comments; // 🔥 Obtener comentarios
    
        if (!comentarios || comentarios.length === 0) {
          return <div className="italic text-gray-500">Sin comentarios</div>; // 🔹 Si no hay comentarios
        }
    
        return (
          <div className="capitalize">
            {comentarios.map((comment: any, index: number) => (
              <div key={index} className="mb-1">
                {Array.isArray(comment.note_comments)
                  ? comment.note_comments.join(", ") // 🔥 Si es array, unir con comas
                  : comment.note_comments}
              </div>
            ))}
          </div>
        );
      },
    },
  ];