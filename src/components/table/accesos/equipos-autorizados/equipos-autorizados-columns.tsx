import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";



export const EquipoAutorizadoColumns: ColumnDef<any>[] = [
  {
    id: "select", 
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tipo_equipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.tipo_equipo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "nombre_articulo",
    header: "Equipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.nombre_articulo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "marca_articulo",
    header: "Marca",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.marca_articulo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modelo_articulo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.modelo_articulo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "numero_serie",
    header: "No. Serie",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.numero_serie}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "color_articulo",
    header: "Color",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.color_articulo}</div>
    ),
    enableSorting: true,
  },
];


