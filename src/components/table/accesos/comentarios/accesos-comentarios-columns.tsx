import { ColumnDef } from "@tanstack/react-table";

export interface AccesosComentario {
  comentario: string;
  tipoComentario: string;
}

export const AccesosComentarioColumns: ColumnDef<AccesosComentario>[] = [
  {
    accessorKey: "comentario_pase",
    header: "Comentario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("comentario_pase")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tipo_de_comentario",
    header: "Tipo de Comentario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipo_de_comentario")}</div>
    ),
    enableSorting: true,
  },
];
