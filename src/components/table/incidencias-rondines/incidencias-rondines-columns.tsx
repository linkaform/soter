import { LoadingModal } from "@/components/modals/loading-modal";
import { AccionesTomadas, AfectacionPatrimonial, Depositos, PersonasInvolucradas } from "@/lib/incidencias";

import { Edit, Eye } from "lucide-react";
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

    seguimientos_incidencia:any[]
		afectacion_patrimonial_incidencia:AfectacionPatrimonial[]
    acciones_tomadas_incidencia: AccionesTomadas[]
    personas_involucradas_incidencia: PersonasInvolucradas[]

    notificacion_incidencia: string
    ubicacion_incidencia: string
    comentario_incidencia: string
    total_deposito_incidencia?: number
    datos_deposito_incidencia: Depositos[]
    _id: string
    evidencia_incidencia?: EvidenciaIncidencum[]
    documento_incidencia?: DocumentoIncidencum[]
    dano_incidencia?: string
    tipo_dano_incidencia?: string[]
    grupo_seguimiento_incidencia: []
    tags:string[]
    estatus:string
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
  

  export interface EvidenciaIncidencum {
    file_name: string
    file_url: string
  }
  
  export interface DocumentoIncidencum {
    file_name: string
    file_url: string
  }
  
  export const OptionsCell: React.FC<{ row: any , onEditarClick: (incidencia: Incidencia_record) => void, onSeguimientoClick: (seguimiento: Incidencia_record)=> void,
    onEliminarClick: (incidencia: Incidencia_record) => void, onView: (incidencia: Incidencia_record) => void
   }> = ({ row, onEditarClick , onView}) => {
    const incidencia = row.original;
    const [showLoadingModal] = useState(false);

    return (
      <div className="flex space-x-2">
        
        <div
          className="cursor-pointer"
          title="Información de la Incidencia"
          onClick={() => {
            onView(incidencia)}}
        >
        	<Eye /> 
        </div>
        
        <LoadingModal isOpen={showLoadingModal} text="Cargando..."/>
        
          <div
            className="cursor-pointer"
            onClick={() => onEditarClick(incidencia)}
            title="Editar Incidencia"
          >
            <Edit />
          </div>


    
        {/* <div
          className="cursor-pointer"
          onClick={() => onSeguimientoClick(incidencia)}
          title="Seguimiento Incidencia"
        >
        	<Check />
        </div> */}
          
        {/* <div
          className="cursor-pointer"
          title="Eliminar Incidencia"
          onClick={() => onEliminarClick(incidencia)}
        >
        	<Trash2 />
        </div> */}

      </div>
    );
  };
