import { AddBadgeModal } from "@/components/modals/add-badge-modal";
import { AddEquipmentModal } from "@/components/modals/add-equipment-modal";
import { AddVehicleModal } from "@/components/modals/add-vehicle-modal";
import { DoOutModal } from "@/components/modals/do-out-modal";
import { ReturnGafeteModal } from "@/components/modals/return-gafete-modal";
import { ViewListBitacoraModal } from "@/components/modals/view-bitacora";
import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Car, Eye, Forward, Hammer, IdCard} from "lucide-react";
import { useState } from "react";


export interface Bitacora_record {
  equipos: Equipo_bitacora[] 
  file_name: string
  fecha_entrada: string
  caseta_salida: string
  caseta_entrada: string
  updated_at: string
  motivo_visita: string
  folio: string
  contratista: unknown[]
  foto_url: string
  identificacion_url:string
  id_locker: string
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

  
  console.log("bitacorea", bitacora.id_gafete)
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
      
      <AddVehicleModal title="Agregar vehiculo" id={bitacora._id} refetchTable={refetch} >
          <div className="cursor-pointer">
            <Car />
          </div>
      </AddVehicleModal>
        
      <AddEquipmentModal title="Agregar equipo" id={bitacora._id} refetchTable={refetch}>
          <div className="cursor-pointer">
            <Hammer />
          </div>
      </AddEquipmentModal>

    { bitacora.id_gafet || bitacora.id_locker ? (
      <ReturnGafeteModal title={"Recibir Gafete"} refetchTable={refetch} id_bitacora={bitacora._id}
        ubicacion={bitacora.ubicacion} area={bitacora.status_visita.toLowerCase() == "entrada" ? bitacora.caseta_entrada : bitacora.caseta_salida || ""} 
        fecha_salida={bitacora.fecha_salida} gafete={bitacora.id_gafet} locker={bitacora.id_locker||""} tipo_movimiento={bitacora.status_visita.toLowerCase()}> 
        <IdCard />
      </ReturnGafeteModal>
     ):(
      <AddBadgeModal title={"Gafete"} status={"Disponible"} refetchTable={refetch} id_bitacora= {bitacora._id}
      tipo_movimiento={bitacora.status_visita} ubicacion={bitacora.ubicacion} area={bitacora.status_visita.toLowerCase()=="entrada" ? bitacora.caseta_entrada: bitacora.caseta_salida||""}>
        <IdCard />
      </AddBadgeModal>
    )
    }
      

    { !bitacora.fecha_salida ? (
      <DoOutModal title={"Registar Salida"} refetchTable={refetch} id_bitacora={bitacora._id} ubicacion={bitacora.ubicacion} 
        area={bitacora.status_visita.toLowerCase() == "entrada" ? bitacora.caseta_entrada : bitacora.caseta_salida || ""} fecha_salida={bitacora.fecha_salida}>
          <Forward />
        </DoOutModal>
    ):null}
      

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
      cell: ({ row, table }) => {
        const { refetch } = table.options.meta; 
        return <OptionsCell row={row} refetch={refetch} />;
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   accessorKey: "folio",
    //   header: "Folio",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("folio")}</div>
    //   ),
    //   enableSorting: true,
    //   enableHiding: true,
    // },
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
    // {
    //   accessorKey: "id_gafet",
    //   header: "Gafete",
    //   cell: ({ row }) => (
    //     <div className="capitalize">{row.getValue("id_gafet")}</div>
    //   ),
    //   enableSorting: true,
    // },
    {
      accessorKey: "id_gafet",
      header: "Gafete",
      cell: ({ row }) => {
        const statusGafete = row.getValue("status_gafete")!==""? row.getValue("status_gafete"):"";
        const isEntregado = statusGafete.toLowerCase() == "entregado";
    
        return (
          <div
            className={`capitalize ${isEntregado ? "text-red-500" : ""}`}
          >
            {isEntregado ? statusGafete.toLowerCase() : row.getValue("id_gafet")}
          </div>
        );
      },
      enableSorting: true,
    },
    
    {
      accessorKey: "id_locker",
      header: "Locker",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("id_locker")}</div>
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