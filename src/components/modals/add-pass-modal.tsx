/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import CalendarDays from "../calendar-days";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { GeneratedPassModal } from "./generated-pass-modal";
import { Access_pass, Areas, Comentarios, enviar_pre_sms, Link } from "@/hooks/useCreateAccessPass";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { usePaseEntrada } from "@/hooks/usePaseEntrada";
import useAuthStore from "@/store/useAuthStore";


export type Visita={
  puesto: string;
  nombre: string;
  user_id: string;
  email: string;
  departamento:string;
}
interface EntryPassUpdateModalProps {
  title: string;
  dataPass: {
    nombre: string;
	empresa:string;
    email: string;
    telefono: string;
    ubicacion: string;
	ubicaciones:string[];
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
  onClose: ()=> void;
 
}

export const EntryPassModal: React.FC<EntryPassUpdateModalProps> = ({
  title,
  dataPass,
  isSuccess,
  setIsSuccess,
  onClose,
}) => {
  const items =
  dataPass?.tipo_visita_pase === "fecha_fija"
      ? [
          {
            icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
            title: "Fecha y Hora de Visita",
            date: dataPass?.fecha_desde_visita,
          },
        ]
      : [
          {
            icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
            title: "Fecha Inicio",
            date: dataPass?.fecha_desde_visita,
          },
          {
            icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
            title: "Fecha Hasta",
            date: dataPass?.fecha_desde_hasta,
          },
        ];

  const [sendData, setSendData] = useState<Access_pass|null>(null)
  const [sendPreSms, setSendPreSms] = useState<enviar_pre_sms|null>(null)
  const {userIdSoter }= useAuthStore()
  const { createPaseEntradaMutation , responseCreatePase, isLoading} = usePaseEntrada([])
  const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);
  const [link, setLink] = useState("");
  const[ account_id, setAccount_id] = useState<number|null>(null)
  const [hostPro, setHostPro] = useState({ protocol: '', host: '' });

  const onSubmit = async () => {
    const accessPassData: Access_pass = {
      nombre: dataPass.nombre,
	  empresa: dataPass.empresa||"",
      email: dataPass.email,
      telefono: dataPass.telefono,
      ubicacion: dataPass.ubicacion,
	  ubicaciones: dataPass.ubicaciones,
      tema_cita: dataPass.tema_cita,
      descripcion: dataPass.descripcion,
      perfil_pase: dataPass.perfil_pase,
      status_pase: dataPass.status_pase,
      visita_a: dataPass.visita_a,
      custom: dataPass.custom,
      link: {
        link: dataPass.link.link,
        docs: dataPass.link.docs,
        creado_por_id: dataPass.link.creado_por_id,
        creado_por_email: dataPass.link.creado_por_email,
      },
      enviar_correo_pre_registro: dataPass.enviar_correo_pre_registro,
      tipo_visita_pase: dataPass.tipo_visita_pase,
      fechaFija: dataPass.fechaFija,
      fecha_desde_visita: dataPass.fecha_desde_visita,
      fecha_desde_hasta: dataPass.fecha_desde_hasta,
      config_dia_de_acceso: dataPass.config_dia_de_acceso,
      config_dias_acceso: dataPass.config_dias_acceso,
      config_limitar_acceso: dataPass.config_limitar_acceso,
      areas: dataPass.areas,
      comentarios: dataPass.comentarios,
      enviar_pre_sms: {
        from: dataPass.enviar_pre_sms.from,
        mensaje: dataPass.enviar_pre_sms.mensaje,
        numero: dataPass.enviar_pre_sms.numero,
      },
    };
    const enviarPreSms : enviar_pre_sms= {
      from: dataPass.enviar_pre_sms.from,
      mensaje: dataPass.enviar_pre_sms.mensaje,
      numero: dataPass.enviar_pre_sms.numero,
    };
    setSendPreSms(enviarPreSms)
    setSendData(accessPassData)
  };

	useEffect(() => {
		if (typeof window !== "undefined") {
		  const protocol = window.location.protocol;
		  const host = window.location.host;
		  setHostPro({ protocol, host });
		  setAccount_id(userIdSoter);
		}
	  }, []);

  useEffect(()=>{
    if(sendPreSms && sendData ){
      createPaseEntradaMutation.mutate({ access_pass:sendData, location:dataPass?.ubicacion??"", enviar_pre_sms: sendPreSms })
    }
  },[ sendData, sendPreSms])


  useEffect(()=>{
    if(responseCreatePase?.status_code == 201){
    }
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
      setLink(`${hostPro.protocol}//${hostPro.host}/dashboard/pase-update?id=${responseCreatePase?.json.id}&user=${account_id}&docs=${docs}`)
      setOpenGeneratedPass(true)
  },[responseCreatePase])

  const handleClose = () => {
    setIsSuccess(false); 
    onClose(); 
};

  return (
    <Dialog open={isSuccess}  modal >
		<DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col " aria-describedby="">
			<DialogHeader className="flex-shrink-0">
				<DialogTitle className="text-2xl text-center font-bold">
					{title}
				</DialogTitle>
			</DialogHeader>
			<div className="flex-grow overflow-y-auto p-4 ">
				{/* Sobre la visita */}
				<div className="w-full flex gap-2 mb-3">
					<p className="font-bold flex-shrink-0">Nombre Completo : </p>
					<p className="">{dataPass?.nombre} </p>
				</div>

				<div className="flex flex-col space-y-5">
				<div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0 ">
					<div className="w-full flex gap-2 ">
					<p className="font-bold flex-shrink-0">Tipo de pase : </p>
					<p >Visita General</p>
					</div>

					<div className="w-full flex gap-2">
					<p className="font-bold flex-shrink-0">Estatus : </p>
					<p className=" text-red-500"> Proceso</p>
					</div>
				</div>

				<div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0">
					<div className="w-full flex gap-2 ">
					<p className="font-bold flex-shrink-0">Email : </p>
					<p className="w-full break-words">{dataPass?.email}</p>
					</div>

					<div className="w-full flex gap-2">
					<p className="font-bold flex-shrink-0">Teléfono : </p>
					<p className="text-sm">{dataPass?.telefono}</p>
					</div>
				</div>

				<div className="flex justify-between flex-col sm:flex-row sm:space-x-5 space-y-5 sm:space-y-0">
					<div className="w-full  flex gap-2">
					<p className="font-bold flex-shrink-0">Tema cita : </p>
					<p className="w-full break-words">{dataPass?.tema_cita}</p>
					</div>

					<div className="w-full flex gap-2">
					<p className="font-bold flex-shrink-0">Descripción : </p>
					<p className="w-full break-words ">{dataPass?.descripcion} </p>
					</div>
				</div>
				<Separator className="my-4" />
				</div>

				{dataPass?.areas.length>0 && (
				<div className="">
					<p className="text-2xl font-bold mb-2">Areas</p>
					<Accordion type="single" collapsible>
					{dataPass?.areas.map((area, index) => (
						<AccordionItem key={index} value={`area-${index}`}>
						<AccordionTrigger><div className="w-80 truncate text-left">{`${area.nombre_area}`}</div></AccordionTrigger>
						<AccordionContent>
							<p className="font-medium mb-1">
							Area: <span className="">{area.nombre_area || "N/A"}</span>
							</p>
							<p className="font-medium mb-1">
							Comentario: <span className="">{area.commentario_area || "N/A"}</span>
							</p>
						</AccordionContent>
						</AccordionItem>
					))}
					</Accordion>
				</div>
				)}

				{dataPass?.comentarios.length>0 && (
				<div className="">
				<p className="text-2xl font-bold mb-2">Comentarios / Instrucciones</p>
				<Accordion type="single" collapsible>
					{dataPass?.comentarios.map((com, index) => (
					<AccordionItem key={index} value={`com-${index}`}>
						<AccordionTrigger>
						<div className="w-80 truncate text-left">{`${com.comentario_pase}`}</div>
						</AccordionTrigger>
						<AccordionContent>
						<p className="font-medium mb-1">
							Comentario:{" "}
							<span className="">{com.comentario_pase || "N/A"}</span>
						</p>
						</AccordionContent>
					</AccordionItem>
					))}
				</Accordion>
				</div>
				)}

				{/* Vigencia y Acceso */}
				<div className="flex flex-col space-y-5">
				<p className="text-xl font-bold">Vigencia y Accesos</p>
				<div className="max-w-[520px] space-y-4">
					{items.map((item, index) => (
					<div
						key={index}
						className="flex items-center space-x-4 rounded-md p-3 border border-gray-200"
					>
						<div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg">
						{item.icon}
						</div>
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
				{dataPass?.config_dias_acceso.length > 0 ? (
				<div className="flex flex-col space-y-5">
				<CalendarDays diasDisponibles = {dataPass?.config_dias_acceso}/>
				</div>
				):null}

				{dataPass?.config_limitar_acceso > 0 ? (
					<>
					<div className="w-full flex flex-wrap gap-2 mt-2">
						<p className="font-bold">Limite de accesos : </p>
						<p className="">{dataPass?.config_limitar_acceso}</p>
					</div>
					</>
				):null}
			</div>
			<div className="flex gap-5 my-5">
			<DialogClose asChild
				disabled={isLoading}>
				<Button className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
				Cancelar
				</Button>
			</DialogClose>

			{responseCreatePase?.status_code == 201 ? (
				<GeneratedPassModal
				title="Pase de Entrada Generado "
				description="El pase de entrada se ha generado correctamente. Por favor, copie el siguiente enlace y compártalo con el visitante para completar el proceso."
				link={link}
				openGeneratedPass={openGeneratedPass}
				setOpenGeneratedPass={setOpenGeneratedPass} />
				
			):null}
			
			<Button className="w-1/2  bg-blue-500 hover:bg-blue-600 text-white" onClick={onSubmit} disabled={isLoading}>
					{ !isLoading ? (<>
					{("Crear pase")}
					</>) :(<> <Loader2 className="animate-spin"/> {"Creando pase..."} </>)}
				</Button>
			</div>
      	</DialogContent>
    </Dialog>
  );
};
