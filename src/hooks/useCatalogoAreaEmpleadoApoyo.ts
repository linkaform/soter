import { getCatalogoAreaEmpleadoApoyo } from "@/lib/get-catalogo-area-empleado-apoyo";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCatalogoAreaEmpleadoApoyo = (isSuccess:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoAreaEmpleadoApoyo"], 
    enabled:isSuccess,
    queryFn: async () => {
        const data = await getCatalogoAreaEmpleadoApoyo();
        const textMsj = errorMsj(data) 
        if(textMsj){
          toast.error(`Error al obtener catalogo de Area Empleado Apoyo, Error: ${data.error}`);
          return []
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
