import { AddBadgeModal } from "@/components/modals/add-badge-modal";
import { AddEquipmentModal } from "@/components/modals/add-equipment-modal";
import { AddVehicleModal } from "@/components/modals/add-vehicle-modal";
import { ViewListBitacoraModal } from "@/components/modals/view-bitacora";
import { Areas, Comentarios } from "@/hooks/useCreateAccessPass";
import { Equipo, Vehiculo } from "@/lib/update-pass";
import { formatEquipos, formatVehiculos } from "@/lib/utils";
import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Car, Eye, Hammer, IdCard} from "lucide-react";
import { useState } from "react";


export interface Bitacora_record {
  equipos: Equipo_bitacora[] 
  file_name: string
  fecha_entrada: string
  caseta_entrada: string
  updated_at: string
  motivo_visita: string
  folio: string
  contratista: unknown[]
  foto_url: string
  identificacion_url:string
  id_gafet: string
  ubicacion: string
  perfil_visita: string
  documento: string
  nombre_visitante: string
  visita_a: VisitaA[]
  vehiculos: Vehiculo_bitacora[]
  codigo_qr: string
  status_visita: string
  created_at: string
  file_url: string
  grupo_areas_acceso: Areas_bitacora[] 
  fecha_salida: string
  status_gafete: string
  _id: string
  comentarios: Comentarios_bitacoras[]
}

export type Comentarios_bitacoras={
  tipo_comentario:string;
  comentario:string;
}

export interface Equipo_bitacora {
  color_articulo: string
  numero_serie: string
  modelo_articulo: string
  marca_articulo: string
  tipo_equipo: string
  nombre_articulo: string
}

export interface VisitaA {
  posicion: string
  nombre: string
  user_id: number
  email: string
  departamento: string
}

export interface Vehiculo_bitacora {
  tipo: string
  modelo_vehiculo: string
  color: string
  placas: string
  marca_vehiculo: string
  nombre_estado: string
}
export interface Areas_bitacora {
  note_booth: string
  commentario_area: string
}

const OptionsCell: React.FC<{ row: any , refetch: () => void}> = ({ row, refetch }) => {
  const bitacora = row.original;
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la visibilidad del modal

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  

  // const dataFull= {
  //     file_name:bitacora.file_name,
  //     folio:bitacora.folio ,
  //     fecha_entrada:bitacora.fecha_entrada ,
  //     nombre_visitante:bitacora.nombre_visitante, 
  //     contratista:bitacora.contratista,
  //     status_gafete:bitacora.status_gafete, 
  //     caseta_entrada:bitacora.caseta_entrada,
  //     caseta_salida:bitacora.caseta_salida, 
  //     fecha_salida:bitacora.fecha_salida,
  //     comentarios:bitacora.comentarios||[] , 
  //     equipos: bitacora.equipos, 
  //     vehiculos: bitacora.vehiculos, 
  //     foto: bitacora.foto, 
  //     foto_url: bitacora.foto_url || '', 
  //     identificacion_url: bitacora.file_url || '',
  //     identificacion: bitacora.identificacion, 
  //     documento: bitacora.documento||"" , 
  //     visita_a: bitacora.visita_a||"" , 
  //     perfil_visita: bitacora.perfil_visita||"" ,
  //     _id: bitacora._id, 
  //     motivo_visita:bitacora.motivo_visita, 
  //     grupo_areas_acceso:bitacora.grupo_areas_acceso , 
  //     codigo_qr: bitacora.codigo_qr, 
  //     status_visita:bitacora.status_visita,
  //     id_gafet:bitacora.id_gafet,
  //     updated_at:bitacora.updated_at,
  //     ubicacion: bitacora.ubicacion,
  //     created_at:bitacora.created_at,
  //     file_url: bitacora.file_url
  // }
  return (
    
    <div className="flex space-x-2">

      <ViewListBitacoraModal 
        title="Información de visita"
        data={bitacora} 
        // isOpen={isModalOpen} // Pasa el estado isOpen al modal
        // setIsOpen={setIsModalOpen}
        closeModal={closeModal} // Pasa la función para cerrar el modal
        >
          <div className="cursor-pointer">
            <Eye /> 
          </div>
      </ViewListBitacoraModal>
      
      <AddVehicleModal title="Agregar vehiculo" id={bitacora._id} >
          <div className="cursor-pointer">
            <Car />
          </div>
      </AddVehicleModal>
        
      <AddEquipmentModal title="Agregar equipo" id={bitacora._id} refetchTable={refetch}>
          <div className="cursor-pointer">
            <Hammer />
          </div>
      </AddEquipmentModal>

    <AddBadgeModal title={"Gafete"}  location={""} area={""} status={""}>
      <IdCard />
    </AddBadgeModal>
      {/* <ResendPassModal title="Reenviar Pase">

      <div className="cursor-pointer">
        <Forward />
      </div>

      </ResendPassModal> */}

    </div>
  );
};


export const bitacorasColumns: ColumnDef[] = [
    {
      id: "options",
      header: "Opciones",
      cell: ({row, refetch}) => <OptionsCell row={row}  refetch={refetch}/>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "folio",
      header: "Folio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("folio")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "fecha_entrada",
      header: "Entrada",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fecha_entrada")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "nombre_visitante",
      header: "Visitante",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombre_visitante")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fecha_salida",
      header: "Salida",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fecha_salida")}</div>
      ),
      enableSorting: true,
    },
  
    {
      accessorKey: "perfil_visita",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("perfil_visita")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "contratista",
      header: "Contratista",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("contratista")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "visita_a",
      header: "Visita a",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("visita_a").nombre}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "caseta_entrada",
      header: "Caseta Entrada",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("caseta_entrada")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "caseta_salida",
      header: "Caseta Salida",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("caseta_salida")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "id_gafet",
      header: "Gafete",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id_gafet")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "comentarios",
      header: "Comentarios",
      cell: ({ row }) => {
        const comentarios = row.getValue("comentarios") as Comentarios_bitacoras[];
        return (
          <div className="capitalize">
            {Array.isArray(comentarios) ? (
              <ul className="list-disc pl-5">
                {comentarios.map((comentario, index) => (
                  <li key={index}>{comentario.comentario}</li>
                ))}
              </ul>
            ) : (
              <span>{comentarios}</span>
            )}
          </div>
        );
      },
      enableSorting: true,
    }
  ];