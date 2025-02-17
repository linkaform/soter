/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogosPaseNoJwt } from "@/lib/get-catalogos_pase_no_jwt";
import { useQuery } from "@tanstack/react-query";


export interface Root {
  response?: Response
  success?: boolean
  log?: string
}

export interface Response {
  data: Data
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
  foto?: Foto[]
  identificacion?: Foto[]

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

export interface Foto {
  file_name: string
  file_url: string
}


export const useGetCatalogoPaseNoJwt = (account_id:number, qr_code:string ) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<Data>({
    queryKey: ["useGetCatalogoPaseNoJwt"], 
    queryFn: async () => {
        const data = await getCatalogosPaseNoJwt(account_id, qr_code); 
        return data.response?.data ?? {};
          },

    staleTime: 1000 * 60 * 5, 
    refetchOnWindowFocus: true,  
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
