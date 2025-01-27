/* eslint-disable react/no-children-prop */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,DialogOverlay
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import CalendarDays from "../calendar-days";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { GeneratedPassModal } from "./generated-pass-modal";
import { Access_pass, Areas, Comentarios, enviar_pre_sms, Link, useCreateAccessPase } from "@/hooks/useCreateAccessPass";

interface EntryPassUpdateModalProps {
  title: string;
  data: {
    nombre: string;
    email: string;
    telefono: string;
    ubicacion: string;
    tema_cita: string;
    descripcion: string;
    perfil_pase: string,
    status_pase:string,
    visita_a: string,
    custom: boolean,
    link:Link,
    enviar_correo_pre_registro: string[],
    tipo_visita_pase:string;
    fechaFija:string;
    fecha_desde_visita: string;
    fecha_desde_hasta: string;
    config_dia_de_acceso:string;
    config_dias_acceso: string[];
    config_limitar_acceso: number;
    areas: Areas[];
    comentarios: Comentarios[];
    enviar_pre_sms: enviar_pre_sms
  };
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}

export const EntryPassModal: React.FC<EntryPassUpdateModalProps> = ({
  title,
  data,
  isSuccess,
  setIsSuccess,
}) => {
  console.log("ENTRANDO MODAL", data);

  const items =
    data?.tipo_visita_pase === "fecha_fija"
      ? [
          {
            icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
            title: "Fecha y Hora de Visita",
            date: data?.fecha_desde_visita,
          },
        ]
      : [
          {
            icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
            title: "Fecha Inicio",
            date: data?.fecha_desde_visita,
          },
          {
            icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
            title: "Fecha Hasta",
            date: data?.fecha_desde_hasta,
          },
        ];

  const [sendData, setSendData] = useState<Access_pass|null>(null)
  const [sendPreSms, setSendPreSms] = useState<enviar_pre_sms|null>(null)
  const { data:responseCreatePase, isLoading:loadingCreatePase, refetch: refetchCreatePase } = useCreateAccessPase(data?.ubicacion, sendData, sendPreSms );
  const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);
  const [link, setLink] = useState("");
  const account_id = parseInt(localStorage.getItem("userId_soter") || "0", 10);

  const onSubmit = async () => {
    console.log("Datos en el Modal", data);

    const accessPassData: Access_pass = {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      ubicacion: data.ubicacion,
      tema_cita: data.tema_cita,
      descripcion: data.descripcion,
      perfil_pase: data.perfil_pase,
      status_pase: data.status_pase,
      visita_a: data.visita_a,
      custom: data.custom,
      link: {
        link: data.link.link,
        docs: data.link.docs,
        creado_por_id: data.link.creado_por_id,
        creado_por_email: data.link.creado_por_email,
      },
      enviar_correo_pre_registro: data.enviar_correo_pre_registro,
      tipo_visita_pase: data.tipo_visita_pase,
      fechaFija: data.fechaFija,
      fecha_desde_visita: data.fecha_desde_visita,
      fecha_desde_hasta: data.fecha_desde_hasta,
      config_dia_de_acceso: data.config_dia_de_acceso,
      config_dias_acceso: data.config_dias_acceso,
      config_limitar_acceso: data.config_limitar_acceso,
      areas: data.areas,
      comentarios: data.comentarios,
      enviar_pre_sms: {
        from: data.enviar_pre_sms.from,
        mensaje: data.enviar_pre_sms.mensaje,
        numero: data.enviar_pre_sms.numero,
      },
    };
    setSendData(accessPassData)
    const enviarPreSms : enviar_pre_sms= {
      from: data.enviar_pre_sms.from,
      mensaje: data.enviar_pre_sms.mensaje,
      numero: data.enviar_pre_sms.numero,
    };
    setSendPreSms(enviarPreSms)
  };

  useEffect(()=>{
    if(sendPreSms && sendData ){
      console.log("INFORMACION",sendPreSms, sendData)
      refetchCreatePase()
    }
  },[sendData])

  useEffect(()=>{
    if(responseCreatePase?.success){
    }
      const protocol = window.location.protocol;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
      const host = window.location.host;
      let docs=""
      sendData?.link.docs.map((d, index)=>{
        if(d == "agregarIdentificacion"){
          docs+="iden"
        }
        else if(d == "agregarFoto"){
          docs+="foto"
        }
        if (index==0){
          docs+="-"
        }
      })
      setLink(`${protocol}//${host}/dashboard/pase-update?id=${responseCreatePase?.response.data.json.id}&user=${account_id}&docs=${docs}`)
      setOpenGeneratedPass(true)
  },[responseCreatePase])

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess}  >
      <DialogOverlay className="fixed inset-0 bg-black opacity-50" />
      <DialogContent
          className="max-w-xl max-h-[90vh] overflow-scroll bg-white rounded-lg shadow-xl"
          aria-labelledby="dialog-title"
        >
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
        </div>
        {data?.areas.length > 0 ? (
          <>
              {/* Áreas de acceso */}
              <div className="flex flex-col space-y-5">
                <p className="text-xl font-bold">Áreas de acceso</p>
                {data?.areas.map((area, index) => (
                  <div className="flex justify-between" key={index}>
                    <div className="w-full">
                      <p className="font-bold">Área</p>
                      <p className="text-sm">{area?.nombre_area}</p>
                    </div>

                    <div className="w-full">
                      <p className="font-bold">Comentarios</p>
                      <p className="text-sm">{area?.comentario_area}</p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
              </div>
          </>
        ): null}

        {/* Comentarios/Instrucciones */}
        {data?.comentarios.length > 0 ? (
          <>
              <div className="flex flex-col space-y-5">
                <p className="text-xl font-bold">Comentarios/Instrucciones</p>
                {data?.comentarios.map((comentario, index) => (
                  <div className="flex" key={index}>
                    <div className="w-full">
                      <p className="font-bold">Tipo</p>
                      <p className="text-sm">{comentario?.tipo_comentario}</p>
                    </div>

                    <div className="w-full">
                      <p className="font-bold">Comentarios</p>
                      <p className="text-sm">{comentario?.comentario_pase}</p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
              </div>
          </>
        ): null}
        

        {/* Vigencia y Acceso */}

        <div className="flex flex-col space-y-5">
          <p className="text-xl font-bold">Vigencia y Accesos</p>

          <div className="max-w-[520px] space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-md p-3 border border-gray-200"
              >
                {/* Ícono */}
                <div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg">
                  {item.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{item?.title}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      {item?.date?.replace("T", " ").slice(0, 16)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />
        </div>

        {/* Días Seleccionados */}
        {data?.config_dias_acceso.length > 0 ? (
        <div className="flex flex-col space-y-5">
          <CalendarDays diasDisponibles = {data?.config_dias_acceso}/>
        </div>
        ):null}

        {data?.config_limitar_acceso > 0 ? (
            <>
              <div className="w-full flex flex-wrap gap-2">
                <p className="font-bold">Limite de accesos : </p>
                <p className="">{data?.config_limitar_acceso}</p>
              </div>
            </>
          ):null}
        

        <div className="flex gap-5 my-5">
          <DialogClose asChild
            disabled={loadingCreatePase}>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          {responseCreatePase?.success === true ? (
            <GeneratedPassModal
              title="Pase de Entrada Generado "
              description="El pase de entrada se ha generado correctamente. Por favor, copie el siguiente enlace y compártalo con el visitante para completar el proceso."
              link={link}
              openGeneratedPass={openGeneratedPass}
              setOpenGeneratedPass={setOpenGeneratedPass} children={undefined}/>
            
          ):null}
          
          <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" onClick={onSubmit}>
                { !loadingCreatePase ? ("Crear pase"):(<> <Loader2 className="animate-spin"/> Creando pase...</>)}
              </Button>
             
          
        </div>
      </DialogContent>
    </Dialog>
  );
};
