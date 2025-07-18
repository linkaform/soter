import { getCatalogoFallas } from "@/lib/fallas";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoFallas = (tipo:string, isModalOpen:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoFallas", tipo], 
    enabled:isModalOpen && tipo ? true:false,
    queryFn: async () => {
        const data = await getCatalogoFallas(tipo); 
        const textMsj = errorMsj(data) 
      if(textMsj){
        throw new Error(`Error al obtener catalogo de Fallas, Error: ${data.error}`);
      }else{
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
