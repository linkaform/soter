import { getConfSeguridad } from "@/lib/get-configuracion-seguridad";
import { useQuery } from "@tanstack/react-query";

export const useGetConfSeguridad = (location:string[]) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getConfSeguridad", location], 
    enabled: location?true:false, 
    queryFn: async () => {
        const data = await getConfSeguridad(location); 
        return data.response?.data.requerimientos || []; 
    },
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch
  };
};
