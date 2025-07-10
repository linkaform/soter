import {
  ColumnDef, 
} from "@tanstack/react-table";
import { useState } from "react";
import { Eye } from "lucide-react";
import { LoadingModal } from "@/components/modals/loading-modal";
import { ViewArticuloCon } from "@/components/modals/view-articulo-con";
import { EditArticuloConModal } from "@/components/modals/edit-article-con";
import { DevolucionArticuloConModal } from "@/components/modals/devolucion-article-con-modal";


export interface Articulo_con_record {
    _id:string,
    folio:string,
    ubicacion_concesion:string, 
    fecha_concesion:string,
    caseta_concesion:string,
    area_concesion:string, 
    solicita_concesion: string,
    observacion_concesion:string, 
    nombre_concesion:string,
    fecha_devolucion_concesion:string,
    status_concesion:string,
    persona_nombre_concesion:string
}


const OptionsCell: React.FC<{ row: any }> = ({ row}) => {
  const articulo = row.original;
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  return (
    <div className="flex space-x-2">
      <ViewArticuloCon 
          title="Información del Artículo Concesionado"
          data={articulo} isSuccess={false}>
            <div className="cursor-pointer" title="Ver Artículo">
              <Eye /> 
            </div>
        </ViewArticuloCon>

      <LoadingModal isOpen={showLoadingModal} text="Cargando..."/>

      <EditArticuloConModal 
        title="Editar Artículo Concesionado"
        data={articulo} setShowLoadingModal={setShowLoadingModal} showLoadingModal={showLoadingModal}/>

      <DevolucionArticuloConModal 
        title="Devolver Artículo Concesionado" data={articulo}/>
    </div>
  );
};


export const conColumns: ColumnDef<Articulo_con_record>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: ({ row }) => {
        
        return <OptionsCell row={row} key={row.original._id} />;
      },
      enableSorting: false,
      enableHiding: false,
    },
    // {
    //   id: "select",
    //   cell: ({ row }) => {
    //     return (
    //       <>
    //       <div className="flex space-x-3 items-center">
    //         <Checkbox
    //           checked={row.getIsSelected()}
    //           onCheckedChange={(value) => row.toggleSelected(!!value)}
    //           aria-label="Select row" />
    //         <OptionsCell row={row} key={row.original._id}/>
    //       </div>
    //       </>
    //     )
    //   },
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      accessorKey: "folio",
      header: "Folio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("folio")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "solicita_concesion",
      header: "Solicita",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("solicita_concesion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "nombre_concesion",
      header: "Persona",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("nombre_concesion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fecha_concesion",
      header: "Fecha de la concesion",
      cell: ({ row }) => (
        <div>{row.getValue("fecha_concesion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status_concesion",
      header: "Equipo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status_concesion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "observacion_concesion",
      header: "Observaciones",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("observacion_concesion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fecha_devolucion_concesion",
      header: "Fecha de devolucion",
      cell: ({ row }) => (
        <div>{row.getValue("fecha_devolucion_concesion")}</div>
      ),
      enableSorting: true,
    },
  ];
  