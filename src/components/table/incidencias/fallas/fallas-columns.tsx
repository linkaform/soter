
import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Eye } from "lucide-react";
import Image from "next/image";
import { Imagen } from "@/lib/update-pass";
import { ViewFalla } from "@/components/modals/view-falla";

  export interface Fallas_record{
    falla_responsable_solucionar_nombre: string
    folio: string
    falla_documento: Imagen[]
    falla_reporta_departamento: any
    falla_estatus: string
    falla_caseta: string
    falla: string
    falla_responsable_solucionar_documento?: [string, any[]]
    falla_evidencia: Imagen[]
    falla_ubicacion: string
    falla_comentarios: string
    _id: string
    falla_fecha_hora: string
    falla_reporta_nombre: string
    falla_grupo_seguimiento?: FallaGrupoSeguimiento[]
    falla_folio_accion_correctiva?: string
    falla_evidencia_solucion?: any[]
    falla_documento_solucion?: any[]
    falla_comentario_solucion?: string
  }

  export interface FallaGrupoSeguimiento {
    "679a485c66c5d089fa6b8efa": string
    "66f2dfb2c80d24e5e82332b4": string
    "66f2dfb2c80d24e5e82332b5": Imagen[]
    "66f2dfb2c80d24e5e82332b6": Imagen[]
    "66f2dfb2c80d24e5e82332b3": string
    "679a485c66c5d089fa6b8ef9": string
  }

  const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
    // const {refetch} = useGetIncidencias("", "",[]);
    const incidencia = row.original;
    
    return (
      <div className="flex space-x-2">
        <ViewFalla 
          title="Información de la Falla"
          data={incidencia} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewFalla>
        
        {/* <EditarFallaModal
          title="Editar Falla"
          data={incidencia} isSuccess={false} >
            <div className="cursor-pointer">
              <Edit /> 
            </div>
        </EditarFallaModal> */}


        <div className="cursor-pointer">
              	<Edit />
            </div>

        	{/* <div className="cursor-pointer">
              	<Eye />
            </div>
            <div className="cursor-pointer">
            	<Check />                    
			    </div>
            <div className="cursor-pointer">
              	<Edit />
            </div>
            <div className="cursor-pointer">
              	<Trash2 />
            </div> */}
      </div>
    );
  };

  export const fallasColumns: ColumnDef<Fallas_record>[] = [
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
      //     <div className="cursor-pointer">
      //     <Check />                    </div>
      //     <div className="cursor-pointer">
      //       <Edit />
      //     </div>
      //     <div className="cursor-pointer">
      //       <Trash2 />
      //     </div>

      //   </div>

      // ),
      enableSorting: false,
      enableHiding: false,
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
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla_estatus")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "falla_ubicacion",
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("falla_ubicacion")}</div>
      ),
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
        const foto = row.original.falla_evidencia;
        const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : '/nouser.svg';
        return(
            <Image
              src={primeraImagen|| "/nouser.svg"}
              alt="Fotografía"
              width={80}
              height={80}
              className="object-cover"
            />
        )},
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
  