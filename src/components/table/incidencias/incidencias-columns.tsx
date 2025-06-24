import { EliminarIncidenciaModal } from "@/components/modals/delete-incidencia-modal";
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
  
  export const OptionsCell: React.FC<{ row: any , onEditarClick: (incidencia: Incidencia_record) => void }> = ({ row, onEditarClick }) => {
    const incidencia = row.original;
    const [showLoadingModal] = useState(false);
    const [openModal, setOpenModal]= useState(false)

    return (
      <div className="flex space-x-2">
        <ViewIncidencia 
          title="Información de la Incidencia"
          data={incidencia} >
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewIncidencia>

        <LoadingModal isOpen={showLoadingModal} text="Cargando..."/>
        
        <div
          className="cursor-pointer"
          onClick={() => onEditarClick(incidencia)}
        >
        	<Edit />
        </div>
    

        <SeguimientoIncidenciaModal
          title="Seguimiento Incidencia"
          folio={incidencia?.folio} isSuccess={openModal} setIsSuccess={setOpenModal}>
          <div className="cursor-pointer">
              <Check />   
          </div>
        </SeguimientoIncidenciaModal>

        <EliminarIncidenciaModal
          title="Eliminar Incidencia" arrayFolios={[incidencia.folio]}>
            <div className="cursor-pointer">
                <Trash2 />   
            </div>
        </EliminarIncidenciaModal>
      </div>
    );
  };

//   export const incidenciasColumns: ColumnDef<Incidencia_record>[] = [
//     {
//       id: "select",
//       cell: ({ row }) => {
//         return (
//           <>
//           <div className="flex space-x-3 items-center">
//             <Checkbox
//               checked={row.getIsSelected()}
//               onCheckedChange={(value) => row.toggleSelected(!!value)}
//               aria-label="Select row" />
//             <OptionsCell row={row} key={row.original._id} onEditarClick={handleEditar}/>
//           </div>
//           </>
//         )
//       },
//       header: ({ table }) => (
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all"
//         />
//       ),
//       enableSorting: false,
//       enableHiding: false,
//     },
//       {
//         accessorKey: "folio",
//         header: "Folio",
//         cell: ({ row }) => (
//         <div className="capitalize">{row.getValue("folio")}</div>
//         ),
//         enableSorting: true,
//       },
//       {
//         accessorKey: "ubicacion_incidencia",
//         header: "Ubicación",
//         cell: ({ row }) => (
//         <div className="capitalize">{row.getValue("ubicacion_incidencia")}</div>
//         ),
//         enableSorting: true,
//       },
//       {
//         accessorKey: "area_incidencia",
//         header: "Lugar del Incidente",
//         cell: ({ row }) => (
//         <div className="capitalize">{row.getValue("area_incidencia")}</div>
//         ),
//         enableSorting: true,
//       },
//       {
//         accessorKey: "incidencia",
//         header: "Incidencia",
//         cell: ({ row }) => (
//         <div className="capitalize">{row.getValue("incidencia")}</div>
//         ),
//         enableSorting: true,
//       },
//      {
//         accessorKey: "fecha_hora_incidencia",
//         header: "Fecha",
//         cell: ({ row }) => (
//         <div className="capitalize">{row.getValue("fecha_hora_incidencia")}</div>
//         ),
//         enableSorting: true,
//       },
//       {
//         accessorKey: "evidencia_incidencia",
//         header: "Evidencia",
//         cell: ({ row }) => {
//         const foto = row.original.evidencia_incidencia;
//         // const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : '/nouser.svg';
//         return(<ViewImage imageUrl={foto ?? []} /> )},
//         enableSorting: false,
//     },
//       {
//         accessorKey: "comentario_incidencia",
//         header: "Comentarios",
//         cell: ({ row }) => {
//         return (
//           <span>{row.getValue("comentario_incidencia")}</span>
//         );
//         },
//         enableSorting: true,
//       },
//       {
//         accessorKey: "reporta_incidencia",
//         header: "Reporta",
//         cell: ({ row }) => (
//         <div>{row.getValue("reporta_incidencia")}</div>
//         ),
//         enableSorting: true,
//       },
    
//     ];