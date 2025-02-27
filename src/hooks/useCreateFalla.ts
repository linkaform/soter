import { crearFalla, inputFalla } from "@/lib/create-falla";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useCreateFalla = (data_failure: inputFalla | null) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoFallas", data_failure], 
    enabled:false,
    queryFn: async () => {
        const data = await crearFalla(data_failure); 
        const hasError= data.response.data.status_code
        if(hasError == 400){
          const textMsj = errorMsj(data.response.data) 
          throw new Error(`Error al crear Falla, Error: ${textMsj?.text}`);
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
