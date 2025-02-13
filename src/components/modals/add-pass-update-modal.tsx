/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import { GeneratedPassModal } from "./generated-pass-modal";
import { Access_pass, Areas, Comentarios, enviar_pre_sms, Link } from "@/hooks/useCreateAccessPass";
import { createPase } from "@/lib/create-access-pass";

interface EntryPassModalProps {
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

export const EntryPassModal: React.FC<EntryPassModalProps> = ({
  title,
  data,
  isSuccess,
  setIsSuccess,
}) => {

  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);

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

    const enviarPreSms = {
      from: data.enviar_pre_sms.from,
      mensaje: data.enviar_pre_sms.mensaje,
      numero: data.enviar_pre_sms.numero,
    };

    try {
      setIsLoading(true);
      const location=data.ubicacion
      const apiResponse = await createPase({access_pass:accessPassData , location, enviar_pre_sms:enviarPreSms});
      setResponse(apiResponse); // Guardar la respuesta en el estado
      setIsSuccess(true); // Marcar el éxito
    } catch (err) {
      console.error("Error al crear el pase:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess}>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-scroll">
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


        <div className="flex gap-5 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>


          { isLoading && response?.success ? ( 
            <GeneratedPassModal
              title="Pase de Entrada Generado "
              description="El pase de entrada se ha generado correctamente. Por favor, copie el siguiente enlace y compártalo con el visitante para completar el proceso."
              link={"https://app.linkaform.com/api/infosync/scripts/run/"} children={undefined} 
              openGeneratedPass={openGeneratedPass}
              setOpenGeneratedPass={setOpenGeneratedPass}
              >
            </GeneratedPassModal>
          ):null}

            {
              isLoading ? (
                <>
                <Button className="w-full h-12  bg-blue-500" disabled>
                  <Loader2 className="animate-spin"/>
                  Creando pase...
                </Button>
                </>
              ):(
                <>
                <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" type="submit" onClick={onSubmit}>
                  Crear pase
                </Button>
          </>
              )
            }
          
        </div>
      </DialogContent>
    </Dialog>
  );
};
