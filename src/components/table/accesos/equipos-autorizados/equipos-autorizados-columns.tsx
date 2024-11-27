import { ColumnDef } from "@tanstack/react-table";

export interface EquipoAutorizado {
  tipo: string;
  equipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  color: string;
}

export const EquipoAutorizadoColumns: ColumnDef<EquipoAutorizado>[] = [
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipo")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "equipo",
    header: "Equipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("equipo")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("marca")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("modelo")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "numeroSerie",
    header: "No. Serie",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("numeroSerie")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("color")}</div>
    ),
    enableSorting: true,
  },
];
