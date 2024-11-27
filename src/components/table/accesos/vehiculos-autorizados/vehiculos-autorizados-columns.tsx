import { ColumnDef } from "@tanstack/react-table";

export interface VehiculoAutorizado {
  tipo: string;
  marca: string;
  modelo: string;
  matricula: string;
  color: string;
}

export const VehiculoAutorizadoColumns: ColumnDef<VehiculoAutorizado>[] = [
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tipo")}</div>
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
    accessorKey: "matricula",
    header: "Matrícula",
    cell: ({ row }) => (
      <div className="uppercase">{row.getValue("matricula")}</div>
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
