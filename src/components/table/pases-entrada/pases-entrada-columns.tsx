import { Visita } from "@/components/modals/add-pass-modal";
import UpdateFullPassModal from "@/components/modals/update-full-pass";
import { ViewPassModal } from "@/components/modals/view-pass-modal";
import { Areas, Comentarios, enviar_pre_sms, Link } from "@/hooks/useCreateAccessPass";
import { replaceNullsInArrayDynamic } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil} from "lucide-react";
import { useState } from "react";

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
  ubicacion:string;
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
}

const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
  const rowData = row.original;
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la visibilidad del modal

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
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
    comentarios: rowData.grupo_instrucciones_pase||[],
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
        isOpen={isModalOpen}
        closeModal={closeModal}
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
        
      {/* <ResendPassModal title="Reenviar Pase">
      <div className="cursor-pointer">
        <Forward />
      </div>
      </ResendPassModal> */}
    </div>
  );
};

export const pasesEntradaColumns: ColumnDef<PaseEntrada>[] = [
  {
    id: "options",
    header: "Opciones",
    cell: ({row}) => <OptionsCell row={row}/>,
    enableSorting: false,
  },
  {
    accessorKey: "pase",
    header: "Pase",
    cell: ({ row }) => {
      const foto = row.original.foto;
      const nombre = row.original.nombre;
      const estatus = row.original.estatus;
      const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : 'https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067';

      return (
        <div className="flex items-center space-x-4">
          {/* Imagen */}
          <div>
            {primeraImagen ? (
              <img src={primeraImagen} alt="Imagen" className="h-24 w-24 object-cover rounded-full bg-gray-300" />
            ) : (
              <span>No hay imagen</span>
            )}
          </div>

          {/* Nombre */}
          <div className="flex flex-col">
            <span className="font-bold">{nombre}</span>
            <span
              className={estatus === "Activo" ? "text-blue-500" : "text-red-500"}
            >
              {estatus}
            </span>
          </div>
        </div>
      );
    },
    enableSorting: false,  // Deshabilitar el orden para esta columna combinada
  },
  {
    accessorKey: "ubicacion",
    header: "Ubicación",
    cell: ({ row }) => <div>{row.getValue("ubicacion")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "fecha_desde_visita", 
    header: "Fecha de creación", 
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_desde_visita");
      const fechaSinSegundos = fecha ? fecha.slice(0, -3) : "";
      return <div>{fechaSinSegundos}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "fecha_desde_hasta", 
    header: "Vigencia del Pase",  
    cell: ({ row }) => {
      const fecha = row.getValue("fecha_desde_hasta");
      const fechaSinSegundos = fecha ? fecha.slice(0, -3) : "";
      return <div>{fechaSinSegundos}</div>;
    },
    enableSorting: true,
  },

];
