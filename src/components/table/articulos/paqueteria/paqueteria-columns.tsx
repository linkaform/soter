import {
  ColumnDef, 
} from "@tanstack/react-table";
import { Imagen } from "@/lib/update-pass";
import { ViewPaqueteria } from "@/components/modals/view-paqueteria";
import { Eye } from "lucide-react";
import { LoadingModal } from "@/components/modals/loading-modal";
import { useState } from "react";
import { EditarPaqueteria } from "@/components/modals/editar-paqueteria";
import { DevolucionPaqModal } from "@/components/modals/entregar-paqueteria";
import ViewImage from "@/components/modals/view-image";


export interface Paquete_record {
  folio: string
  _id: string
  ubicacion_paqueteria: string,
  area_paqueteria: string,
  fotografia_paqueteria: Imagen[],
  descripcion_paqueteria: string,
  quien_recibe_paqueteria: string,
  guardado_en_paqueteria:string,
  fecha_recibido_paqueteria: string,
  fecha_entregado_paqueteria: string,
  estatus_paqueteria: string, 
  entregado_a_paqueteria: string,
  proveedor: string
}


const OptionsCell: React.FC<{ row: any }> = ({ row}) => {
  	const paquete = row.original;
	  const [showLoadingModal, setShowLoadingModal] = useState(false);
  return (
    <div className="flex space-x-2">

      <ViewPaqueteria 
          title="Información del Paquete"
          data={paquete} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
      </ViewPaqueteria>


      <LoadingModal isOpen={showLoadingModal} text="Cargando..."/>

      <EditarPaqueteria
        title="Editar Paqueteria"
        data={paquete} setShowLoadingModal={setShowLoadingModal} showLoadingModal={showLoadingModal}/>

      <DevolucionPaqModal 
              title="Devolver paquete"
              data={paquete} />
		{/* 

		
		

		 */}

    </div>
  );
};


export const paqueteriaColumns: ColumnDef<Paquete_record>[] = [
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
    accessorKey: "quien_recibe_paqueteria",
    header: "Destinatario",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("quien_recibe_paqueteria")}</div>
    ),
    enableSorting: true,
  },
    {
      accessorKey: "descripcion_paqueteria",
      header: "Descripcion",
      cell: ({ row }) => (
        <div className="capitalize truncate max-w-xs w-44">{row.getValue("descripcion_paqueteria")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey:"foto_perdido",
      header:"Fotografía",
      cell: ({ row }) => {
        const foto = row.original.fotografia_paqueteria;
          return <ViewImage imageUrl={foto?? []} />;
      }
    },
    // {
    //   accessorKey:"fotografia_paqueteria",
    //   header:"Fotografía",
    //   cell: ({ row }) => {
		// const foto = row.original.fotografia_paqueteria;
    //     const ultimaImagen = foto && foto.length > 0 ? foto[foto.length - 1].file_url : '/nouser.svg'; 
    //     return(
		// 	<>
		// 	<Avatar>
		// 		<AvatarImage src={ultimaImagen|| "/nouser.svg"} alt="Avatar" style={{ objectFit: 'cover', width: '100%', height: '100%' }}/>
		// 	</Avatar>
		// 	</>
    //     )},
    //     enableSorting: false,
    // },

    {
      accessorKey: "guardado_en_paqueteria",
      header: "Locker",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("guardado_en_paqueteria")}</div>
      ),
      enableSorting: true,
    },
	{
		accessorKey: "estatus_paqueteria",
		header: "Estatus",
    cell: ({ row }) => {
      const isAbierto = row.getValue("estatus_paqueteria") === "entregado";
  
      return (
        <div className={`capitalize font-semibold ${isAbierto ? 'text-green-600' : 'text-red-600'}`}>
        {row.getValue("estatus_paqueteria")}
        </div>
      );
    },
		enableSorting: true,
	 },
    {
      accessorKey: "fecha_recibido_paqueteria",
      header: "Fecha de entrega",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fecha_recibido_paqueteria")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "fecha_entregado_paqueteria",
      header: "Fecha de devolucion",
      cell: ({ row }) => (
        <div>{row.getValue("fecha_entregado_paqueteria")}</div>
      ),
      enableSorting: true,
    },
 	{
		accessorKey: "proveedor",
		header: "Proveedor",
		cell: ({ row }) => (
		  <div className="capitalize">{row.getValue("proveedor")}</div>
		),
		enableSorting: true,
	  },

  ];
  