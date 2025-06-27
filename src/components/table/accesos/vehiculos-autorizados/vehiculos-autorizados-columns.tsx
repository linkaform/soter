/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Vehiculo } from "@/lib/update-pass-full";
import { useAccessStore } from "@/store/useAccessStore";

export interface VehiculoAutorizado {
  tipo_vehiculo: string;
  marca_vehiculo: string;
  modelo_vehiculo: string;
  placas_vehiculo: string;
  color_vehiculo: string;
}

export const VehiculoAutorizadoColumns: ColumnDef<Vehiculo>[] = [
  {
    id: "select",
    cell: ({ row }) => {
      const vehiculo = row?.original;
      const selectedVehiculos = useAccessStore((state) => state.selectedVehiculos);
      const setSelectedVehiculos = useAccessStore((state) => state.setSelectedVehiculos);
      const tipoMovimiento = useAccessStore((state) => state.tipoMovimiento);
      const isSelected =
        JSON.stringify(selectedVehiculos[0]) === JSON.stringify(vehiculo);
    
      const handleCheckedChange = () => {
        setSelectedVehiculos([vehiculo]);
      };
      return (
        <Checkbox
          className="p-0 m-0 flex"
          checked={isSelected}
          onCheckedChange={handleCheckedChange}
          aria-label="Select vehicle row"
          disabled={tipoMovimiento=="Salida"}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: ({ row }) => (
      <div className="capitalize">{row?.original.tipo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => (
      <div className="capitalize">{row?.original.marca}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modelo_vehiculo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="capitalize">{row?.original.modelo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "placas",
    header: "Matrícula",
    cell: ({ row }) => (
      <div className="uppercase">{row?.original.placas}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="capitalize">{row?.original.color}</div>
    ),
    enableSorting: true,
  },
];



