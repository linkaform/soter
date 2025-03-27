import { CloseNoteModal } from "@/components/modals/close-note-modal";
import { NoteDetailsModal } from "@/components/modals/note-details-modal";
import { Note } from "@/hooks/useGetNotes";
import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Check, Eye } from "lucide-react";


  export const notasColumns: ColumnDef<Note>[] = [
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
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "created_by_name",
      header: "Empleado",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("created_by_name")}</div>
      ),
    },
    {
      accessorKey: "folio",
      header: "Folio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("folio")}</div>
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