import { getCatalogoAreaEmpleado } from "@/lib/get-catalogo-area-empleado";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCatalogoAreaEmpleado = (isSuccess:boolean, location:string, bitacora:string) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoAreaEmpleado", location, bitacora ], 
    enabled: isSuccess,
    queryFn: async () => {
        const data = await getCatalogoAreaEmpleado(location, bitacora);
        const textMsj = errorMsj(data)
        if (textMsj){
          toast.error(`Error al obtener catalogo de Area Empleado, Error: ${data.error}`);
          return []
        }else {
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
