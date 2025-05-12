import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

export interface VehiculoAutorizado {
  tipo_vehiculo: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  placas_vehiculo: string;
  color_vehiculo: string;
}

export const VehiculoAutorizadoColumns: ColumnDef<VehiculoAutorizado>[] = [
  {
    id: "select",
    cell: ({ row }) => {
      console.log("selec", row)
      return (
        <Checkbox
          checked={false}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tipo_vehiculo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.tipo_vehiculo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "marca_vehiculo",
    header: "Marca",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.marca_vehiculo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modelo_vehiculo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.modelo_vehiculo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "placas_vehiculo",
    header: "Matrícula",
    cell: ({ row }) => (
      <div className="uppercase">{row.original.placas_vehiculo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "color_vehiculo",
    header: "Color",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.color_vehiculo}</div>
    ),
    enableSorting: true,
  },
];



