import {
  ColumnDef, 
} from "@tanstack/react-table";
import { Imagen } from "@/lib/update-pass";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { capitalizeFirstLetter } from "@/lib/utils";


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
	//const [showLoadingModal, setShowLoadingModal] = useState(false);
	console.log(paquete)
  return (
    <div className="flex space-x-2">
		{/* <ViewArticulo 
          title="Información del Artículo"
          data={paquete} isSuccess={false}>
            <div className="cursor-pointer">
              <Eye /> 
            </div>
        </ViewArticulo>

		<LoadingModal isOpen={showLoadingModal} text="Cargando..."/>
		
		<EditarArticuloModal 
        title="Editar Artículo"
        data={paquete} setShowLoadingModal={setShowLoadingModal} showLoadingModal={showLoadingModal}/>

		<DevolucionArticuloModal 
        title="Devolver Artículo"
        data={paquete} /> */}

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
      accessorKey: "descripcion_paqueteria",
      header: "Descripcion",
      cell: ({ row }) => (
        <div className="capitalize truncate max-w-xs w-44">{row.getValue("descripcion_paqueteria")} adsflkn asdf aslf a sf as da sd a s   dasdasfd as fas f asf</div>
      ),
      enableSorting: true,
    },
    
    {
      accessorKey:"fotografia_paqueteria",
      header:"Fotografía",
      cell: ({ row }) => {
		const foto = row.original.fotografia_paqueteria;
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
      accessorKey: "fecha_entregado_paqueteria",
      header: "Quién recibe",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("fecha_entregado_paqueteria")}</div>
      ),
      enableSorting: true,
    },
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
		cell: ({ row }) => (
		  <div>{ row.getValue("estatus_paqueteria") ? capitalizeFirstLetter(row.getValue("estatus_paqueteria")) :"" }</div>
		),
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
      accessorKey: "date_hallazgo_perdido",
      header: "Fecha de devolucion",
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
		accessorKey: "proveedor",
		header: "Proveedor",
		cell: ({ row }) => (
		  <div className="capitalize">{row.getValue("proveedor")}</div>
		),
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

  ];
  