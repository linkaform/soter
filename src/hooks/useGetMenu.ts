/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMenu } from "@/lib/get-menu";
import { useQuery } from "@tanstack/react-query";

export const useGetMenu = () => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getMenu"], 
    queryFn: async () => {
        const data = await getMenu(); 
        if (!data.response || !data.response?.data || !data.response?.data.menus) {
          console.error("Datos de menú no disponibles");
        }
        return data.response?.data.menus;
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


