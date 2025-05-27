import { capitalizeFirstLetter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type Imagen = {
  file_name: string;
  file_url: string;
};

export interface PaseEntrada {
  folio: string;
  _id: string;
  nombre: string;
  email:string;
  telefono: string;
  fecha_desde_hasta:string;
  fecha_desde_visita:string;
  tipo_de_pase:string;
  motivo_visita: string;
  estatus:string;
  tema_cita:string;
  descripcion:string;
  visita_a: string[];
  ubicacion:string;
  fotografia: Imagen[];
  identificacion: Imagen[];
  enviar_correo_pre_registro: string[];
  enviar_correo: string[];
  config_dia_de_acceso: string;
  tipo_fechas_pase: string;
  tipo_visita : string;
  limite_de_acceso: string;
  grupo_instrucciones_pase: string[];  
  grupo_vehiculos: string[];  
  grupo_equipos: string[]; 
  grupo_areas_acceso : string[];
  limitado_a_dias : string[]; 
  qr_pase: string[];
  archivo_invitacion: string[];
  link: string;

}

// const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
//   const rowData = row.original;
//   return (
//     <div className="flex space-x-2">
//     </div>
//   );
// };

export const pasesEntradaColumns: ColumnDef<PaseEntrada>[] = [
  {
    accessorKey: "pase",
    header: "Pase",
    cell: ({ row }) => {
      const foto = row.original.fotografia;
      console.log("fila",row.original)
      const estatus = row.original.estatus ?? "Activo";
      const nombre = row.original.nombre;
      const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : '/nouser.svg';

      return (
        <div className="flex items-center space-x-4">
          <div>
            {primeraImagen ? (
              <Image width={150} height={150} src={primeraImagen} className="h-16 w-16 object-cover rounded-full bg-gray-300" alt={""} />
            ) : null}
          </div>

          <div className="flex flex-col">
            <span className="font-bold">{nombre}</span>
            <div>
					<Badge
					className={`text-white text-md ${
						estatus.toLowerCase() == "vencido"
						? "bg-red-600 hover:bg-red-600"
						: estatus.toLowerCase() == "activo"
						? "bg-green-600 hover:bg-green-600"
						: estatus.toLowerCase() == "proceso"
						? "bg-blue-600 hover:bg-blue-600"
						: "bg-gray-400"
					}`}
					>
					{capitalizeFirstLetter(estatus)}
					</Badge>
				</div>
          </div>
        </div>
      );
    },
    enableSorting: false,  // Deshabilitar el orden para esta columna combinada
  },

];
