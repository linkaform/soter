import React from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { MessageSquare, Phone } from "lucide-react";

import { MakeCallModal } from "@/components/modals/make-call-modal";
import { SendMessageModal } from "@/components/modals/send-message-modal";
import { SearchAccessPass } from "@/hooks/useSearchPass";
import { toast } from "sonner";
import CalendarDays from "@/components/calendar-days";
import { capitalizeFirstLetter } from "@/lib/utils";

interface Props {
  searchPass: SearchAccessPass | undefined;
}

const Credentials: React.FC<Props> = ({ searchPass }) => {
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Vencido":
//         return "red";
//       case "Activo":
//         return "green";
//       case "Proceso":
//         return "blue";
//       default:
//         return "blue";
//     }
//   };

  return (
	<div className=" h-fit overflow-y-auto p-4 ">
		<Card className="w-full max-w-xl">
		<CardContent className="p-10 pt-8 flex flex-col">
			<div className="flex justify-between mb-2">
				<div>
					<span className="text-gray-500">Folio: <span className="text-black"> {searchPass?.folio}</span></span>
				</div>
				<Badge
					className={`text-white text-md  ${
					searchPass?.tipo_movimiento === "Salida"
						? "bg-red-600 hover:bg-red-600"
						: "bg-green-600 hover:bg-green-600"
					}`}
				>
					{searchPass?.tipo_movimiento ?? "Entrada"}
				</Badge>
			</div>

			<div className="flex flex-col flex-wrap gap-6">
			<div className="mt-0">
				
				<div className="flex justify-center gap-4">
					<div className="w-[140px] overflow-hidden rounded-lg">
						<Image
						src={
							searchPass?.identificacion?.[0]?.file_url || "/noiden.svg"
						}
						alt="Identificación"
						width={140}
						height={140}
						className="w-full object-cover"
						/>
					</div>

					<div className="w-[140px] overflow-hidden rounded-lg">
						<Image
						src={
							searchPass?.foto?.[0]?.file_url ||
							"/nouser.svg"
						}
						alt="Foto"
						width={140}
						height={140}
						className="w-full objet-cover"
						/>
					</div>
				</div>

				<div className="flex flex-col justify-center items-center text-xl font-bold">
					<p>
					{searchPass?.nombre}
					</p> 
				</div>

				<div className="flex flex-col justify-center items-center my-1 mb-2">
					{searchPass?.tipo_de_pase}
				</div>
						
				<div className="flex flex-col gap-3">

					<div className="w-full flex gap-2">
						<p className="text-slate-500 whitespace-nowrap">Ubicación:</p>
						<div className="relative group w-full break-words">
							{searchPass?.ubicacion[0]}
							{searchPass?.ubicacion && searchPass?.ubicacion.length > 1 && (
							<span className="text-blue-600 cursor-pointer ml-1 underline relative">
								+{searchPass?.ubicacion.length - 1}
								{/* Tooltip container */}
								<div className="absolute left-0 top-full z-10 mt-1 hidden w-max max-w-xs rounded bg-gray-800 px-2 py-1 text-sm text-white shadow-lg group-hover:block">
								{Array.isArray(searchPass?.ubicacion) && searchPass.ubicacion.length > 1 && (
									searchPass.ubicacion.slice(1).map((ubic:string, idx:number) => (
										<div key={idx}>{ubic}</div>
									))
									)}
								</div>
							</span>
							)}
						</div>
					</div>

					<div>
						<span className="text-gray-500">Empresa:  <span className="text-black">{searchPass?.empresa}</span></span>
					</div>
					<div>
						<span className="text-gray-500">Motivo de visita:  <span className="text-black">{searchPass?.motivo_visita}</span></span>
					</div>

					<div>
						<span className="text-gray-500">Estatus:  </span>
						<Badge
							className={`text-white text-md ${
								searchPass?.estatus.toLowerCase() == "vencido"
								? "bg-red-600 hover:bg-red-600"
								: searchPass?.estatus.toLowerCase() == "activo"
								? "bg-green-600 hover:bg-green-600"
								: searchPass?.estatus.toLowerCase() == "proceso"
								? "bg-blue-600 hover:bg-blue-600"
								: "bg-gray-400"
							}`}
							>
							{capitalizeFirstLetter(searchPass?.estatus ??"")}
						</Badge>
					</div>

					<div className="flex">
						<p className="w-1/4 text-gray-500">Visita a:</p>
						<div className="flex w-full justify-start">
						{searchPass?.visita_a?.map((visita, index) => (
							<div
							key={index}
							className="flex items-center justify-between space-x-6"
							>
							<span>{visita.nombre}</span>
							<div className="space-x-2">
								{/* Botón de Llamada */}
								<MakeCallModal
								title="¿Realizar llamada?"
								description="Al realizar la llamada, se contactará al número de la persona seleccionada."
								>
								<Button
									size="icon"
									variant="secondary"
									className="bg-gray-700 text-white hover:bg-gray-600"
									onClick={() => {
									if (!visita.phone) {
										toast.error(
										"¡El teléfono no ha sido configurado para esta persona!"
										);
										return;
									}
									}}
								>
									<Phone className="h-4 w-4" />
								</Button>
								</MakeCallModal>

								{/* Botón de Mensaje */}
								<SendMessageModal title="Enviar Mensaje">
								<Button
									size="icon"
									variant="secondary"
									className="bg-gray-700 text-white hover:bg-gray-600"
									onClick={() => {
									if (!visita.email) {
										toast.error(
										"¡El email no ha sido configurado para esta persona!"
										);
										return;
									}
									}}
								>
									<MessageSquare className="h-4 w-4" />
								</Button>
								</SendMessageModal>
							</div>
							</div>
						))}
						</div>
					</div>

					<div>
						<span className="text-gray-500">Vigencia del pase:  <span className="text-black">{searchPass?.fecha_de_caducidad?.toString()}</span></span>
					</div>
				
					<div >
						{searchPass?.limite_de_acceso != null &&(
							<div className=" text-slate-500">
									<span>Limite de entradas:  </span>
									<span className="text-black">
										{searchPass?.total_entradas ?? 0}/{searchPass?.limite_de_acceso}
									</span>
							</div>
						)}
						<div className="grid grid-cols-2 gap-4">
						{searchPass?.gafete_id &&
							<div>
								<span className="text-gray-500">Gafete:  <span className="text-black">{searchPass?.gafete_id}</span></span>
							</div>
						}
						{searchPass?.locker_id &&
							<div>
								<span className="text-gray-500">Locker:  <span className="text-black">{searchPass?.locker_id}</span></span>
							</div>
						}
						</div>
					</div>

					<div className="max-w-sm">
						{searchPass?.limitado_a_dias && (
						<div className="">
							<CalendarDays
							diasDisponibles={searchPass?.limitado_a_dias}
							/>
						</div>
						)}
					</div>

				</div>
			</div>
				
			</div>
		</CardContent>
		</Card>
	</div>
  );
};

export default Credentials;