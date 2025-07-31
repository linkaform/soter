import { catalogAreasRondin } from "@/lib/rondines";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useCatalogAreasRondin = (ubicacion:string, isModalOpen:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["catalogAreasRondin", ubicacion], 
    enabled:isModalOpen && ubicacion ? true:false,
    queryFn: async () => {
        const data = await catalogAreasRondin(ubicacion); 
        const textMsj = errorMsj(data) 
      if(textMsj){
        throw new Error(`Error al obtener catalogo de areas de rondin, Error: ${data.error}`);
      }else{
        return data.response?.data?.map((u: any) => ({ id: u, name: u }))
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
