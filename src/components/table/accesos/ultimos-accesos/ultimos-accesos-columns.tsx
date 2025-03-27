import { ColumnDef } from "@tanstack/react-table";



export const UltimosAccesosColumns: ColumnDef<any>[] = [
  {
    accessorKey: "visita_a", // Se mantiene la clave principal
    header: "Visitó",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.visita_a?.[0]?.nombre || "Desconocido"}
      </div>
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
    accessorKey: "duration",
    header: "Duración",
    cell: ({ row }) => (
      <div>{row.getValue("duration")}</div>
    ),
    enableSorting: true,
  },
];


