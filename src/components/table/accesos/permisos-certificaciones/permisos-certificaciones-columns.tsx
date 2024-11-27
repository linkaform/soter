import { ColumnDef } from "@tanstack/react-table";

export interface PermisosCertificaciones {
  permiso: string;
  estatus: string;
}

export const PermisosCertificacionesColumns: ColumnDef<PermisosCertificaciones>[] = [
  {
    accessorKey: "permiso",
    header: "Permiso/Certificación",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("permiso")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => (
      <div
        className={`capitalize ${
          row.getValue("estatus") === "Vencido"
            ? "text-red-500"
            : "text-green-500"
        }`}
      >
        {row.getValue("estatus")}
      </div>
    ),
    enableSorting: true,
  },
];
