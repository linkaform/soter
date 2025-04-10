import { ColumnDef } from "@tanstack/react-table";

export interface AccesosPermitidos {
  acceso: string;
  estatus: string;
  comentario: string;
}

export const accesosPermitidosColumns: ColumnDef<AccesosPermitidos>[] = [
  {
    accessorKey: "nombre_area",
    header: "Acceso",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nombre_area")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Estatus",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    enableSorting: true,
  },
/*   {
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
  }, */
  {
    accessorKey: "commentario_area",
    header: "Comentario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("commentario_area")}</div>
    ),
    enableSorting: false,
  },
];