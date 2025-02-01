/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogoPasesLocation } from "@/lib/get-catalogos-pase-location";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoPaseLocation = () => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoPasesLocation"], 
    queryFn: async () => {
        const data = await getCatalogoPasesLocation(); 
        if (!data.response || !data.response?.data || !data.response?.data?.ubicaciones_user) {
          console.error("Error al cargar las ubicaciones");
        }
        return data.response?.data?.ubicaciones_user;
    },

    staleTime: 1000 * 60 * 5,  
    cacheTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: true, 
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


