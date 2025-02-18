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
import { sweetAlert } from "@/lib/utils";
import { useSendCorreo } from "@/hooks/useSendCorreo";
import { data_sms } from "@/lib/send-sms";
import { data_correo } from "@/lib/send_correo";
import { useSendSMS } from "@/hooks/useSendSMS";
import { Equipo_bitacora } from "../table/bitacoras/bitacoras-columns";
import Image from "next/image";


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
    grupo_equipos:Equipo_bitacora[];
  };
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewPassModal: React.FC<ViewPassModalProps> = ({
  title,
  data,
  children,
}) => {
  const account_id = parseInt(localStorage.getItem("userId_soter") || "0", 10);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(["enviar_correo"]); 
  const [dataCorreo, setDataCorreo]= useState<data_correo|null>(null)
  const [dataSMS, setDataSMS]= useState<data_sms|null>(null)
  const { data: responsePdf, isLoading: loadingPdf} = useGetPdf(account_id, data._id);
  const { data: responseSendCorreo, isLoading: loadingCorreo, refetch:refetchCorreo } = useSendCorreo(account_id, selectedOptions,dataCorreo,data._id);
  const { data: responseSendSMS, isLoading: loadingSMS, refetch:refetchSMS} =  useSendSMS(account_id, selectedOptions, dataSMS, data._id)


useEffect(()=>{
  if(dataCorreo){
    refetchCorreo()
  }
},[dataCorreo,refetchCorreo])

useEffect(()=>{
  if(dataSMS){
    refetchSMS()
  }
},[dataSMS,refetchSMS])


useEffect(()=>{
  if(responseSendCorreo){
    if(responseSendCorreo.success){
      toast.success("¡Correo enviado correctamente!");
    }
  }
},[responseSendCorreo])

useEffect(()=>{
  if(responseSendSMS){
    if(responseSendSMS.success){
      toast.success("¡Mensaje enviado correctamente!");
    }
  }
},[responseSendSMS])

function onEnviarCorreo(){
  if(data?.status_pase.toLowerCase()=='activo'){
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
        setDataCorreo(data_for_msj)
    }else{
      sweetAlert("warning", "Validación", "Ingresa un correo valido.")
    }
  }else{
    sweetAlert("error", "Validación", "El pase de entrada debe haber sido completado por el visitante con anterioridad para poder enviar el correo.")
  }
}

function onEnviarSMS(){
  if(data?.status_pase.toLowerCase()=='activo'){
    if(data?.telefono!==""){
      setSelectedOptions(["enviar_msj"])
           const data_cel_msj = {
            mensaje: `Estimado ${data.nombre}, ${data.visita_a.length>0 ? data.visita_a[0].nombre :''}, te esta invitando a: ${data.ubicacion}, Descarga tu pase en: ${responsePdf.response?.data?.data?.download_url}`,
            numero: data.telefono
        }
        setDataSMS(data_cel_msj)
    }else{
      sweetAlert("warning", "Validación", "Ingresa un teléfono valido.")
    }
  }else{
    sweetAlert("error", "Validación", "El pase de entrada debe haber sido completado por el visitante con anterioridad para poder enviar el sms.")
  }
}

async function onDescargarPDF(){
  await descargarPdfPase(responsePdf.response?.data?.data?.download_url)
  toast.success("¡PDF descargado correctamente!");
}

  return (
    // open={isSuccess} onOpenChange={setIsSuccess}
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Sobre la visita */}
        <div className="w-full ">
            <p className="font-bold ">Nombre Completo : </p>
            <p className="">{data?.nombre} </p>
          </div>

        <div className="flex flex-col space-y-5">
          <div className=" flex justify-between">
            <div className="w-full ">
              <p className="font-bold">Tipo de pase : </p>
              <p >Visita General</p>
            </div>

            <div className="w-full ">
              <p className="font-bold">Estatus : </p>
              <p className=" text-red-500"> Proceso</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full  ">
              <p className="font-bold">Email : </p>
              <p className="w-full break-words">{data?.email}</p>
            </div>

            <div className="w-full ">
              <p className="font-bold">Teléfono : </p>
              <p className="text-sm">{data?.telefono}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full  ">
              <p className="font-bold">Tema cita : </p>
              <p className="w-full break-words">{data?.tema_cita}</p>
            </div>

            <div className="w-full ">
              <p className="font-bold">Descripción : </p>
              <p className="w-full break-words">{data?.descripcion} </p>
            </div>
          </div>
          <Separator className="my-4" />

          <div className="flex justify-between">
            {data?.foto!== undefined && data?.foto.length > 0 ?(
                <><div className="w-full ">
                    <p className="font-bold mb-3">Fotografia:</p>
                    <div className="w-full flex justify-center">
                        <Image
                        src={data?.foto[0].file_url  } 
                        alt="Imagen"
                        width={150}
                        height={150}
                        className=" h-32 object-contain bg-gray-200 rounded-lg" 
                        />
                    </div>
                </div>
                </>
            ):null}


            {data?.identificacion!== undefined && data?.identificacion.length > 0 ?(
                <><div className="w-full ">
                        <p className="font-bold mb-3">Identificacion:</p>
                        <div className="w-full flex justify-center">
                            <Image
                            src={data?.identificacion[0].file_url  } 
                            alt="Imagen"
                            width={150}
                            height={150}
                            className=" h-32 object-contain bg-gray-200 rounded-lg" 
                            />
                        </div>
                    </div>
                </>
            ):null}
          </div>

          <Separator className="my-4" />

          {data?.grupo_equipos.length>0 && (
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
          )}

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

        {/* {data?.grupo_equipos.length>0 && (
          <div className="">
            <p className="text-2xl font-bold mb-2">Equipos</p>
            <Accordion type="single" collapsible>
              {data?.grupo_equipos.map((equipo, index) => (
                <AccordionItem key={index} value={`equipo-${index}`}>
                  <AccordionTrigger>{`Equipo ${index + 1}`}</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium mb-1">
                      Tipo: <span className="">{equipo.tipo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Equipo: <span className="">{equipo.nombre || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Marca: <span className="">{equipo.marca || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Modelo: <span className="">{equipo.modelo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Número de Serie:{" "}
                      <span className="">{equipo.serie || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Color: <span className="">{equipo.color || "N/A"}</span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          )}

          {data?.grupo_vehiculos.length>0 && (
          <div className="">
            <p className="text-2xl font-bold mb-2">Vehículos</p>
            <Accordion type="single" collapsible>
              {data?.grupo_vehiculos.map((vehiculo, index) => (
                <AccordionItem key={index} value={`vehiculo-${index}`}>
                  <AccordionTrigger>{`Vehículo ${index + 1}`}</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium mb-1">
                      Tipo de Vehículo:{" "}
                      <span className="">{vehiculo.tipo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Marca:{" "}
                      <span className="">{vehiculo.marca || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Modelo:{" "}
                      <span className="">{vehiculo.modelo || "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Estado:{" "}
                      <span className="">{vehiculo.estado || "N/A"}</span>
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
          )} */}
        <div className="flex gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
            {/* {
              isLoading ? (
                <>
                <Button className="w-full h-12  bg-blue-500" disabled>
                  <Loader2 className="animate-spin"/>
                  Cargando...
                </Button>
                </>
              ):(
                <> */}
               <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" onClick={() => {
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
                <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"  onClick={onEnviarCorreo} disabled={loadingCorreo}>
                  {!loadingCorreo ? ("Enviar correo"):(<><Loader2 className="animate-spin"/>Enviando correo...</>)}
                </Button>
                <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"  onClick={onEnviarSMS} disabled={loadingPdf || loadingSMS}>
                {
                  loadingPdf ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Cargando...
                    </>
                  ) : loadingSMS ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Enviando SMS...
                    </>
                  ) : (
                    "Enviar SMS"
                  )
                }
                </Button>
                <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"  onClick={onDescargarPDF} disabled={loadingPdf}>
                {!loadingPdf ? ("Descargar PDF"):(<><Loader2 className="animate-spin"/>Descargando PDF...</>)}
                </Button>
          {/*</>
               )
            } */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
