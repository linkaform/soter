import { getTipoConcesion } from "@/lib/articulos-concesionados";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCatalogoConcesion = (location:string,tipo:string, isModalOpen:boolean) => {
  const { data: dataCon, isLoading:isLoadingCon, error: errorCon } = useQuery<any>({
    queryKey: ["getTipoConcesion", location], 
    enabled:isModalOpen,
    queryFn: async () => {
        const data = await getTipoConcesion(location,""); 
        const textMsj = errorMsj(data) 
      if(textMsj){
        toast.error(`Error al obtener catalogo de articulos, Error: ${data.error}`)
        return []
      }else{
        return data ? data?.response?.data  : []
      }
    },
   
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  const { data: dataConSub, isLoading: isLoadingConSub, error: errorConSub } = useQuery<any>({
    queryKey: ["getTipoConcesionSub", location, tipo], 
    enabled:isModalOpen,
    queryFn: async () => {
        const data = await getTipoConcesion(location, tipo); 
        const textMsj = errorMsj(data) 
      if(textMsj){
        toast.error(`Error al obtener catalogo de artículos, Error: ${data.error}`);
        return []
      }else{
        return data ? data?.response?.data : []
      }
    },
   
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });


  return {
    dataCon,
    isLoadingCon,
    errorCon,

    dataConSub,
    isLoadingConSub,
    errorConSub,
  };
};
