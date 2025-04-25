import { AccessPass, addNewVisit, exitRegister, getAccessAssets, searchAccessPass } from "@/lib/access"
import { errorMsj } from "@/lib/utils"
import { useAccessStore } from "@/store/useAccessStore"
import { useShiftStore } from "@/store/useShiftStore"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"


export interface SearchAccessPass {
  empresa: any[]
  curp: string
  config_dia_de_acceso: string
  visita_a_departamento: any[][]
  visita_a_user_id: any[][]
  fecha_de_expedicion: string
  grupo_instrucciones_pase: any[]
  motivo_visita: string
  comentario: any[]
  folio: string
  grupo_vehiculos: any[]
  status_pase: string
  visita_a_puesto: any[][]
  tipo_movimiento: string
  ubicacion: string
  nombre: string
  telefono: string
  email: string
  limitado_a_dias: string | string[]
  grupo_areas_acceso: any[]
  foto: Foto[]
  gafete_id: any
  estatus: string
  visita_a_email: any[][]
  grupo_equipos: any[]
  ultimo_acceso: any[]
  identificacion: Identificacion[]
  visita_a: any[]
  locker_id: any
  certificaciones: any[]
  fecha_de_caducidad: Date
  tipo_de_pase: string
  _id: string
  qr_pase: QrPase[]
  limite_de_acceso?: number;}

export interface Foto {
  file_name: string
  file_url: string
}

export interface Image {
    file_name: string
    file_url: string
  }
  

export interface Identificacion {
  file_name: string
  file_url: string
}

export interface QrPase {
  file_name: string
  file_url: string
  file: string
}

export const useSearchPass = (enable:boolean) => {
  const { area, location, setLoading, isLoading: loading } = useShiftStore()
  const { passCode , setPassCode, clearPassCode} = useAccessStore()
  const queryClient = useQueryClient()

  const {
    data: searchPass,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<SearchAccessPass>({
    queryKey: ["serchPass",area, location, passCode],
    enabled:!!(area && location && passCode),
    queryFn: async () => {
      const data = await searchAccessPass(area, location, passCode)
      const textMsj = errorMsj(data) 
      if (textMsj){
        toast.error(`Error al buscar pase, Error: ${textMsj.text}`);
        clearPassCode()
        return {}
      }else {
        // setPassCode(passCode)
        return data ? data?.response?.data : {};
      }
    },
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })




  const { data: assets } = useQuery<any>({
    queryKey: ["getAssetsAccess"],
    enabled:enable,
    queryFn: async () => {
      const data = await getAccessAssets(location)
      return data.response?.data || {}
    },
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
    refetchOnReconnect: true,
    // staleTime: 1000 * 60 * 5,
  })


  const exitRegisterAccess = useMutation({
    mutationFn: async () => {
      const data = await exitRegister(area, location, passCode)
      return data.response?.data || []
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (response: any) => {
      console.log("exitRegisterAccess:", response)

      queryClient.invalidateQueries({ queryKey: ["searchPass"] })
    },
    onError: (err) => {
      console.log(err)
    },
    onSettled: () => {
      setLoading(false)
    },
  })

  const fetchAccessAssets = useMutation({
    mutationFn: async () => {
      const data = await getAccessAssets(location)

      return data.response?.data || []
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: (response: any) => {
      console.log("Error Obteniendo los assets", response)
    },
    onError: (err) => {
      console.log("Error Obteniendo los assets", err)
    },
    onSettled: () => {
      setLoading(false)
    },
  })



     const registerNewVisit = useMutation({
      mutationFn: ({ location, access_pass }: { location: string; access_pass: AccessPass }) =>
        addNewVisit(location, access_pass),
    
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: (response) => {
        const id = response?.response?.data?.json?.id;
    
        if (id) {
          setPassCode(id);
          console.log("ID de la nueva visita guardado en passCode:", id);
        } else {
          console.error("No se encontró el ID en la respuesta.");
        }
    
        queryClient.invalidateQueries({ queryKey: ["searchPass"] });
        queryClient.invalidateQueries({ queryKey: ["getTemporaryPasses"] });
        

      },
    
      onError: (error: any) => {
        console.error("Error registrando nueva visita:", error);
      },
      onSettled: () => {
        setLoading(false);
      },
    });
    

  return {
    /* Obtener Acceso */
    searchPass,
    isLoading,
    loading,
    error,
    isFetching,
    refetch,

    /* Registrar Salida */
    exitRegisterAccess,

    /* obtener assets registrar visita */
    fetchAccessAssets,

    /* nueva visita */
    registerNewVisit,


    /* assets visita */
    assets
  }
}












