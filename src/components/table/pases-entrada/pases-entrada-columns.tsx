/* eslint-disable @typescript-eslint/no-explicit-any */
import UpdateFullPassModal from "@/components/modals/update-full-pass";
import { ViewPassModal } from "@/components/modals/view-pass-modal";
import { Areas, Comentarios, enviar_pre_sms, Link } from "@/hooks/useCreateAccessPass";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { capitalizeFirstLetter, replaceNullsInArrayDynamic } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Imagen = {
  file_name: string;
  file_url: string;
};

export interface PaseEntrada {
  _id: string;
  folio: string;
  nombre: string;
  email:string;
  telefono: string;
  ubicacion:string[];
  tema_cita:string;
  descripcion:string;
  perfil_pase:string;
  status_pase:string;
  visita_a: unknown;
  custom:boolean;
  link: Link;
  qr_pase: string[];
  limitado_a_dias : string[]; 
  foto: Imagen[];
  identificacion: Imagen[];
  enviar_correo_pre_registro: string[];
  tipo_visita_pase:string;
  fechaFija:string;
  fecha_desde_visita:string;
  fecha_desde_hasta:string;
  config_dia_de_acceso: string;
  config_dias_acceso: string;
  config_limitar_acceso:string;
  motivo_visita: string;
  estatus:string;
  areas:Areas[]
  comentarios:Comentarios[]
  enviar_pre_sms:enviar_pre_sms[]
  grupo_vehiculos: string[];  
  grupo_equipos: string[]; 
  total_entradas?: number;
  limite_de_acceso?: number;
}

const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
  const rowData = row.original;
  console.log("Option cell", rowData.ubicacion)
  const dataFull= {
    _id:rowData._id,
    folio:rowData.folio,
    nombre: rowData.nombre,
    email: rowData.email,
    telefono: rowData.telefono,
    ubicacion: rowData.ubicacion,
    tema_cita: rowData.tema_cita,
    descripcion: rowData.descripcion,
    perfil_pase: rowData.tipo_de_pase,
    status_pase: rowData.estatus,
    visita_a: rowData.visita_a[0]||[{}],
    custom: false,
    link: {
      link: rowData.link,
      docs: rowData.docs,
      creado_por_id: rowData.visita_a.lenght>0 ? rowData.visita_a[0].user_id:null,
      creado_por_email:rowData.visita_a.lenght>0  ? rowData.visita_a[0].email:null
    },
    qr_pase	:rowData.qr_pase,
    limitado_a_dias	: rowData.limitado_a_dias	,
    foto:rowData.foto || [],
    identificacion:rowData.identificacion || [],
    enviar_correo_pre_registro: rowData.enviar_correo_pre_registro||[],
    tipo_visita_pase: rowData.tipo_fechas_pase,
    fechaFija: rowData.fechaFija || rowData.fecha_desde_visita,
    fecha_desde_visita: rowData.fecha_desde_visita,
    fecha_desde_hasta: rowData.fecha_desde_hasta,
    config_dia_de_acceso: rowData.config_dia_de_acceso,
    config_dias_acceso: rowData.limitado_a_dias,
    config_limitar_acceso: rowData.limite_de_acceso,
    areas: replaceNullsInArrayDynamic(rowData.grupo_areas_acceso),
    comentarios: rowData.comentarios||[],
    enviar_pre_sms: {
      from: rowData.from || "",
      mensaje: rowData.mensaje || "",
      numero: rowData.numero || "",
    },
    grupo_equipos: rowData.grupo_equipos||[],
    grupo_vehiculos: rowData.grupo_vehiculos||[],
  }
  return (
    <div className="flex space-x-2">
      <ViewPassModal 
        title="Pase de entrada"
        data={dataFull} 
        isSuccess={false} 
        >
          <div className="cursor-pointer">
            <Eye /> 
          </div>
      </ViewPassModal>
      
      <UpdateFullPassModal dataPass={dataFull}>
        <div className="cursor-pointer">
            <Pencil />
          </div>
      </UpdateFullPassModal>
    </div>
  );
};

export const pasesEntradaColumns: ColumnDef<PaseEntrada>[] = [
  {
    id: "options",
    header: "Opciones",
    cell: ({row}) => <OptionsCell row={row} key={row.original._id}/>,
    enableSorting: false,
  },
  {
    accessorKey: "pase",
    header: "Pase",
    cell: ({ row }) => {
      const foto = row.original.foto;
      const nombre = row.original.nombre;
      const estatus = row.original.estatus;
      const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : '/nouser.svg';

      return (
        <div className="flex items-center space-x-4">
        <div>
          {primeraImagen ? (
            <>
            <Avatar>
              <AvatarImage src={primeraImagen} alt="Avatar" className="object-cover"/>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </>
          ) : (
          <span>No hay imagen</span>
          )}
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
    enableSorting: false, 
  },
  {
    accessorKey: "ubicacion",
    header: "Ubicación",
    cell: ({ row }) => {
    	return (
        <div className="w-full flex gap-2">
          <div className="relative group w-full break-words">
            {Array.isArray(row.original?.ubicacion) && row.original.ubicacion.length > 0 ? row.original.ubicacion[0] : ""}
            {Array.isArray(row.original?.ubicacion) && row.original.ubicacion.length > 1 && (
            <span className="text-blue-600 cursor-pointer ml-1 underline relative">
              +{row.original?.ubicacion.length - 1}
              {/* Tooltip container */}
              <div className="absolute left-0 top-full z-10 mt-1 hidden w-max max-w-xs rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-lg group-hover:block">
              {Array.isArray(row.original?.ubicacion) && row.original.ubicacion.length > 1 && (
                row.original.ubicacion.slice(1).map((ubic:string, idx:number) => (
                  <div key={idx}>{ubic}</div>
                ))
                )}
              </div>
            </span>
            )}
          </div>
      </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "folio",
    header: "Folio",
    cell: ({ row }) => <div>{row.getValue("folio")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "fecha_desde_visita", 
    header: "Fecha de creación", 
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_desde_visita");
      const fechaSinSegundos = typeof fecha === 'string' ? fecha.slice(0, -3) : '';
      return <div>{fechaSinSegundos}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "fecha_desde_hasta", 
    header: "Vigencia del Pase",  
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_desde_hasta");
      const fechaSinSegundos = typeof fecha === 'string' ? fecha.slice(0, -3) : '';
      return <div>{fechaSinSegundos}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "limite_de_acceso",
    header: "Limite de Entradas",
    cell: ({ row }) => {
      const total_entradas = row.original.total_entradas;
      const limite_entradas = row.original.limite_de_acceso ?? 1;
      return <div>{total_entradas} / {limite_entradas}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "limitado_a_dias",
    header: "Días de acceso",
    cell: ({ row }) => {
      const dias = row.original.limitado_a_dias;
  
      if (!dias || dias.length === 0) {
        return <span className="text-gray-400 italic">Todos los días</span>;
      }
  
      return (
        <div className="flex flex-wrap gap-1">
          {dias.map((dia, index) => (
            <Badge
              key={index}
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              {dia}
            </Badge>
          ))}
        </div>
      );
    },
  },

];
