/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogoPasesLocation } from "@/lib/get-catalogos-pase-location";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoPaseLocation = () => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoPasesLocation"], 
    queryFn: async () => {
        const data = await getCatalogoPasesLocation(); 
        if (!data.response || !data.response?.data || !data.response?.data?.ubicaciones_user) {
          throw new Error("Error al cargar las ubicaciones");
        }
        return data.response?.data?.ubicaciones_user;
    },

    staleTime: 1000 * 60 * 5,  // 5 minutos de datos frescos antes de ser considerados obsoletos
    cacheTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: true,  // No hacer refetch cuando la ventana vuelva a enfocarse
    refetchOnReconnect: true,
  
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};


