import { SeguimientoIncidenciaModal } from "@/components/modals/seguimiento-incidencia";
import { LoadingModal } from "@/components/modals/loading-modal";
import { ViewIncidencia } from "@/components/modals/view-incidencia";

import { Check, Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

export type Incidencia = {
    id: string;
    nombre: string;
    articulo: string;
    fotografia: string;
    color: string;
    categoria: string;
    fechaHallazgo: string;
    areaResguardo: string;
    reporta: string;
    fechaDevolucion: string;
    comentarios: string[]
  };
    
  export interface Incidencia_record {
    incidencia: string
    folio: string
    reporta_incidencia: string
    prioridad_incidencia: string
    area_incidencia: string
    fecha_hora_incidencia: string
    acciones_tomadas_incidencia: AccionesTomadasIncidencum[]
    personas_involucradas_incidencia: PersonasInvolucradasIncidencum[]
    notificacion_incidencia: string
    ubicacion_incidencia: string
    comentario_incidencia: string
    total_deposito_incidencia?: number
    datos_deposito_incidencia: DatosDepositoIncidencum[]
    _id: string
    evidencia_incidencia?: EvidenciaIncidencum[]
    documento_incidencia?: DocumentoIncidencum[]
    dano_incidencia?: string
    tipo_dano_incidencia?: string[]
    grupo_seguimiento_incidencia: []

    //Categoria
    categoria:string
    sub_categoria:string
    incidente:string

    //Persona extraviada
    nombre_completo_persona_extraviada:string,
    edad:string ,
    color_piel:string
    color_cabello:string
    estatura_aproximada:string
    descripcion_fisica_vestimenta:string
    nombre_completo_responsable:string
    parentesco:string
    num_doc_identidad:string
    telefono:string
    info_coincide_con_videos:string
    responsable_que_entrega:string
    responsable_que_recibe:string
  
    //Robo de cableado
    valor_estimado:string
    pertenencias_sustraidas:string
    //robo de vehiculo
    placas:string
    tipo:string
    marca:string
    modelo:string
    color:string
  }
  

  export interface AccionesTomadasIncidencum {
    acciones_tomadas: string
    responsable_accion: string
  }
  
  export interface PersonasInvolucradasIncidencum {
    nombre_completo: string
    tipo_persona: string
  }
  
  export interface DatosDepositoIncidencum {
    tipo_deposito: string
    cantidad: number
  }
  
  export interface EvidenciaIncidencum {
    file_name: string
    file_url: string
  }
  
  export interface DocumentoIncidencum {
    file_name: string
    file_url: string
  }
  
  export const OptionsCell: React.FC<{ row: any , onEditarClick: (incidencia: Incidencia_record) => void, 
    onEliminarClick: (incidencia: Incidencia_record) => void
   }> = ({ row, onEditarClick ,onEliminarClick}) => {
    const incidencia = row.original;
    const [showLoadingModal] = useState(false);
    const [openModal, setOpenModal]= useState(false)

    return (
      <div className="flex space-x-2">
        <ViewIncidencia 
          title="Información De La Incidencia"
          data={incidencia} >
            <div className="cursor-pointer" title="Ver Incidencia">
              <Eye /> 
            </div>
        </ViewIncidencia>

        <LoadingModal isOpen={showLoadingModal} text="Cargando..."/>
        
        <div
          className="cursor-pointer"
          onClick={() => onEditarClick(incidencia)}
          title="Editar Incidencia"
        >
        	<Edit />
        </div>
    

        <SeguimientoIncidenciaModal
          title="Seguimiento Incidencia"
          folio={incidencia?.folio} isSuccess={openModal} setIsSuccess={setOpenModal}>
          <div className="cursor-pointer" title="Seguimiento Incidencia">
              <Check />   
          </div>
        </SeguimientoIncidenciaModal>


        <div
          className="cursor-pointer"
          title="Eliminar Incidencia"
          onClick={() => onEliminarClick(incidencia)}
        >
        	<Trash2 />
        </div>

      </div>
    );
  };
