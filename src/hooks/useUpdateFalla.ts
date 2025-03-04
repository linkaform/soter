import { inputFalla, updateFalla } from "@/lib/update-falla";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useUpdateFalla = (data_failure_update: inputFalla | null, folio:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["updateFalla", data_failure_update, folio], 
    enabled:false,
    queryFn: async () => {
        const data = await updateFalla(data_failure_update, folio); 
        const textMsj = errorMsj(data) 
        if(textMsj){
          throw new Error(`Error al obtener catalogo de Fallas, Error: ${data.error}`);
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
