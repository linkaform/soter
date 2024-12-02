import { ResendPassModal } from "@/components/modals/resend-pass-modal";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Forward, Pencil, Star} from "lucide-react";
import { useState } from "react";

export interface PaseEntrada {
  folio: string;
  fechaHora: string;
  vigenciaPase: string;
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

       {/* Ícono de favoritos */}
       <div
        className="cursor-pointer"
        onClick={toggleFavorite} // Cambia el estado al hacer clic
      >
        <Star
          className={`${
            isFavorite ? "text-yellow-500 fill-current" : ""
          }`} 
        /> 
      </div>

        {/* Ícono de visualizar */}
        <div className="cursor-pointer">
        <Eye />
      </div>

      
      {/* Ícono de editar */}
      <div className="cursor-pointer">
        <Pencil /> 
      </div>

     
     

      {/* Ícono de reenviar */}

      <ResendPassModal title="Reenviar Pase">

      <div className="cursor-pointer">
        <Forward />
      </div>

      </ResendPassModal>

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
    accessorKey: "vigenciaPase",
    header: "Vigencia del Pase",
    cell: ({ row }) => <div>{row.getValue("vigenciaPase")}</div>,
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
