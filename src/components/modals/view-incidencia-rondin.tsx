import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Incidencia_record } from "../table/incidencias/incidencias-columns";
import {  formatCurrency } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Depositos } from "@/lib/incidencias";

interface ViewFallaModalProps {
  title: string;
  data: Incidencia_record
  children: React.ReactNode;
  setIsSuccess:Dispatch<SetStateAction<boolean>>
  isSuccess: boolean;
  setModalEditarAbierto: Dispatch<SetStateAction<boolean>>;
  tab:string;
  setTab:Dispatch<SetStateAction<string>>;
}

export const ViewIncidenciaRondin: React.FC<ViewFallaModalProps> = ({
  title,
  data,
  children,
  setIsSuccess,
  isSuccess,
  setModalEditarAbierto,
}) => {
	// const { userIdSoter } = useAuthStore()
	// const {refetch, isLoading, isFetching} = useGetPdfIncidencias(data._id, 592, userIdSoter, `Seguimiento_de_Incidente_145636-${data.folio}`)
	// 	return new Date(a.fecha_inicio_seg).getTime() - new Date(b.fecha_inicio_seg).getTime();
	//   });
	


	// const handleGetPdf = async () => {
	// 	try {
	// 		const result = await refetch();

	// 		if (result.error) {
	// 		  	toast.error(`Error de red: ${result.error}`,{
	// 			style: {
	// 				backgroundColor: "#f44336", 
	// 				color: "#fff",
	// 				},
	// 			});
	// 		  return;
	// 		}
		
	// 		const data = result.data?.response?.data;

	// 		if (!data || data.status_code !== 200) {
	// 		  const errorMsg = data?.json?.error || result.data?.error|| "Error desconocido del servidor";
	// 		  toast.error(`Error de red: ${errorMsg}`, {
	// 			style: {
	// 				backgroundColor: "#f44336", 
	// 				color: "#fff",
	// 				},
	// 			});
	// 		  return;
	// 		}
			
	// 		const downloadUrl = data?.json?.download_url;
	// 		if (downloadUrl) {
	// 		  onDescargarPDF(downloadUrl);
	// 		} else {
	// 		  toast.warning("No se encontró URL de descarga");
	// 		}
		
	// 	  } catch (err) {
	// 		toast.error(`Error inesperado: ${err}`, {
	// 			style: {
	// 				backgroundColor: "#f44336", 
	// 				color: "#fff",
	// 				},
	// 			});
	// 	  }
	// };

	// async function onDescargarPDF(download_url: string) {
	// 	try {
	// 		await descargarPdfPase(download_url, "Seguimientio_de_incidente.pdf");
	// 		toast.success("¡PDF descargado correctamente!");
	// 	} catch (error) {
	// 		toast.error("Error al descargar el PDF: " + error);
	// 	}
	// }

	function sumDepositos(item:Depositos[]){
		const sumaTotal = item.reduce((total: any, item: { cantidad: number; }) => total + item.cantidad, 0);
		return formatCurrency(sumaTotal)
	}

	// const handleEdit = () => {
	// 	setOpenVerSeg(true);
	// };
	

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="flex-grow overflow-y-auto ">
            <Card className="p-3 ">
                <div >
                    {/* <div className="flex gap-2 mb-4">
                        <CircleAlert />
                        Incidente: <span className="font-bold">{data.categoria} / {data.sub_categoria} / {data.incidencia}</span>
                    </div> */}

                    <div className="overflow-y-auto ">
                <div className="flex flex-col gap-5 ">
                        <div className="w-full flex gap-2">
                            <p className="font-bold">Categoria: </p>
                            <p >{data?.categoria} </p>
                        </div>

                        <div className="w-full flex gap-2">
                            <p className="font-bold">Sub categoria: </p>
                            <p >{data?.sub_categoria} </p>
                        </div>

                        <div className="w-full flex gap-2">
                            <p className="font-bold">Tipo de incidente: </p>
                            <p >{data?.tipo} </p>
                        </div>

                        {/* <div className="w-full flex gap-2">
                            <p className="font-bold flex flex-shrink-0">Fecha:</p>
                            <p className="">{formatDateToText(data?.fecha_hora_incidencia.slice(0,-3))} </p>
                        </div> */}
                        <div className="w-full flex gap-2 col-span-2 ">
                            <p className="font-bold ">Comentarios:</p>
                            <p title={data?.comentario_incidencia || "-"} className=" line-clamp-3 overflow-hidden text-ellipsis whitespace-normal break-words">{data?.comentario_incidencia} </p>
                        </div>

                        <div className="w-full flex gap-2 col-span-2 ">
                            <p className="font-bold ">Accion:</p>
                            <p title={data?.comentario_incidencia || "-"} className=" line-clamp-3 overflow-hidden text-ellipsis whitespace-normal break-words">{data?.comentario_incidencia} </p>
                        </div>

                        {data?.dano_incidencia ??
                        <div className="w-full flex gap-2">
                            <p className="font-bold">Tipo de daño: </p>
                            <p >{data?.dano_incidencia} </p>
                        </div>}
                        {/* <div className="w-full flex gap-2">
                            <p className="font-bold">Notificaciones: </p>
                            <p >{data?.notificacion_incidencia} </p>
                        </div> */}
                </div>

                <div className="flex flex-col gap-2 ">
                    {/* <div className="w-full flex gap-2">
                        {data?.tags.length > 0 ?
                            <div className="flex flex-wrap gap-1 mt-2">
                            <p className="font-bold">Tags: </p>
                                {data?.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-1 h  rounded capitalize"
                                >
                                    {tag}
                                </span>
                                ))}
                            </div>
                        :null}
                    </div> */}

                   
                </div>
                        
                <div className="grid grid-cols-2 justify-around mt-4 ">
                    <div >
                        {data.evidencia_incidencia && data.evidencia_incidencia.length>0?(
                            <div className="flex flex-col">
                                <div><p className="font-bold ">Evidencia: </p></div>
                                <div className="flex ml-20">
                                    <Carousel className="flex w-36 max-w-xs">
                                        <CarouselContent>
                                            {data.evidencia_incidencia.map((a, index) => (
                                            <CarouselItem key={index}>
                                                <div className="p-1">
                                                <Card className="border-none">
                                                    <CardContent className="flex aspect-square items-center justify-center p-0 ">
                                                    {/* <span className="text-4xl font-semibold"> */}
                                                        <Image
                                                            width={280}
                                                            height={280}
                                                            src= {a.file_url || "/nouser.svg"}
                                                            alt="Imagen"
                                                            className="w-42 h-42 object-contain bg-gray-200 rounded-lg" 
                                                        />
                                                    {/* </span> */}
                                                    </CardContent>
                                                </Card>
                                                </div>
                                            </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        { data.evidencia_incidencia.length > 1 && 
                                        <><CarouselPrevious /><CarouselNext /></> }
                                    </Carousel>
                                </div>
                            </div>
                        ):(
                            <>
                            <div className="">
                                    <p className="font-bold mb-2">Evidencia: </p>
                                    <p className="mb-2">No hay evidencias disponibles </p>
                            </div>
                            </>
                        )}
                    </div>
                    <div>
                        <p className="font-bold">Documentos:</p>
                        {data?.documento_incidencia && data.documento_incidencia.length > 0 ? (
                            <div className="mt-5 border border-gray-200 rounded-md p-2 mb-5">
                            <ul className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                {data.documento_incidencia.map((documento, index) => (
                                <li key={index}>
                                <a
                                    href={documento.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {documento.file_name}
                                </a>
                                </li>
                                ))}
                                </ul>
                            </div>
                            ) : (
                            <p>No hay documentos disponibles</p>
                            )}
                    </div>
                </div>


                    {data.datos_deposito_incidencia.length>0 && data.incidente == "Depósitos y retiros de valores" ? 
                        <>	
                        <div className="my-2 font-bold text-lg">Depositos: </div>
                        <table className="min-w-full table-auto mb-5 border" >
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left border-b border-gray-300">Tipo deposito</th>
                                    <th className="px-4 py-2 text-left border-b border-gray-300">Origen</th>
                                    <th className="px-4 py-2 text-left border-b border-gray-300">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.datos_deposito_incidencia.length > 0 ? (
                                    data.datos_deposito_incidencia.map((item, index) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="px-4 py-2">{item.tipo_deposito ||"-" }</td>
                                            <td className="px-4 py-2">{item.origen ||"-"}</td>
                                            <td className="px-4 py-2 text-right">{formatCurrency(item.cantidad) ?? 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-500 py-4">
                                            No hay depósitos agregados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        
                        <div className="flex gap-2 items-center ml-5 mb-3">
                            <span className="font-bold text-base">Total:</span>
                            <span className="font-bold text-base">{sumDepositos(data.datos_deposito_incidencia)}</span>
                        </div>
                        </> :null}
                        
                        {/* {data.datos_deposito_incidencia.length>0 && data.incidente == "Depósitos y retiros de valores" ? 
                        <>
                            <div className="flex flex-col mt-2">
                                <div className=" flex justify-between">
                                    {data.datos_deposito_incidencia.length > 0 ? (
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem key={"1"} value={"1"}>
                                        <AccordionTrigger><h1 className="font-bold text-xl">Depósitos: </h1></AccordionTrigger>
                                        <AccordionContent className="mb-0 pb-0">
                                        {data.datos_deposito_incidencia.length > 0 ? (
                                        <>
                                        <table className="min-w-full table-auto border-separate border-spacing-2">
                                            <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left border-b">Cantidad</th>
                                                <th className="px-4 py-2 text-left border-b">Tipo de depósito</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {data.datos_deposito_incidencia.map((item:Depositos, index: number) => (
                                                <tr key={index}>
                                                <td className="px-4 py-2 text-right"><p>{formatCurrency(item.cantidad) || "-"}</p></td>
                                                <td className="px-4 py-2"><p>{capitalizeFirstLetter(item.tipo_deposito) || "-"}</p></td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>

                                        
                                        </>
                                        ) :null}
                                        </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                    ):<div>No hay lista de depositos disponibles.</div>}
                                </div>
                            </div>
                        </>
                        :null} */}


                        <div className="flex flex-col justify-between w-full h-full">
                            {data.incidente == 	"Persona extraviada" ? (
                                <>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem key={"1"} value={"1"}>
                                        <AccordionTrigger><h1 className="font-bold text-lg">Persona extraviada </h1></AccordionTrigger>
                                        <AccordionContent className="mb-0 pb-0">
                                            <table className="min-w-full table-auto border-separate border-spacing-2">
                                                <tbody>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Nombre completo</p></td>
                                                        <td className="px-4 py-2"><p>{data.nombre_completo_persona_extraviada || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Edad</p></td>
                                                        <td className="px-4 py-2"><p>{data.edad || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Color de piel</p></td>
                                                        <td className="px-4 py-2"><p>{data.color_piel || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Color de cabello</p></td>
                                                        <td className="px-4 py-2"><p>{data.color_cabello || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Estatura aproximada</p></td>
                                                        <td className="px-4 py-2"><p>{data.estatura_aproximada || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Descripcion física y vestimenta</p></td>
                                                        <td className="px-4 py-2"><p>{data.descripcion_fisica_vestimenta || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2"><p>Información del responsable (reporta)</p></td>
                                                        <td className="px-4 py-2"><p></p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Nombre completo</p></td>
                                                        <td className="px-4 py-2"><p>{data.nombre_completo_responsable || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Parentesco</p></td>
                                                        <td className="px-4 py-2"><p>{data.parentesco || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Número de documento de identidad</p></td>
                                                        <td className="px-4 py-2"><p>{data.num_doc_identidad || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Teléfono</p></td>
                                                        <td className="px-4 py-2"><p>{data.telefono || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>¿La información facilitada coincide con los videos?</p></td>
                                                        <td className="px-4 py-2"><p>{data.info_coincide_con_videos || "-"}</p></td>
                                                    </tr>
                                                    
                                                    {/* <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Responsable que recibe</p></td>
                                                        <td className="px-4 py-2"><p>{data.responsable_que_recibe || "-"}</p></td>
                                                    </tr> */}
                                                </tbody>
                                            </table>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                </>
                            ):null}
                        </div>

                        <div className="flex flex-col justify-between w-full h-full">
                            {data.incidente == 	"Robo de vehículo" ? (
                                <>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem key={"1"} value={"1"}>
                                        <AccordionTrigger><h1 className="font-bold text-xl">Robo de vehículo: </h1></AccordionTrigger>
                                        <AccordionContent className="mb-0 pb-0">
                                            <table className="min-w-full table-auto border-separate border-spacing-2">
                                                <tbody>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Placas</p></td>
                                                        <td className="px-4 py-2"><p>{ data.placas|| "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Tipo</p></td>
                                                        <td className="px-4 py-2"><p>{data.tipo || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Marca</p></td>
                                                        <td className="px-4 py-2"><p>{data.marca || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Modelo</p></td>
                                                        <td className="px-4 py-2"><p>{data.modelo || "-"}</p></td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-4 py-2 font-bold"><p>Color</p></td>
                                                        <td className="px-4 py-2"><p>{data.color || "-"}</p></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                </>
                            ):null}
                        </div>
                    </div>
            

                    
                      
                </div>
            </Card>
		</div>

		{/* {openVerSeg && (
		<ViewSeg
			title="Ver Seguimiento"
			data={seguimientosOrdenados[activeIndex]}
			isSuccess={openVerSeg}
			setIsSuccess={setOpenVerSeg}
			onNext={() => setActiveIndex((prev) => prev + 1)}
			onPrev={() => setActiveIndex((prev) => prev - 1)}
			disableNext={activeIndex === seguimientosOrdenados.length - 1}
			disablePrev={activeIndex === 0}
		>
			<div></div>
		</ViewSeg>
		)} */}

        <div className="flex gap-1 my-5 col-span-2">
          	<DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          	</DialogClose>

			<Button
			type="submit"
			className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={false} onClick={()=>{setIsSuccess(false); setModalEditarAbierto(true)}}
			>
			{true ? (<>
				{("Editar Incidencia")}
			</>) : (<> <Loader2 className="animate-spin" /> {"Editar Incidencia..."} </>)}
			</Button>

		  	{/* <Button
			type="submit"
			className="w-full  bg-yellow-500 hover:bg-yellow-600 text-white " disabled={isLoading || isFetching} onClick={()=>{handleGetPdf()}}>
			{isLoading || isFetching ? (<>
				  <> <Loader2 className="animate-spin" /> {"Descargando Reporte..."} </>
			</>) : (<><Download /> Descargar Reporte</>)}
			</Button> */}

        </div>
      </DialogContent>
    </Dialog>
  );
};
