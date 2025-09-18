/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogosPaseNoJwt } from "@/lib/get-catalogos_pase_no_jwt";
import { errorMsj } from "@/lib/utils";
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
  ubicacion: string[]
  nombre: string
  visita_a: VisitaA[]
  _id: string
  telefono: string
  email: string
  qr_pase: QrPase[]
  foto?: Foto[]
  identificacion?: Foto[]
  google_wallet_pass_url: string
  pdf_to_img: Foto[]
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


export const useGetCatalogoPaseNoJwt = (account_id:number|null, qr_code:string, enable:boolean) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<Data>({
    queryKey: ["useGetCatalogoPaseNoJwt"], 
    enabled:enable,
    queryFn: async () => {
        const data = await getCatalogosPaseNoJwt(account_id, qr_code); 
        const hasError = (!data?.success) || (data?.response?.data?.status_code === 400 )
        if (hasError) {
          const textMsj = errorMsj(data)
          throw new Error(`Error al obtener pase, Error: ${textMsj?.text}`);
        } else {
            return data.response?.data
        }
    },
          
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
