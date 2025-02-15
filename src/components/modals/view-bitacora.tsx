/* eslint-disable react/no-children-prop */
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Bitacora_record } from "../table/bitacoras/bitacoras-columns";
import Image from "next/image";

interface ViewListBitacoraModalProps {
	title: string;
	data: Bitacora_record;
	children: React.ReactNode;
}

export const ViewListBitacoraModal: React.FC<ViewListBitacoraModalProps> = ({
	title,
	data,
	children,
}) => {
 

return (
	// open={isSuccess} onOpenChange={setIsSuccess}
	<Dialog >
		<DialogTrigger asChild>{children}</DialogTrigger>
		<DialogContent className="max-w-2xl max-h-[90vh] overflow-scroll">
			<DialogHeader>
				<DialogTitle className="text-2xl text-center  font-bold my-5">
					{title}
				</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col space-y-5">
				<div className="flex justify-between flex-col sm:flex-row sm:space-x-5 space-y-5 sm:space-y-0">
					<div className="w-full flex gap-2 ">
					<p className="font-bold flex-shrink-0">Nombre Completo : </p>
					<p className="">{data?.nombre_visitante} </p>
					</div>
					<div className="w-full flex gap-2 ">
						<p className="font-bold flex-shrink-0">Estatus : </p>
						<p className={` ${data?.status_visita.toLowerCase() === "entrada" ? "text-green-500" : data?.status_visita.toLowerCase() === "salida" ? "text-red-500" : ""}`}>
						{data?.status_visita}</p>
					</div>           
				</div>

				<div className="flex justify-between flex-col sm:flex-row sm:space-x-5 space-y-5 sm:space-y-0">
					<div className="w-full flex gap-2 ">
						<p className="font-bold">Tipo de pase : </p>
						<p >Visita General</p>
					</div>
					<div className="w-full flex gap-2 ">
						<p className="font-bold flex-shrink-0">Motivo de visita : </p>
						<p >{data?.motivo_visita}</p>
					</div>
				</div>

				<div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0">
				<div className="w-full flex gap-2 ">
						<p className="font-bold flex-shrink-0">Visita a : </p>
						<p > {data?.visita_a[0].nombre}</p>
					</div>
				</div>
				<Separator className="my-4" />
				<div className="flex justify-between">
					{data?.foto_url!== undefined ?(
							<><div className="w-full ">
									<p className="font-bold mb-3">Fotografia:</p>
									<div className="w-full flex justify-center">
											<Image
											src={data?.foto_url  } 
											alt="Imagen"
											width={150}
											height={150}
											className=" h-32 object-contain rounded-lg" 
											/>
									</div>
							</div>
							</>
					):null}


					{data?.identificacion_url!== undefined ?(
							<><div className="w-full ">
											<p className="font-bold mb-3">Identificacion:</p>
											<div className="w-full flex justify-center">
													<Image
													src={data?.identificacion_url  } 
													alt="Imagen"
													width={150}
													height={150}
													className=" h-32 object-contain rounded-lg" 
													/>
											</div>
									</div>
							</>
					):null}
				</div>

				<Separator className="my-4" />

				{data?.equipos.length>0 && (
				<div className="">
					<p className="text-lg font-bold mb-2">Equipos</p>
					<Accordion type="single" collapsible>
						{data?.equipos.map((equipo, index) => (
							<AccordionItem key={index} value={`equipo-${index}`}>
								<AccordionTrigger>{`${equipo.tipo_equipo}`}</AccordionTrigger>
								<AccordionContent>
									<p className="font-medium mb-1">
										Tipo: <span className="">{equipo.tipo_equipo || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Equipo: <span className="">{equipo.tipo_equipo || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Marca: <span className="">{equipo.marca_articulo || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Modelo: <span className="">{equipo.modelo_articulo|| "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Número de Serie:{" "}
										<span className="">{equipo.numero_serie || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Color: <span className="">{equipo.color_articulo || "N/A"}</span>
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				)}

				{data?.vehiculos.length>0 && (
				<div className="">
					<p className="text-lg font-bold mb-2">Vehículos</p>
					<Accordion type="single" collapsible>
						{data?.vehiculos.map((vehiculo, index) => (
							<AccordionItem key={index} value={`vehiculo-${index}`}>
								<AccordionTrigger>{`${vehiculo.tipo}`}</AccordionTrigger>
								<AccordionContent>
									<p className="font-medium mb-1">
										Tipo de Vehículo:{" "}
										<span className="">{vehiculo.tipo || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Marca:{" "}
										<span className="">{vehiculo.marca_vehiculo || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Modelo:{" "}
										<span className="">{vehiculo.modelo_vehiculo || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Estado:{" "}
										<span className="">{vehiculo.nombre_estado|| "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Placas:{" "}
										<span className="">{vehiculo.placas || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Color:{" "}
										<span className="">{vehiculo.color || "N/A"}</span>
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				)}

			{data?.comentarios.length>0 && (
				<div className="">
					<p className="text-lg font-bold mb-2">Comentarios</p>
					<Accordion type="single" collapsible>
						{data?.comentarios.map((comentario, index) => (
							<AccordionItem key={index} value={`comentario-${index}`}>
								<AccordionTrigger>{`${comentario.comentario}`}</AccordionTrigger>
								<AccordionContent>
									<p className="font-medium mb-1">
										Tipo: <span className="">{comentario.tipo_comentario || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Comentario: <span className="">{comentario.comentario || "N/A"}</span>
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				)}


			{data?.grupo_areas_acceso.length>0 && (
				<div className="">
					<p className="text-lg font-bold mb-2">Areas</p>
					<Accordion type="single" collapsible>
						{data?.grupo_areas_acceso.map((equipo, index) => (
							<AccordionItem key={index} value={`equipo-${index}`}>
								<AccordionTrigger>{`${equipo.note_booth}`}</AccordionTrigger>
								<AccordionContent>
									<p className="font-medium mb-1">
										Area: <span className="">{equipo.note_booth || "N/A"}</span>
									</p>
									<p className="font-medium mb-1">
										Comentario: <span className="">{equipo.commentario_area || "N/A"}</span>
									</p>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				)}
			</div>
			<div className="flex gap-1 my-5">
				<DialogClose asChild>
					<Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
						Cancelar
					</Button>
				</DialogClose>
				
			</div>
		</DialogContent>
	</Dialog>
);
};
