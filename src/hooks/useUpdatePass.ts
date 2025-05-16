import { Equipo, Imagen, UpdatePase, Vehiculo } from "@/lib/update-pass";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { errorMsj } from "@/lib/utils";


export type Update_pass = {
  nombre_pase?: string,
  email_pase?: string,
  telefono_pase?: string,
  ubicacion?: string,
  tema_cita?: string,
  descripcion?: string,
  perfil_pase?: string,
  status_pase?: string,
  visita_a?: string,
  link?: {
    link: string,
    docs: string,
    qr_code: string,
    creado_por_id: number,
    creado_por_email:string 
  },
  qr_pase?: string,
  tipo_visita?:string ,
  enviar_correo_pre_registro?: string[],
  tipo_visita_pase?: string,
  fecha_desde_visita?: string,
  fecha_desde_hasta?: string,
  config_dia_de_acceso?: string,
  config_dias_acceso?: string,
  config_limitar_acceso?: number,
  grupo_vehiculos?:Vehiculo[],
  grupo_equipos?:Equipo[],
  autorizado_por?: string,
  walkin_fotografia?: Imagen[],
  walkin_identificacion?:Imagen[],
  enviar_correo?: string[],
  acepto_aviso_privacidad?:string,
	acepto_aviso_datos_personales?:string,
	conservar_datos_por?:string
}


export const useUpdateAccessPass = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const queryClient = useQueryClient();
  
  // const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
  //   queryKey: ["useUpdateAccessPass", access_pass, id, account_id], // Agregamos los parámetros necesarios aquí
  //   queryFn: async () => {
  //     const data = await UpdatePase({
  //       access_pass,
  //       id,
  //       account_id,
  //     });
  //     return data.response?.data.areas_by_location;
  //   },
  // });

      const updatePassMutation = useMutation({
        mutationFn: async ({ access_pass, id, account_id} : {access_pass: Update_pass, id:string, account_id:number }) => {
            const data = await UpdatePase({
              access_pass,
              id,
              account_id,
            });
            const hasError= data.response.data.status_code

            if(hasError == 400 || hasError == 401){
                const textMsj = errorMsj(data.response.data) 
                throw new Error(`Error al actualizar pase, Error: ${textMsj?.text}`);
            }else{
                return data.response?.data
            }
        },
        onMutate: () => {
          setIsLoadingUpdate(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getMyPases"] });
          queryClient.invalidateQueries({ queryKey: ["getUserContacts"] });
          toast.success("Pase de entrada actualizado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear el pase de entrada:", err);
          toast.error(err.message || "Hubo un error al actualizar el pase de entrada.");
    
        },
        onSettled: () => {
          setIsLoadingUpdate(false);
        },
      });


  return {
    // data,
    // isLoading,
    // error,
    // isFetching,
    // refetch,
    updatePassMutation,
    isLoadingUpdate
  };
};

