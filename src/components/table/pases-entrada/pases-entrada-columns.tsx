import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";

export interface PaseEntrada {
  folio: string;
  fechaHora: string;
  visitante: string;
  tipoDePase: string;
  motivo: string;
  estatus: string;
}

const OptionsCell: React.FC = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="flex space-x-2">
      <div className="cursor-pointer">
        <Pencil /> {/* Ícono de editar */}
      </div>
      <div className="cursor-pointer">
        <Eye /> {/* Ícono de visualizar */}
      </div>
      <div
        className="cursor-pointer"
        onClick={toggleFavorite} // Cambia el estado al hacer clic
      >
        <Star
          className={`${
            isFavorite ? "text-blue-500 fill-current" : ""
          }`} // Solo azul si está seleccionado
        /> {/* Ícono de favoritos */}
      </div>
      <div className="cursor-pointer">
        <Trash2 /> {/* Ícono de eliminar */}
      </div>
    </div>
  );
};

export const pasesEntradaColumns: ColumnDef<PaseEntrada>[] = [
  {
    id: "options",
    header: "Opciones",
    cell: () => <OptionsCell />, // Usamos el componente para la celda
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "folio",
    header: "Folio",
    cell: ({ row }) => <div>{row.getValue("folio")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "fechaHora",
    header: "Fecha y Hora de Creación",
    cell: ({ row }) => <div>{row.getValue("fechaHora")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "visitante",
    header: "Visitante",
    cell: ({ row }) => <div className="capitalize">{row.getValue("visitante")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "tipoDePase",
    header: "Tipo de Pase",
    cell: ({ row }) => <div className="capitalize">{row.getValue("tipoDePase")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "motivo",
    header: "Motivo",
    cell: ({ row }) => <div className="capitalize">{row.getValue("motivo")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "estatus",
    header: "Estatus",
    cell: ({ row }) => (
      <div
        className={row.getValue("estatus") === "Activo" ? "text-blue-500" : "text-red-500"}
      >
        {row.getValue("estatus")}
      </div>
    ),
    enableSorting: true,
  },
];
