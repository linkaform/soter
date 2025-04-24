import { AddVehicleModal } from "@/components/modals/add-vehicle-modal";
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

            <AddVehicleModal title="Agregar vehiculo" id={bitacora._id} refetchTable={()=>{}} />
        </div>
	);
};

export const vehiculosColumns: ColumnDef<Bitacora_record>[] = [
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
		accessorKey: "folio",
		header: "folio",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("folio")}</div>
		),
		enableSorting: true,
	},
    {
		accessorKey: "nombre_visitante",
		header: "Nombre",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("nombre_visitante")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "tipo",
		header: "Tipo",
		cell: ({ row }) => {
            const veh = row.original.vehiculos[0]
            return (
                <div className="capitalize">{veh?.tipo}</div>
            )
        },
		enableSorting: true,
	},
	{
		accessorKey: "modelo_vehiculo",
		header: "Modelo",
		cell: ({ row }) => {
            const veh = row.original.vehiculos[0]
            return (
                <div className="capitalize">{veh?.modelo_vehiculo}</div>
            )
        },
		enableSorting: true,
	},
	{
		accessorKey: "color",
		header: "Color",
		cell: ({ row }) => {
            const veh = row.original.vehiculos[0]
            return (
                <div className="capitalize">{veh?.color}</div>
            )
        },
		enableSorting: true,
	},

	{
		accessorKey: "placas",
		header: "Tipo",
		cell: ({ row }) => {
            const veh = row.original.vehiculos[0]
            return (
                <div className="capitalize">{veh?.placas}</div>
            ) 
        },
		enableSorting: true,
	},
	{
		accessorKey: "marca_vehiculo",
		header: "Marca",
		cell: ({ row }) => {
            const veh = row.original.vehiculos[0]
            return (
                <div className="capitalize">{veh?.marca_vehiculo}</div>
            )
        },
		enableSorting: true,
	},
	{
		accessorKey: "nombre_estado",
		header: "Estado",
		cell: ({ row }) => {
            const veh = row.original.vehiculos[0]
            return(
                <div className="capitalize">{veh?.nombre_estado}</div>
            )
        },
		enableSorting: true,
	},
];