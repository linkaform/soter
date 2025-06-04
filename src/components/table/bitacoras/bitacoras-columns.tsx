import { AddBadgeModal } from "@/components/modals/add-badge-modal";
import { EqipmentLocalPassModal } from "@/components/modals/add-local-equipo";
import { VehicleLocalPassModal } from "@/components/modals/add-local-vehicule";
import { DoOutModal } from "@/components/modals/do-out-modal";
import { ReturnGafeteModal } from "@/components/modals/return-gafete-modal";
import { ViewListBitacoraModal } from "@/components/modals/view-bitacora";
import { Equipo, Vehiculo } from "@/lib/update-pass";
import {
		ColumnDef,  
	} from "@tanstack/react-table";
import { Car, Eye, Forward, Hammer, IdCard} from "lucide-react";
import { useState } from "react";

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
	const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
	const [equipos, setEquipos] = useState<Equipo[]>([]);
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
			
			{ bitacora.status_visita.toLowerCase() !="salida" &&
			<VehicleLocalPassModal title={"Agregar Vehiculo"} vehicles={vehiculos} setVehiculos={setVehiculos} isAccesos={false} id={bitacora._id} fetch={true}>
				<Car></Car>
			</VehicleLocalPassModal>}

			{ bitacora.status_visita.toLowerCase() !="salida" &&	
			<EqipmentLocalPassModal title="Agregar equipo" id={bitacora._id} equipos={equipos} setEquipos={setEquipos} isAccesos={false}> 
				<Hammer></Hammer>
			</EqipmentLocalPassModal>} 
					

		{ bitacora.status_visita.toLowerCase() =="entrada" && bitacora.status_gafete.toLowerCase()=="asignado" ? (
			<ReturnGafeteModal title={"Recibir Gafete"} id_bitacora={bitacora._id}
				ubicacion={bitacora.ubicacion} area={bitacora.status_visita.toLowerCase() == "entrada" ? bitacora.caseta_entrada : bitacora.caseta_salida || ""} 
				fecha_salida={bitacora.fecha_salida} gafete={bitacora.id_gafet} locker={bitacora.id_locker||""} tipo_movimiento={bitacora.status_visita.toLowerCase()}> 
				<IdCard className="text-red-700"/>
			</ReturnGafeteModal>
		 ):(
		 <>
		 	{ bitacora.status_visita.toLowerCase() =="entrada"? (
				<AddBadgeModal title={"Gafete"} status={"Disponible"} id_bitacora= {bitacora._id}
					tipo_movimiento={bitacora.status_visita} ubicacion={bitacora.ubicacion} area={bitacora.status_visita.toLowerCase()=="entrada" ? bitacora.caseta_entrada: bitacora.caseta_salida||""}/>
			):null}
		 </>
		)}

		{ !bitacora.fecha_salida ? (
			<DoOutModal title={"Registar Salida"} id_bitacora={bitacora.codigo_qr} ubicacion={bitacora.ubicacion} 
				area={bitacora.status_visita.toLowerCase() == "entrada" ? bitacora.caseta_entrada : bitacora.caseta_salida || ""} fecha_salida={bitacora.fecha_salida}>
					<Forward />
				</DoOutModal>
		):null}
		</div>
	);
};

export const bitacorasColumns: ColumnDef<Bitacora_record>[] = [
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
		header: "Folio",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("folio")}</div>
		),
		enableSorting: true,
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
		accessorKey: "status_visita",
		header: "Estatus",
		cell: ({ row }) => {
			const isAbierto = row.getValue("status_visita") === "Entrada";
	
			return (
			  <div className={`capitalize font-semibold ${isAbierto ? 'text-green-600' : 'text-red-600'}`}>
				{row.getValue("status_visita")}
			  </div>
			);
		  },
		enableSorting: true,
	},
	{
		accessorKey: "fecha_entrada",
		header: "Entrada",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("fecha_entrada")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "fecha_salida",
		header: "Salida",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("fecha_salida")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "perfil_visita",
		header: "Tipo",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("perfil_visita")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "contratista",
		header: "Empresa",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("contratista")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "visita_a",
		header: "Visita a",
		cell: ({ row }) => {
			const visita_a= row.getValue("visita_a") as VisitaA[]
			return(
			<div className="capitalize">{visita_a.length>0 ? visita_a[0]?.nombre:""}</div>
		)},
		enableSorting: true,
		enableGlobalFilter: true
	},
	{
		accessorKey: "caseta_entrada",
		header: "Caseta Entrada",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("caseta_entrada")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "nombre_area_salida",
		header: "Caseta Salida",
		cell: ({ row }) => (
			<div className="capitalize">{row.getValue("nombre_area_salida")}</div>
		),
		enableSorting: true,
	},
	{
		accessorKey: "id_gafet",
		header: "Gafete",
		cell: ({ row }) => {
			const statusGafete = row.original.status_gafete !== "" ? row.original.status_gafete.toLowerCase() : "";
			const isEntregado = statusGafete === "entregado";
			const isAsignado = statusGafete === "asignado";
			const textColorClass = isEntregado ? "text-red-500" : isAsignado ? "text-green-500" : "";
			return (
				<div className={`capitalize ${textColorClass}`}>
					{row.getValue("id_gafet")}
				</div>
			);
		},
		
	},
	{
		accessorKey: "id_locker",
		header: "Locker",
		cell: ({ row }) => {
			const statusLocker = row.original.status_gafete !== "" ? row.original.status_gafete.toLowerCase() : "";
			const isLockerEntregado = statusLocker === "entregado";
			const isLockerAsignado = statusLocker === "asignado";
			const lockerColorClass = isLockerEntregado ? "text-red-500" : isLockerAsignado ? "text-green-500" : "";
			return (
				<div className={`capitalize ${lockerColorClass}`}>
					{row.getValue("id_locker")}
				</div>
			);
		},
		enableSorting: true,
	},
	{
		accessorKey: "comentarios",
		header: "Comentarios",
		cell: ({ row }) => {
			const comentarios = row.getValue("comentarios") as Comentarios_bitacoras[];
			return (
				<div className="capitalize">
					{Array.isArray(comentarios) ? (
						<ul className="list-disc pl-5">
							{comentarios.map((comentario, index) => (
								<li key={index}>{comentario.comentario}</li>
							))}
						</ul>
					) : (
						<span>{comentarios}</span>
					)}
				</div>
			);
		},
		enableSorting: true,
	}
];