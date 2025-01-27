/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseNoteModal } from "@/components/modals/close-note-modal";
import { NoteDetailsModal } from "@/components/modals/note-details-modal";
import { ColumnDef } from "@tanstack/react-table";
import { Check, Eye } from "lucide-react";
import Image from "next/image";

export interface Note {
  note_open_date: string
  folio: string
  note_comments: NoteComment[]
  created_by_name: string
  note_file: any[]
  note_status: string
  note_pic: NotePic[]
  note: string
  created_by_id: number
  created_by_email: string
  _id: string
}

export interface NoteComment {
  note_comments: string
}

export interface NotePic {
  file_name: string
  file_url: string
}

export const notasColumns: ColumnDef<any>[] = [
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

        <NoteDetailsModal title={row.original.note} noteData={row.original}>
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
    accessorKey: "note",
    header: "Nota",
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
  },
  {
    accessorKey: "note_pic",
    header: "Foto",
    cell: ({ row }) => {
      const pic = row.original.note_pic?.[0]; // Obtén la primera imagen si existe
      return pic ? (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
          <Image
            src={pic.file_url}
            alt={pic.file_name}
            
            fill           
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      ) : (
        <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-200">
          <span className="text-gray-500 text-sm">Sin foto</span>
        </div>
      );
    },
  },
  {
    accessorKey: "note_comments",
    header: "Comentarios",
    cell: ({ row }) => (
      <div>
        {row.original.note_comments?.map((comment: any, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-600">•</span>{" "}
            <p className="capitalize">{comment.note_comments}</p>
          </div>
        ))}
      </div>
    ),
  },
];
