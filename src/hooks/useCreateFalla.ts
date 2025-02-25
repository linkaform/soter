import { useQuery } from "@tanstack/react-query";

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

export const useCreateFalla = (location: string, access_pass: Access_pass|null, enviar_pre_sms: enviar_pre_sms|null) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["useCreateAccessPase", location, access_pass, enviar_pre_sms], // Agregamos los parámetros necesarios aquí
    enabled:false,
    queryFn: async () => {
      // const data = await createFalla({
      //   access_pass,
      //   location,
      //   enviar_pre_sms,
      // });
      // return data ;
      return true
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
