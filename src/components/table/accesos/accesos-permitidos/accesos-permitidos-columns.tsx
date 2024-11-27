import { ColumnDef } from "@tanstack/react-table";

export interface AccesosPermitidos {
  acceso: string;
  estatus: string;
  comentario: string;
}

export const accesosPermitidosColumns: ColumnDef<AccesosPermitidos>[] = [
  {
    accessorKey: "acceso",
    header: "Acceso",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("acceso")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.getValue("estatus") === "Autorizado"
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {row.getValue("estatus")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "comentario",
    header: "Comentario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("comentario")}</div>
    ),
    enableSorting: false,
  },
];
