import { EliminarIncidenciaModal } from "@/components/modals/delete-incidencia-modal";
import { EditarIncidenciaModal } from "@/components/modals/editar-incidencia";
import { LoadingModal } from "@/components/modals/loading-modal";
import { ViewIncidencia } from "@/components/modals/view-incidencia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Eye, Trash2 } from "lucide-react";
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
  
  const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
    // const {refetch} = useGetIncidencias("", "",[]);
    const incidencia = row.original;
    const [showLoadingModal, setShowLoadingModal] = useState(false);

    return (
      <div className="flex space-x-2">
        <ViewIncidencia 
          title="Información de la Incidencia"
          data={incidencia} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewIncidencia>

        <LoadingModal isOpen={showLoadingModal} text="Cargando..."/>
        
        <EditarIncidenciaModal
          title="Editar Incidencia"
          data={incidencia} setShowLoadingModal={setShowLoadingModal} />

        <EliminarIncidenciaModal
          title="Eliminar Incidencia" arrayFolios={[incidencia.folio]}>
            <div className="cursor-pointer">
                <Trash2 />   
            </div>
        </EliminarIncidenciaModal>
        {/* <EditarFallaModal
                title="Editar Falla"
                data={incidencia} refetchTableFallas={refetch}>
            <div className="cursor-pointer">
              <Edit /> 
            </div>
        </EditarFallaModal>

        <SeguimientoFallaModal
                title="Seguimiento Falla"
                data={incidencia} refetchTableFallas={refetch}>
            <div className="cursor-pointer">
                <Check />   
            </div>
        </SeguimientoFallaModal>

        <EliminarFallaModal
          title="Eliminar Falla"
          refetchTableFallas={refetch} arrayFolios={[incidencia.folio]}>
            <div className="cursor-pointer">
                <Trash2 />   
            </div>
        </EliminarFallaModal> */}
        
      </div>
    );
  };

  export const incidenciasColumns: ColumnDef<Incidencia_record>[] = [
    {
      id: "select",
      cell: ({ row }) => {
        return (
          <>
          <div className="flex space-x-3 items-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row" />
            <OptionsCell row={row} key={row.original._id}/>
          </div>
          </>
        )
      },
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
		{
			accessorKey: "ubicacion_incidencia",
			header: "Ubicación",
			cell: ({ row }) => (
			<div className="capitalize">{row.getValue("ubicacion_incidencia")}</div>
			),
			enableSorting: true,
		},
		{
			accessorKey: "area_incidencia",
			header: "Lugar del Incidente",
			cell: ({ row }) => (
			<div className="capitalize">{row.getValue("area_incidencia")}</div>
			),
			enableSorting: true,
      	},
     	{
			accessorKey: "fecha_hora_incidencia",
			header: "Fecha",
			cell: ({ row }) => (
			<div className="capitalize">{row.getValue("fecha_hora_incidencia")}</div>
			),
			enableSorting: true,
      	},
      	{
			accessorKey: "evidencia_incidencia",
			header: "Evidencia",
			cell: ({ row }) => {
			const foto = row.original.evidencia_incidencia;
			const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : '/nouser.svg';
			return(
				<>
				<Avatar>
				<AvatarImage src={primeraImagen|| "/nouser.svg"} alt="Avatar" />
				<AvatarFallback>CN</AvatarFallback>
				</Avatar>
				</>
			)},
			enableSorting: false,
     	},
      	{
			accessorKey: "comentario_incidencia",
			header: "Comentarios",
			cell: ({ row }) => {
			return (
				<span>{row.getValue("comentario_incidencia")}</span>
			);
			},
			enableSorting: true,
      	},
      	{
			accessorKey: "reporta_incidencia",
			header: "Reporta",
			cell: ({ row }) => (
			<div>{row.getValue("reporta_incidencia")}</div>
			),
			enableSorting: true,
      	},
      
    ];