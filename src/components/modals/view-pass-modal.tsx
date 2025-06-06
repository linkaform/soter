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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {  Areas, Comentarios, enviar_pre_sms, Link } from "@/hooks/useCreateAccessPass";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Imagen } from "@/lib/update-pass";
import CalendarDays from "../calendar-days";
import { toast } from "sonner";
import { descargarPdfPase } from "@/lib/download-pdf";
import { useGetPdf } from "@/hooks/usetGetPdf";
import { useSendCorreoSms } from "@/hooks/useSendCorreo";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore";
import { AddEmailModal } from "./add-mail";
import { AddSmsModal } from "./add-sms";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Equipo } from "@/lib/update-pass-full";

type Vehiculo_custom={
    tipo_vehiculo:string,
    marca_vehiculo:string,
    modelo_vehiculo:string,
    state:string,
    placas_vehiculo:string,
    color_vehiculo:string
}
interface ViewPassModalProps {
  title: string;
  data: {
    _id:string;
    folio:string;
    nombre: string;
    email: string;
    telefono: string;
    ubicacion: string;
    tema_cita: string;
    descripcion: string;
    perfil_pase: string,
    status_pase:string,
    visita_a: any[],
    custom: boolean,
    link:Link,
    limitado_a_dias: string[],
    foto:Imagen[],
    identificacion:Imagen[],
    enviar_correo_pre_registro: string[],
    tipo_visita_pase:string;
    fechaFija:string;
    fecha_desde_visita: string;
    fecha_desde_hasta: string;
    config_dia_de_acceso:string;
    config_dias_acceso: string[];
    config_limitar_acceso: number;
    areas: Areas[];
    qr_pase:any[];
    comentarios: Comentarios[];
    enviar_pre_sms: enviar_pre_sms
    grupo_vehiculos:Vehiculo_custom[];
    grupo_equipos:Equipo[];
  };
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewPassModal: React.FC<ViewPassModalProps> = ({
  title,
  data,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const {userIdSoter}= useAuthStore()
  const account_id = userIdSoter;
  const [ enablePdf, setEnablePdf] = useState(false)
  const { data: responsePdf, isLoading: loadingPdf} = useGetPdf(account_id, data._id, enablePdf);
  const { createSendCorreoSms, createSendSms,  isLoadingCorreo, isLoadingSms} = useSendCorreoSms();
  const downloadUrl=responsePdf?.response?.data?.data?.download_url

  const [openAddMail, setOpenAddMail]= useState(false)
  const [openAddPhone, setOpenAddPhone]= useState(false)

	function onEnviarCorreo(){
		if(data?.status_pase.toLowerCase()!='vencido'){
			if(data?.email!==""){
				const data_for_msj = {
				email_to: data.email,
				asunto: data.tema_cita,
				email_from: data.visita_a.length>0 ? data.visita_a[0]?.email[0] :'',
				nombre: data.nombre,
				nombre_organizador: data.visita_a.length>0 ? data.visita_a[0].nombre :'',
				ubicacion: data.ubicacion,
				fecha: {desde: data.fecha_desde_visita, hasta: data.fecha_desde_hasta},
				descripcion: data.descripcion,
				}
				createSendCorreoSms.mutate({account_id, envio: ["enviar_correo_pre_registro"], data_for_msj , folio:data._id} )
			}else{  
          setOpenAddMail(true)
          // toast.error("Ingresa un correo valido.")
			}
		}else{
		toast.error("El pase ha vencido, edita el pase para poder enviarlo.")
		}
	}

	function onEnviarSMS(){
		console.log("hola")
		if(data?.status_pase.toLowerCase()!='vencido'){
			if(data?.telefono!==""){
				// const data_cel_msj = {
				// mensaje: `Estimado ${data.nombre}, ${data.visita_a.length>0 ? data.visita_a[0].nombre :''}, te esta invitando a: ${data.ubicacion}, Descarga tu pase en: `, //${responsePdf.response?.data?.data?.download_url}
				// numero: data.telefono
				// }
        const data_for_msj = {
          email_to: data.email,
          asunto: data.tema_cita,
          email_from: data.visita_a.length>0 ? data.visita_a[0]?.email[0] :'',
          nombre: data.nombre,
          nombre_organizador: data.visita_a.length>0 ? data.visita_a[0].nombre :'',
          ubicacion: data.ubicacion,
          fecha: {desde: data.fecha_desde_visita, hasta: data.fecha_desde_hasta},
          descripcion: data.descripcion,
          }
				createSendSms.mutate({account_id, envio: ["enviar_sms_pre_registro"], data_for_msj: data_for_msj , folio:data._id} )
			}else{
        setOpenAddPhone(true)
				// toast.error("Ingresa un teléfono valido.")
			}
		}else{
		toast.error("El pase ha vencido, edita el pase para poder enviarlo.")

		}
	}

	useEffect(()=>{
		if(downloadUrl){
			onDescargarPDF(downloadUrl)
			setEnablePdf(false)
			toast.success("¡PDF descargado correctamente!");
		}
	},[downloadUrl])

	async function onDescargarPDF(download_url: string) {
		try {
			await descargarPdfPase(download_url);
		} catch (error) {
			toast.error("Error al descargar el PDF: " + error);
		}
	}


  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
          <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto">
        <AddEmailModal
          title={"Agregar Correo"} open={openAddMail} setOpen={setOpenAddMail} id={data._id} setOpenPadre={setOpen}/>
          
        <AddSmsModal
          title={"Agregar Teléfono"} open={openAddPhone} setOpen={setOpenAddPhone} id={data._id} setOpenPadre={setOpen}/>


        {/* Sobre la visita */}
          <div className="w-full flex mb-3 gap-1">
            <p className="font-bold ">Nombre Completo : </p>
            <p> {data?.nombre} </p>
          </div>

        <div className="flex flex-col space-y-5">


					<div className="flex flex-col space-y-5">
						<div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0 ">
							<div className="w-full flex gap-2 ">
							<p className="font-bold flex-shrink-0">Tipo de pase : </p>
							<p >Visita General</p>
							</div>

              <div className="w-full flex gap-2">
                <p className="font-bold flex-shrink-0">Estatus:</p>
                <p
                  className={`font-bold capitalize ${
                    data.status_pase === 'activo'
                      ? 'text-green-600'
                      : data.status_pase === 'proceso'
                      ? 'text-blue-600'
                      : data.status_pase === 'vencido'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {data.status_pase}
                </p>
              </div>
						</div>

						<div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0">
							<div className="w-full flex gap-2 ">
							<p className="font-bold flex-shrink-0">Email : </p>
							<p className="w-full break-words">{data?.email}</p>
							</div>

							<div className="w-full flex gap-2">
							<p className="font-bold flex-shrink-0">Teléfono : </p>
							<p className="text-sm">{data?.telefono}</p>
							</div>
						</div>

            <div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0">
              <div className="w-full flex gap-2  ">
                <p className="font-bold flex-shrink-0">Tema cita : </p>
                <p className="w-full break-words">{data?.tema_cita}</p>
              </div>

              <div className="w-full flex gap-2 ">
                <p className="font-bold flex-shrink-0">Descripción : </p>
                <p className="w-full break-words">{data?.descripcion} </p>
              </div>
            </div>

					</div>


          {data?.foto.length > 0  ||  data?.identificacion.length > 0 &&
          <Separator className="my-4" />}

          <div className="flex flex-col  justify-between  md:flex-row">
            {data?.foto!== undefined && data?.foto.length > 0 ?(
                <div className="w-full ">
                    <p className="font-bold mb-3">Fotografia:</p>
                    <div className="w-full flex justify-center">
                        <Image
                        src={data?.foto[0].file_url  } 
                        alt="Imagen"
                        width={150}
                        height={150}
                        className=" h-32 object-contain rounded-lg" 
                        />
                    </div>
                </div>
            ):null}


            {data?.identificacion!== undefined && data?.identificacion.length > 0 ?(
              <div className="w-full ">
                        <p className="font-bold mb-3">Identificacion:</p>
                        <div className="w-full flex justify-center">
                            <Image
                            src={data?.identificacion[0].file_url  } 
                            alt="Imagen"
                            width={150}
                            height={150}
                            className=" h-32 object-contain  rounded-lg" 
                            />
                        </div>
                    </div>
            ):null}
          </div>

          {data?.grupo_equipos.length>0 || data?.grupo_vehiculos.length>0&&
          <Separator className="my-4" />}

          {/* {data?.grupo_equipos.length>0 && (
          <div className="">
            <p className="text-lg font-bold mb-2">Equipos</p>
            <Accordion type="single" collapsible>
              {data?.grupo_equipos.map((equipo, index) => (
                <AccordionItem key={index} value={`equipo-${index}`}>
                  <AccordionTrigger>{`${equipo.tipo_equipo}`}</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium mb-1">
                      Tipo: <span className="">{equipo.tipo_equipo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Equipo: <span className="">{equipo.nombre_articulo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Marca: <span className="">{equipo.marca_articulo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Modelo: <span className="">{equipo.modelo_articulo || "N/A"}</span>
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
          )} */}


            <div className="flex justify-between w-full h-full mb-2">
							{data?.grupo_equipos.length > 0 ? (
								<Accordion type="single" collapsible className="w-full">
								<AccordionItem key={"1"} value={"1"}>
								<AccordionTrigger>{"Equipos agregados"}</AccordionTrigger>
								<AccordionContent className="mb-0 pb-0">
								{data?.grupo_equipos.length > 0 ? (
									<table className="min-w-full table-auto border-separate border-spacing-2">
									<thead>
										<tr>
										<th className="px-4 py-2 text-left border-b">Tipo</th>
										<th className="px-4 py-2 text-left border-b">Nombre</th>
										<th className="px-4 py-2 text-left border-b">Marca</th>
										<th className="px-4 py-2 text-left border-b">Modelo</th>
										<th className="px-4 py-2 text-left border-b">No. Serie</th>
										<th className="px-4 py-2 text-left border-b">Color</th>
										</tr>
									</thead>
									<tbody>
										{data?.grupo_equipos.map((item: Equipo, index: number) => (
										<tr key={index}>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item?.tipo ?? "")}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item?.nombre?? "") }</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item?.marca?? "") }</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item?.modelo?? "") }</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item?.serie?? "") }</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item?.color?? "") }</small></td>
										</tr>
										))}
									</tbody>
									</table>
								) : (
										<div>No se agregaron equipos.</div>
								)}
								</AccordionContent>
								</AccordionItem>
								</Accordion>
							):(<div>No se agregaron equipos.</div>)}
						</div>

          {data?.grupo_vehiculos.length>0 && (
          <div className="">
            <p className="text-lg font-bold mb-2">Vehículos</p>
            <Accordion type="single" collapsible>
              {data?.grupo_vehiculos.map((vehiculo, index) => (
                <AccordionItem key={index} value={`vehiculo-${index}`}>
                  <AccordionTrigger>{`${vehiculo.tipo_vehiculo}`}</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium mb-1">
                      Tipo de Vehículo:{" "}
                      <span className="">{vehiculo.tipo_vehiculo || "N/A"}</span>
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
                      <span className="">{vehiculo.state|| "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Placas:{" "}
                      <span className="">{vehiculo.placas_vehiculo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Color:{" "}
                      <span className="">{vehiculo.color_vehiculo || "N/A"}</span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          )}

          {data?.limitado_a_dias!== undefined && data?.limitado_a_dias.length > 0 ? (
            <div className="flex flex-col space-y-5">
              <CalendarDays diasDisponibles = {data?.limitado_a_dias}/>
            </div>
          ):null}
        </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 my-5">
            <DialogClose asChild>
              <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                Cancelar
              </Button>
            </DialogClose>
              <Button className="w-full bg-slate-500 hover:bg-slate-600 text-white" onClick={() => {
                navigator.clipboard.writeText(data?.link?.link).then(() => {
                toast("¡Enlace copiado!", {
                  description:
                    "El enlace ha sido copiado correctamente al portapapeles.",
                  action: {
                    label: "Abrir enlace",
                    onClick: () => window.open(data?.link?.link, "_blank"), // Abre el enlace en una nueva pestaña
                  },
                });
              });
              }}>
                Copiar link
              </Button>
              <Button className="w-full  bg-blue-500 hover:bg-blue-600 text-white"  onClick={onEnviarCorreo} disabled={isLoadingCorreo}>
                {!isLoadingCorreo ? ("Enviar correo"):(<><Loader2 className="animate-spin"/>Enviando correo...</>)}
              </Button>
              <Button className="w-full  bg-green-600 hover:bg-green-700 text-white"  onClick={onEnviarSMS} disabled={ isLoadingSms}>
              {
                  isLoadingSms ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Enviando SMS...
                  </>
                ) : (
                  "Enviar SMS"
                )
              }
              </Button>
              <Button className="w-full  bg-yellow-500 hover:bg-yellow-600 text-white"  onClick={()=>{setEnablePdf(true)}} disabled={loadingPdf}>
              {!loadingPdf ? ("Descargar PDF"):(<><Loader2 className="animate-spin"/>Descargando PDF...</>)}
              </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
