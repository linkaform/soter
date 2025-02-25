import { ViewIncidencia } from "@/components/modals/view-incidencia";
import { Checkbox } from "@/components/ui/checkbox";
// import { useGetIncidencias } from "@/hooks/useGetIncidencias";
import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Image from "next/image";

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
    
    return (
      <div className="flex space-x-2">
        <ViewIncidencia 
          title="Información de Incidencia"
          data={incidencia} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewIncidencia>
        
        {/* <AddVehicleModal title="Agregar vehiculo" id={incidencia._id} refetchTable={refetch} >
            <div className="cursor-pointer">
              <Pencil />
            </div>
        </AddVehicleModal>
          
        <AddEquipmentModal title="Agregar equipo" id={incidencia._id} refetchTable={refetch}>
            <div className="cursor-pointer">
              <Trash />
            </div>
        </AddEquipmentModal> */}
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
            <OptionsCell row={row} />
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
      // cell: ({ row }) => (
      //   <div className="flex space-x-3 items-center">
      //   <Checkbox
      //     checked={row.getIsSelected()}
      //     onCheckedChange={(value) => row.toggleSelected(!!value)}
      //     aria-label="Select row"
      //   />

      //  <div className="cursor-pointer">
      //       <Eye />
      //     </div>
    
      //   <div className="cursor-pointer">
      //   <Pencil />
      //   </div>
      //     <div className="cursor-pointer">
      //       <Trash2 />
      //     </div>

      //   </div>

      // ),
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
              <div className="relative h-24 w-28">
                <Image
                  src={primeraImagen|| "/nouser.svg"}
                  alt="Fotografía"
                  fill
                  className="object-cover"
                />
              </div>
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