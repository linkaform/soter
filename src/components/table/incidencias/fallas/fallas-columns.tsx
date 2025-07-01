
import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Edit, Eye, Trash2 } from "lucide-react";
import { Imagen } from "@/lib/update-pass";
import { ViewFalla } from "@/components/modals/view-falla";
import ViewImage from "@/components/modals/view-image";

  export interface Fallas_record{
    falla_responsable_solucionar_nombre: string
    folio: string
    falla_documento: Imagen[]
    falla_reporta_departamento: any
    falla_estatus: string
    falla_caseta: string
    falla: string
    falla_objeto_afectado:string
    falla_responsable_solucionar_documento?: [string, any[]]
    falla_evidencia: Imagen[]
    falla_ubicacion: string
    falla_comentarios: string
    _id: string
    falla_fecha_hora: string
    falla_reporta_nombre: string
    falla_grupo_seguimiento_formated?: FallaGrupoSeguimiento[]
    falla_folio_accion_correctiva?: string
    falla_evidencia_solucion?: any[]
    falla_documento_solucion?: any[]
    falla_comentario_solucion?: string
  }

  export interface FallaGrupoSeguimiento {
    accion_correctiva: string
    comentario: string
    evidencia: Imagen[]
    documento: Imagen[]
    fecha_inicio: string
    fecha_fin: string
  }

  const OptionsCell: React.FC<{ row: any , onEditarClick: (incidencia: Fallas_record) => void , 
  onSeguimientoClick: (falla: Fallas_record) => void , onEliminarClick: (falla: Fallas_record) => void }> = ({ row, onEditarClick, onSeguimientoClick ,onEliminarClick}) => {
    const falla = row.original;
    return (
      <div className="flex space-x-2">
        <ViewFalla 
          title="Información de la Falla"
          data={falla} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewFalla>
        
        {/* <LoadingModal isOpen={showLoadingModal} text="Cargando..."/> */}

        <div
          className="cursor-pointer"
          onClick={() => {
            onEditarClick(falla)}}
        >
        	<Edit />
        </div>
    
        <div
          className="cursor-pointer"
          onClick={() => {
            onSeguimientoClick(falla)}}
        >
        	<Check />
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            onEliminarClick(falla)}}
        >
        	<Trash2 />
        </div>

       
      </div>
    );
  };

  export const getFallasColumns = (onEdit: (falla: Fallas_record) => void, 
  onSeguimientoClick: (falla: Fallas_record) => void, onEliminarClick: (falla: Fallas_record) => void): ColumnDef<Fallas_record>[] => [
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
            <OptionsCell row={row} key={row.original._id} onEditarClick={() => onEdit(row.original)} 
              onSeguimientoClick={()=>onSeguimientoClick(row.original)} onEliminarClick={()=>{onEliminarClick(row.original)}}/>
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
      accessorKey: "folio",
      header: "Folio",
      cell: ({ row }) => (
      <div className="capitalize">{row.getValue("folio")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla_fecha_hora",
      header: "Fecha y hora",
      cell: ({ row }) => (
        <div>{row.getValue("falla_fecha_hora")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla_estatus",
      header: "Estado",
      cell: ({ row }) => {
        const isAbierto = row.getValue("falla_estatus") === "abierto";

        return (
          <div className={`capitalize font-semibold ${isAbierto ? 'text-green-600' : 'text-red-600'}`}>
            {row.getValue("falla_estatus")}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "falla_caseta",
      header: "Lugar del fallo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla_caseta")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla",
      header: "Falla",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla_evidencia",
      header: "Evidencia",
      cell: ({ row }) => {
        const foto = row.original?.falla_evidencia;
        return(<ViewImage imageUrl={foto ?? []} /> )},
      enableSorting: false,
    },
    {
      accessorKey: "falla_comentarios",
      header: "Comentarios",
      cell: ({ row }) => {
        return (
          <div className="capitalize">
            {row.getValue("falla_comentarios")}
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "falla_reporta_nombre",
      header: "Reporta",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla_reporta_nombre")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla_responsable_solucionar_nombre",
      header: "Responsable",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla_responsable_solucionar_nombre")}</div>
      ),
      enableSorting: true,
    },
  ];
  