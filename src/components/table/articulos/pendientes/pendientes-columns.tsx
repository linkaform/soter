import {
  ColumnDef, 
} from "@tanstack/react-table";
import { Imagen } from "@/lib/update-pass";
import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ViewArticulo } from "@/components/modals/view-articulo";
import { Eye } from "lucide-react";
import { EditarArticuloModal } from "@/components/modals/editar-article-modal";
import { LoadingModal } from "@/components/modals/loading-modal";
import { DevolucionArticuloModal } from "@/components/modals/devolucion-article-modal";


export interface Articulo_perdido_record {
  articulo_seleccion: string
  area_perdido: string
  folio: string
  color_perdido: string
  ubicacion_perdido: string
  foto_perdido: Imagen[]
  tipo_articulo_perdido: string
  comentario_perdido: string
  estatus_perdido: string
  quien_entrega: string
  locker_perdido: string
  quien_entrega_interno: string
  quien_entrega_externo: string
  descripcion: string
  date_hallazgo_perdido: string
  _id: string
  articulo_perdido: string
  identificacion_recibe_perdido: Imagen[]
  telefono_recibe_perdido: string
  foto_recibe_perdido: Imagen[]
  date_entrega_perdido: string
  recibe_perdido: string
}


const OptionsCell: React.FC<{ row: any }> = ({ row}) => {
  const articulo = row.original;
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  return (
    <div className="flex space-x-2">
		<ViewArticulo 
          title="Información del Artículo"
          data={articulo} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewArticulo>

		<LoadingModal isOpen={showLoadingModal} text="Cargando..."/>
		
		<EditarArticuloModal 
        title="Editar Artículo"
        data={articulo} setShowLoadingModal={setShowLoadingModal} showLoadingModal={showLoadingModal}/>

		<DevolucionArticuloModal 
        title="Devolver Artículo"
        data={articulo} />

    </div>
  );
};


export const pendientesColumns: ColumnDef<Articulo_perdido_record>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: ({ row }) => {
        
        return <OptionsCell row={row} key={row.original._id} />;
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "articulo_perdido",
      header: "Nombre",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("articulo_perdido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "articulo_seleccion",
      header: "Artículo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("articulo_seleccion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey:"foto_perdido",
      header:"Fotografía",
      cell: ({ row }) => {
		const foto = row.original.foto_perdido;
        const ultimaImagen = foto && foto.length > 0 ? foto[foto.length - 1].file_url : '/nouser.svg'; 
        return(
          <>
          <Avatar>
            <AvatarImage src={ultimaImagen|| "/nouser.svg"} alt="Avatar" style={{ objectFit: 'cover', width: '100%', height: '100%' }}/>
          </Avatar>
          </>
        )},
        enableSorting: false,
    },
    {
      accessorKey: "color_perdido",
      header: "Color",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("color_perdido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "tipo_articulo_perdido",
      header: "Categoría",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tipo_articulo_perdido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "date_hallazgo_perdido",
      header: "Fecha del hallazgo",
      cell: ({ row }) => (
        <div>{row.getValue("date_hallazgo_perdido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "locker_perdido",
      header: "Área de Resguardo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("locker_perdido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "quien_entrega_externo",
      header: "Reporta",
      cell: ({ row }) => {
		return (
			<div className="capitalize">{row.original.quien_entrega_externo!=="" ? row.original.quien_entrega_externo: row.original.quien_entrega_interno }</div>
		  )
	  },
      enableSorting: true,
    },
    {
      accessorKey: "date_entrega_perdido",
      header: "Fecha de Devolución",
      cell: ({ row }) => (
        <div>{row.getValue("date_entrega_perdido")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "comentario_perdido",
      header: "Comentarios",
      cell: ({ row }) => {
        const comentarios = row.getValue("comentario_perdido") as string[];
        return (
          <div className="capitalize">
            {Array.isArray(comentarios) ? (
              <ul className="list-disc pl-5">
                {comentarios.map((comentario, index) => (
                  <li key={index}>{comentario}</li>
                ))}
              </ul>
            ) : (
              <span>{comentarios}</span>
            )}
          </div>
        );
      },
      enableSorting: true,
    },
  ];
  