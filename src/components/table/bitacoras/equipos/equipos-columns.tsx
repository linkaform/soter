import { AddEquipmentModal } from "@/components/modals/add-equipment-modal";
import { ViewListBitacoraModal } from "@/components/modals/view-bitacora";
import {
		ColumnDef,  
	} from "@tanstack/react-table";
import { Eye} from "lucide-react";

export interface Bitacora_record {
	equipos: Equipo_bitacora[] 
	file_name: string
	fecha_entrada: string
	caseta_salida: string
	caseta_entrada: string
	updated_at: string
	motivo_visita: string
	folio: string
	contratista: unknown[]
	foto_url: string
	identificacion_url:string
	id_locker: string
	id_gafet: string
	ubicacion: string
	perfil_visita: string
	documento: string
	nombre_visitante: string
	visita_a: VisitaA[]
	vehiculos: Vehiculo_bitacora[]
	codigo_qr: string
	status_visita: string
	created_at: string
	file_url: string
	grupo_areas_acceso: Areas_bitacora[] 
	fecha_salida: string
	status_gafete: string
	_id: string
	comentarios: Comentarios_bitacoras[]
    formated_comentarios?:string
	formated_visita?:string
}

export type Comentarios_bitacoras={
	tipo_comentario:string;
	comentario:string;
}

export interface Equipo_bitacora {
	color_articulo: string
	numero_serie: string
	modelo_articulo: string
	marca_articulo: string
	tipo_equipo: string
	nombre_articulo: string
}

export interface VisitaA {
	posicion: string
	nombre: string
	user_id: number
	email: string
	departamento: string
}

export interface Vehiculo_bitacora {
	tipo: string
	modelo_vehiculo: string
	color: string
	placas: string
	marca_vehiculo: string
	nombre_estado: string
}
export interface Areas_bitacora {
	note_booth: string
	commentario_area: string
}


const OptionsCell: React.FC<{ row: any }> = ({ row }) => {
	const bitacora = row.original;
	bitacora.formated_visita = bitacora.visita_a.map((item: VisitaA) => item.nombre).join(', ');
	bitacora.formated_comentarios = bitacora.comentarios.map((item: Comentarios_bitacoras) => item.comentario).join(', ');
	return (
		<div className="flex space-x-2">
			<ViewListBitacoraModal 
				title="Información de visita"
				data={bitacora} 
				>
					<div className="cursor-pointer">
						<Eye /> 
					</div>
			</ViewListBitacoraModal>

      <AddEquipmentModal title="Agregar equipo" id={bitacora._id} refetchTable={()=>{}}/>
		</div>

    
	);
};

export const equiposColumns: ColumnDef<Bitacora_record>[] = [
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
		accessorKey: "nombre_visitante",
		header: "Visitante",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("nombre_visitante")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "equipos",
		header: "Entrada",
		cell: ({ row }) =>  {
      const eq = row.original.equipos[0]
      return (
          <div className="capitalize">{eq?.tipo_equipo}</div>
      )
    },
		enableSorting: true,
	},
	{
		accessorKey: "marca_articulo",
		header: "Marca",
		cell: ({ row }) => {
      const eq = row.original.equipos[0]
      return (
        <div className="capitalize">{eq?.marca_articulo}</div>
      )
    },
		enableSorting: true,
	},

	{
		accessorKey: "modelo_articulo",
		header: "Modelo",
		cell: ({ row }) => {
      const eq = row.original.equipos[0]
      return(
        <div className="capitalize">{eq?.modelo_articulo}</div>
      )
    },
		enableSorting: true,
	},
	{
		accessorKey: "nombre_articulo",
		header: "Nombre",
		cell: ({ row }) => {
      const eq = row.original.equipos[0]
      return(
        <div className="capitalize">{eq?.nombre_articulo}</div>
      )
    },
		enableSorting: true,
	},
	{
		accessorKey: "numero_serie",
		header: "Numero de serie",
		cell: ({ row }) => {
			const eq = row.original.equipos[0]
			return(
			<div className="capitalize">{eq?.numero_serie}</div>
		)},
		enableSorting: true,
	},
	{
		accessorKey: "color",
		header: "Caseta Entrada",
		cell: ({ row }) => {
      const eq = row.original.equipos[0]
      return (
        <div className="capitalize">{eq?.color_articulo}</div>
      )},
		enableSorting: true,
	},

];