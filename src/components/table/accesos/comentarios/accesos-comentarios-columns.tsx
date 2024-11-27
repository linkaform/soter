import { ColumnDef } from "@tanstack/react-table";

export interface AccesosComentario {
  comentario: string;
  tipoComentario: string;
}

export const AccesosComentarioColumns: ColumnDef<AccesosComentario>[] = [
  {
    accessorKey: "comentario",
    header: "Comentario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("comentario")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tipoComentario",
    header: "Tipo de Comentario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipoComentario")}</div>
    ),
    enableSorting: true,
  },
];
