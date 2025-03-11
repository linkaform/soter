import { getCatalogoAreaEmpleado } from "@/lib/getCatalogoAreaEmpleado";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoAreaEmpleado = (isSuccess:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoAreaEmpleado"], 
    enabled:isSuccess,
    queryFn: async () => {
        const data = await getCatalogoAreaEmpleado();
        const textMsj = errorMsj(data)  //COMO MANDAR LOS MSJS POR MEDIO DE ERROR
        if (textMsj){
          throw new Error (`Error al obtener catalogo de Area Empleado, Error: ${data.error}`);
        }else {
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
