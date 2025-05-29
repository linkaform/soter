import { createPase } from "@/lib/create-access-pass";
import { getConfSeguridad } from "@/lib/get-configuracion-seguridad";
import { Imagen, UpdatePase } from "@/lib/update-pass";
import { Equipo, UpdatePaseFull, Vehiculo } from "@/lib/update-pass-full";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery ,useQueryClient} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export type Link = {
  link: string;
  docs: string[];
  creado_por_id: number;
  creado_por_email: string;
};

export type enviar_pre_sms={ 
  from: string,
  mensaje: string,
  numero: string
}

export type Areas={
  nombre_area: string,
  commentario_area: string
}

export type Comentarios={
  tipo_comentario: string,
  comentario_pase: string
}


export type Access_pass={
    nombre:string,
    empresa:string,
    email:string,
    telefono:string,
    ubicacion:string,
    tema_cita:string,
    descripcion:string,
    perfil_pase: string,
    status_pase:string,
    visita_a: string,
    custom: boolean,
    link:Link,
    enviar_correo_pre_registro?: string[], 
    tipo_visita_pase: string,
    fechaFija:string,
    fecha_desde_visita:string,
    fecha_desde_hasta:string,
    config_dia_de_acceso: string,
    config_dias_acceso?: string[],
    config_limitar_acceso: number,
    areas?: Areas[],
    comentarios?: Comentarios[],
    enviar_pre_sms:enviar_pre_sms,

}


export type Update_full_pass = {
      nombre_pase: string,
      email_pase: string,
      telefono_pase: string,
      ubicacion: string,
      tema_cita: string,
      descripcion: string,
      perfil_pase: string,
      status_pase: string,
      visita_a: string,
      link: {
        link: string,
        docs: string,
        qr_code: string,
        creado_por_id: number,
        creado_por_email:string 
      },
      qr_pase: string,
      tipo_visita:string ,
      enviar_correo_pre_registro: string[],
      tipo_visita_pase: string,
      fecha_desde_visita: string,
      fecha_desde_hasta: string,
      config_dia_de_acceso: string,
      config_dias_acceso: string,
      config_limitar_acceso: string,
      grupo_areas_acceso: Areas[],
      grupo_instrucciones_pase:Comentarios[],
      grupo_vehiculos:Vehiculo[],
      grupo_equipos:Equipo[],
      autorizado_por: string,
      walkin_fotografia: Imagen[],
      walkin_identificacion:Imagen[],
      enviar_correo: string[]
}

export const usePaseEntrada = (locationConfSeguridad:string) => {
  const router = useRouter(); 
    const { data: dataConfigLocation, isLoading:isLoadingConfigLocation, error: errorConfigLocation} = useQuery<any>({
        queryKey: ["getConfSeguridad", locationConfSeguridad], 
        enabled: locationConfSeguridad!=="" ? true:false, 
        queryFn: async () => {
            const data = await getConfSeguridad(locationConfSeguridad); 
            return data.response?.data || []; 
        },
       
        refetchOnWindowFocus: true, 
        refetchInterval: 60000,
        refetchOnReconnect: true, 
        staleTime: 1000 * 60 * 5, 
      });

    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();
    const [responseCreatePase, setResponseCreatePase] = useState<any>();

     //Crear Incidencia
     const createPaseEntradaMutation = useMutation({
        mutationFn: async ({ access_pass, location, enviar_pre_sms} : {access_pass: Access_pass, location:string, enviar_pre_sms:enviar_pre_sms }) => {
            const data = await createPase({
                access_pass,
                location,
                enviar_pre_sms,
              });
            const hasError= data.response.data.status_code

            if(hasError == 400 || hasError == 401){
                const textMsj = errorMsj(data.response.data) 
                throw new Error(`Error al crear pase, Error: ${textMsj?.text}`);
            }else{
                setResponseCreatePase(data.response?.data)
                return data.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getMyPases"] });
          queryClient.invalidateQueries({ queryKey: ["getUserContacts"] });
          toast.success("Pase de entrada creado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear el pase de entrada:", err);
          toast.error(err.message || "Hubo un error al crear el pase de entrada.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });
      //Actualizar pase da entrada
      const updatePaseEntradaMutation = useMutation({
        mutationFn: async ({ access_pass, id, account_id} : { access_pass: Update_full_pass, id:string, account_id:number }) => {
            const response = await UpdatePase({access_pass, id, account_id});
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al actualizar pase de entrada, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
          toast.success("Pase de entrada actualizado correctamente.");
        },
        onError: (err) => {
          console.error("Error al actulizar pase de entrada:", err);
          toast.error(err.message || "Hubo un error al actualizar el pase de entrada.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Actualizar pase de entrada completo
      const updatePaseEntradaFullMutation = useMutation({
        mutationFn: async ({ access_pass, id, folio, location} : { access_pass: Update_full_pass |null, id:string, folio:string, location:string }) => {
            const response = await UpdatePaseFull({access_pass, id, folio, location});
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al editar pase de entrada, Error: ${textMsj?.text}`);
            }else{
              setResponseCreatePase(response.response?.data)
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
          toast.success("Pase de entrada editado correctamente.");
        },
        onError: (err) => {
          toast.error(err.message || "Hubo un error al editar el pase entrada.");
    
        },
        onSettled: () => {
          setLoading(false);
          router.push(`/dashboard/pases`)
        },
      });

  return {
    //Create Pase
    createPaseEntradaMutation,
    responseCreatePase,
    //Update Pase
    updatePaseEntradaMutation,
    updatePaseEntradaFullMutation,
    isLoading,
    //Configuracion Seguridad
    dataConfigLocation,
    isLoadingConfigLocation,
    errorConfigLocation
  };
};

