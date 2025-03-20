import { getTipoArticulo } from "@/lib/articulos-perdidos";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoArticulos = (tipo:string, isModalOpen:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getTipoArticulo", tipo], 
    enabled:isModalOpen,
    queryFn: async () => {
        const data = await getTipoArticulo(tipo); 
        const textMsj = errorMsj(data) 
      if(textMsj){
        throw new Error(`Error al obtener catalogo de artículos, Error: ${data.error}`);
      }else{
        return data.response?.data
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
    isFetching,
    refetch,
  };
};
