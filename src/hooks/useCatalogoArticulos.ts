import { getTipoArticulo } from "@/lib/articulos-perdidos";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCatalogoArticulos = (tipo:string, isModalOpen:boolean) => {
  const { data: data, isLoading, error } = useQuery<any>({
    queryKey: ["getTipoArticulo"], 
    enabled:isModalOpen,
    queryFn: async () => {
        const data = await getTipoArticulo(""); 
        const textMsj = errorMsj(data) 
      if(textMsj){
        toast.error(`Error al obtener catalogo de artículos, Error: ${data.error}`)
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

  const { data: dataArticuloSub, isLoading:isLoadingArticuloSub, error:errorArticuloSub } = useQuery<any>({
    queryKey: ["getTipoArticuloSub", tipo], 
    enabled:isModalOpen,
    queryFn: async () => {
        const data = await getTipoArticulo(tipo); 
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
    data,
    isLoading,
    error,
    dataArticuloSub,
    isLoadingArticuloSub,
    errorArticuloSub,
  };
};
