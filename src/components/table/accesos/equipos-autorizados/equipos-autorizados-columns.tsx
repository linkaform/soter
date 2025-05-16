/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Equipo } from "@/lib/update-pass-full";
import { useAccessStore } from "@/store/useAccessStore";

export const EquipoAutorizadoColumns: ColumnDef<Equipo>[] = [
  {
    id: "select", 
    cell: ({ row }) => {
      const equipo = row.original;
      const tipoMovimiento = useAccessStore((state) => state.tipoMovimiento);
      const selectedEquipos = useAccessStore((state) => state.selectedEquipos);
      const setSelectedEquipos = useAccessStore((state) => state.setSelectedEquipos);
  
      const equipoStr = JSON.stringify(equipo);
      const isSelected = selectedEquipos.some((e) => JSON.stringify(e) === equipoStr);

      const handleCheckedChange = (value: boolean) => {
        row.toggleSelected(value); // Esto actualiza la selección visual en la tabla
  
        const nuevos = value
          ? [...selectedEquipos, equipo] 
          : selectedEquipos.filter((e) => JSON.stringify(e) !== equipoStr); 
  
        setSelectedEquipos(nuevos);
      };
      console.log("row selected", row.getIsSelected())
      return (
        <Checkbox
          className="p-0 m-0 flex"
          checked={isSelected}
          onCheckedChange={handleCheckedChange}
          aria-label="Select row"
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
      <div className="capitalize">{row.original.tipo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "nombre",
    header: "Equipo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.nombre}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "marca",
    header: "Marca",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.marca}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "modelo",
    header: "Modelo",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.modelo}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "serie",
    header: "No. Serie",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.serie}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.color}</div>
    ),
    enableSorting: true,
  },
];


