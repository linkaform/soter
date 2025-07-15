/* eslint-disable react-hooks/exhaustive-deps */

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CalendarClock, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { GeneratedPassModal } from "./generated-pass-modal";
import CalendarDays from "../calendar-days";
import { Areas, Comentarios } from "@/hooks/useCreateAccessPass";
import useAuthStore from "@/store/useAuthStore";
import { Update_full_pass, usePaseEntrada } from "@/hooks/usePaseEntrada";
import { Badge } from "../ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";
// import { useRouter } from "next/navigation";

interface EntryPassModalUpdateProps {
  title: string;
  dataPass: any;
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  onClose: ()=> void;
  id:string;
  folio:string;
}

export const EntryPassModalUpdate: React.FC<EntryPassModalUpdateProps> = ({
  title,
  dataPass,
  isSuccess,
  setIsSuccess,
  onClose,
  id,
  folio,
}) => {
  const {userEmailSoter , userIdSoter}= useAuthStore()
  const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);
  const [sendDataUpdate, setSendDataUpdate] = useState<Update_full_pass|null>(null)

 
  const [docs, setDocs] = useState("");
  const [link, setLink] = useState("");
  const account_id = userIdSoter;
  const { updatePaseEntradaFullMutation, responseCreatePase, isLoading} = usePaseEntrada(dataPass?.ubicacion??"")
  const [hostPro, setHostPro] = useState({ protocol: '', host: '' });

	useEffect(() => {
	  if (typeof window !== "undefined") {
		const protocol = window.location.protocol;
		const host = window.location.host;
		setHostPro({ protocol, host });
	  }
   
    const params = new URLSearchParams(dataPass?.link.link.split('?')[0]);
    const docss = params.get('docs')??""; 
    setDocs(docss)
	}, []);

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



  const onSubmitEdit = async () => {
    const accessPassData = {
      nombre_pase: dataPass.nombre,
      email_pase: dataPass.email,
      telefono_pase: dataPass.telefono,
      ubicacion: dataPass.ubicacion,
      tema_cita: dataPass.tema_cita,
      descripcion: dataPass.descripcion,
      perfil_pase: dataPass.perfil_pase,
      status_pase: dataPass.status_pase,
      visita_a: dataPass.visita_a,
      link: {
        link: `${hostPro?.protocol}//${hostPro?.host}/pase-update.html`,
        docs: docs,
        qr_code: dataPass._id,
        creado_por_id: userIdSoter ?? 0,
        creado_por_email: userEmailSoter ?? ""
      },
      qr_pase:dataPass.qr_pase,
      tipo_visita: "alta_de_nuevo_visitante",
      enviar_correo_pre_registro: dataPass.enviar_correo_pre_registro,
      tipo_visita_pase: dataPass.tipo_visita_pase,
      fecha_desde_visita: dataPass.fecha_desde_visita.includes(":") && dataPass.fecha_desde_visita!==""? dataPass.fecha_desde_visita: dataPass.fecha_desde_visita!==""?`${dataPass.fecha_desde_visita}`+` 00:00:00`:"",
      fecha_desde_hasta: dataPass.fecha_desde_hasta.includes(":") && dataPass.fecha_desde_hasta!=="" ? dataPass.fecha_desde_hasta: dataPass.fecha_desde_hasta!==""?`${dataPass.fecha_desde_hasta}`+` 00:00:00`:"",
      config_dia_de_acceso: dataPass.config_dia_de_acceso,
      config_dias_acceso: dataPass.config_dias_acceso,
      config_limitar_acceso: dataPass.config_limitar_acceso,
      grupo_areas_acceso: dataPass.areas,
      grupo_instrucciones_pase:dataPass.comentarios,
      grupo_vehiculos:dataPass.grupo_vehiculos,
      grupo_equipos: dataPass.grupo_equipos,
      autorizado_por: userEmailSoter ??"",
      walkin_fotografia:dataPass.foto,
      walkin_identificacion:dataPass.identificacion,
      enviar_correo:[]
    };
      setSendDataUpdate(accessPassData)
  };

  const handleClose = () => {
      setIsSuccess(false); 
      onClose(); 
  };

  useEffect(()=>{
    if(sendDataUpdate ){
      updatePaseEntradaFullMutation.mutate({access_pass: sendDataUpdate, id, folio, location: dataPass?.ubicacion})
    }
  },[sendDataUpdate])

	// useEffect(()=>{
  //   console.log("abrir cerrar", responseUpdatePase)
	// 	if(responseUpdatePase?.status_code == 202){
  //     router.push(`/`); 
	// 	}
	// },[responseUpdatePase])

  useEffect(()=>{
    if(responseCreatePase?.status_code == 201|| responseCreatePase?.status_code == 202){
      let docs=""
      dataPass?.link.docs.map((d:string, index:number)=>{
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
      
    }
  },[responseCreatePase])

  useEffect(()=>{
    if(link){
      setOpenGeneratedPass(true)
    }
  },[link])


  return (
  //onOpenChange={setIsSuccess}
  <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
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
    <div className="w-full flex gap-2">
            <p className="font-bold flex-shrink-0">Nombre completo : </p>
            <p className="">{dataPass?.nombre} </p>
          </div>

        <div className="flex flex-col space-y-5">
          
          <div className="flex justify-between flex-col sm:flex-row sm:space-x-5 space-y-5 sm:space-y-0 ">
            <div className="w-full flex gap-2 ">
              <p className="font-bold flex-shrink-0">Tipo de pase : </p>
              <p >Visita General</p>
            </div>

            <div className="w-full flex gap-2">
              <p className="font-bold flex-shrink-0">Estatus : </p>
			  <Badge
					className={`text-white text-sm ${
						dataPass?.status_pase.toLowerCase() == "vencido"
						? "bg-red-600 hover:bg-red-600"
						: dataPass?.status_pase.toLowerCase() == "activo"
						? "bg-green-600 hover:bg-green-600"
						: dataPass?.status_pase.toLowerCase() == "proceso"
						? "bg-blue-600 hover:bg-blue-600"
						: "bg-gray-400"
					}`}
					>
					{capitalizeFirstLetter(dataPass?.status_pase ??"")}
				</Badge>
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

          <div className="flex justify-between flex-col sm:flex-row  sm:space-x-5 space-y-5 sm:space-y-0">
            <div className="w-full  flex gap-2">
              <p className="font-bold flex-shrink-0">Tema cita : </p>
              <p className="w-full break-words">{dataPass?.tema_cita}</p>
            </div>

            
          </div>
		  <div className="w-full flex flex-wrap gap-2">
              <p className="font-bold flex-shrink-0">Descripción : </p>
              <p className="w-full break-words ">{dataPass?.descripcion} </p>
            </div>
        </div>

        {dataPass?.areas.length>0 && (
          <div className="">
            <p className="text-xl font-bold mb-2">Áreas</p>
            <Accordion type="single" collapsible>
              {dataPass?.areas.map((area:Areas, index:number) => (
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
          <p className="text-xl font-bold mb-2">Comentarios / Instrucciones</p>
          <Accordion type="single" collapsible>
            {dataPass?.comentarios.map((com:Comentarios, index:number) => (
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
			<div className="flex gap-2">
				{items.map((item, index) => (
					<div
					key={index}
					className="flex items-center space-x-4 rounded-md p-3 border ">
						<div className=" rounded-lg">
						{item.icon}
						</div>

						<div className="flex flex-col">
							<p className="font-medium">{item?.title}</p>
							<p className="text-sm">
								{item?.date?.replace("T", " ").slice(0, 16)}
							</p>
						</div>
					</div>
				))}
			</div>

        </div>
        {dataPass?.config_limitar_acceso > 0 ? (
            <>
              <div className="w-full flex flex-wrap gap-2">
                <p className="font-bold">Limite de accesos : </p>
                <p className="">{dataPass?.config_limitar_acceso}</p>
              </div>
            </>
          ):null}
        {/* Días Seleccionados */}
        {dataPass?.config_dias_acceso.length > 0 ? (
        <div className="flex flex-col space-y-5">
          <CalendarDays diasDisponibles = {dataPass?.config_dias_acceso}/>
        </div>
        ):null}


        
    
    <div className="flex gap-5 my-5">
      <DialogClose asChild
        disabled={isLoading}>
        <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
          Cancelar
        </Button>
      </DialogClose>

      {openGeneratedPass? (
        <GeneratedPassModal
          title="Pase de Entrada Generado "
          description="El pase de entrada se ha generado correctamente. Por favor, copie el siguiente enlace y compártalo con el visitante para completar el proceso."
          link={link}
          openGeneratedPass={openGeneratedPass}
          setOpenGeneratedPass={setOpenGeneratedPass}/>
        
      ):null}
      
      <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" onClick={onSubmitEdit}>
            { !isLoading ? (<>
              {("Editar pase")}
            </>) :(<> <Loader2 className="animate-spin"/> {"Actualizando pase..."} </>)}
          </Button>
    </div>
  </DialogContent>
</Dialog>
);
};