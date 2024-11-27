import { ColumnDef } from "@tanstack/react-table";

export interface UltimosAccesos {
  visito: string;
  fecha: string;
  duracion: string
}

export const UltimosAccesosColumns: ColumnDef<UltimosAccesos>[] = [
  {
    accessorKey: "visito",
    header: "Visitó",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("visito")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => (
      <div>{row.getValue("fecha")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "duracion",
    header: "Duración",
    cell: ({ row }) => (
      <div>{row.getValue("duracion")}</div>
    ),
    enableSorting: true,
  },
];