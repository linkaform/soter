/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogosPaseNoJwt } from "@/lib/get-catalogos_pase_no_jwt";
import { useQuery } from "@tanstack/react-query";


export interface Root {
  response?: Response
  success?: boolean
  log?: string
}

export interface Response {
  data?: Data | null
}

export interface Data {
  pass_selected?: PassSelected
  cat_estados?: string[]
  cat_vehiculos?: string[]
}

export interface PassSelected {
  folio: string
  estatus: string
  grupo_equipos: any[]
  grupo_vehiculos: any[]
  fecha_de_caducidad: string
  fecha_de_expedicion: string
  ubicacion: string
  nombre: string
  visita_a: VisitaA[]
  _id: string
  telefono: string
  email: string
  qr_pase: QrPase[]
}

export interface VisitaA {
  puesto: string
  nombre: string
  user_id: number
  email: string
  departamento: string
}

export interface QrPase {
  file_name: string
  file_url: string
  file: string
}

export const useGetCatalogoPaseNoJwt = (account_id:number, qr_code:string ) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<Response>({
    queryKey: ["useGetCatalogoPaseNoJwt"], 
    queryFn: async () => {
        const data = await getCatalogosPaseNoJwt(account_id, qr_code); 
        // if (!data.response || !data.response?.data ) {
        //   return {pass_selected:{}}
        // }
        console.log("PASS SELEC", data.response)
        return data.response|| null;
    },

    staleTime: 1000 * 60 * 5,  // 5 minutos de datos frescos antes de ser considerados obsoletos
    cacheTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: true,  // No hacer refetch cuando la ventana vuelva a enfocarse
    refetchOnReconnect: true,
  
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
