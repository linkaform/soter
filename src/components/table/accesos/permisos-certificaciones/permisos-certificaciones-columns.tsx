import { ColumnDef } from "@tanstack/react-table";

export interface PermisosCertificaciones {
  permiso: string;
  estatus: string;
}

export const PermisosCertificacionesColumns: ColumnDef<PermisosCertificaciones>[] = [
  {
    accessorKey: "nombre_certificacion",
    header: "Permiso/Certificación",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nombre_certificacion")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "tipo_vigencia",
    header: "Estatus",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipo_vigencia")}</div>
    ),
    enableSorting: true,
  },
];

